import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { MAP, placementError, suggestSpots } from '@aquata/rules';
import type { Db } from './db/index.ts';
import type { Round } from './round.ts';
import { insertJob, startBuilding, startCollectors, startShips, startValues, stationView, withStation } from './economy.ts';
import type { BuildingId, Split } from '@aquata/rules';
import { accountFromRequest, createSession, hashPassword, requireAccount, SESSION_COOKIE, verifyPassword } from './auth.ts';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME = /^[\p{L}\p{N} _.-]{3,20}$/u;

interface PlayerRow { id: number; account_id: number | null; is_bot: boolean; station_name: string; x: number; y: number; name: string | null }

export function registerRoutes(app: FastifyInstance, db: Db, round: Round, secureCookies: boolean) {
  const cookieOpts = (expires: Date) => ({ path: '/', httpOnly: true, sameSite: 'lax' as const, secure: secureCookies, expires });

  const stations = async () =>
    (await db.query<PlayerRow>(
      `select p.id, p.account_id, p.is_bot, p.station_name, p.x, p.y, a.name from players p left join accounts a on a.id = p.account_id where p.round_id = $1 order by p.id`,
      [round.id],
    )).rows;

  app.post<{ Body: { email?: string; name?: string; password?: string } }>('/api/auth/register', async (req, reply) => {
    const email = (req.body?.email ?? '').trim().toLowerCase();
    const name = (req.body?.name ?? '').trim();
    const password = req.body?.password ?? '';
    if (!EMAIL.test(email)) return reply.code(400).send({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' });
    if (!NAME.test(name)) return reply.code(400).send({ error: 'Der Name braucht 3 bis 20 Zeichen (Buchstaben, Ziffern, Leerzeichen, _ . -).' });
    if (password.length < 8) return reply.code(400).send({ error: 'Das Passwort braucht mindestens 8 Zeichen.' });
    const taken = await db.query('select 1 from accounts where email = $1 or lower(name) = lower($2)', [email, name]);
    if (taken.rows.length) return reply.code(409).send({ error: 'E-Mail oder Name ist schon vergeben.' });
    const { rows } = await db.query<{ id: number }>('insert into accounts (email, name, password_hash) values ($1, $2, $3) returning id', [email, name, await hashPassword(password)]);
    const s = await createSession(db, rows[0]!.id);
    return reply.setCookie(SESSION_COOKIE, s.token, cookieOpts(s.expires)).send({ ok: true });
  });

  app.post<{ Body: { email?: string; password?: string } }>('/api/auth/login', async (req, reply) => {
    const email = (req.body?.email ?? '').trim().toLowerCase();
    const { rows } = await db.query<{ id: number; password_hash: string }>('select id, password_hash from accounts where email = $1', [email]);
    const acc = rows[0];
    if (!acc || !(await verifyPassword(req.body?.password ?? '', acc.password_hash))) return reply.code(401).send({ error: 'E-Mail oder Passwort stimmt nicht.' });
    const s = await createSession(db, acc.id);
    return reply.setCookie(SESSION_COOKIE, s.token, cookieOpts(s.expires)).send({ ok: true });
  });

  app.post('/api/auth/logout', async (req, reply) => {
    const token = req.cookies[SESSION_COOKIE];
    if (token) await db.query('delete from sessions where token = $1', [token]);
    return reply.clearCookie(SESSION_COOKIE, { path: '/' }).send({ ok: true });
  });

  const roundInfo = { id: round.id, name: round.name, startedAt: round.startedAt, tickSeconds: round.tickSeconds };

  /** Eigener Rundenspieler oder 401/404 */
  const myPlayer = async (req: FastifyRequest, reply: FastifyReply) => {
    const account = await accountFromRequest(db, req);
    if (!account) { reply.code(401).send({ error: 'Bitte anmelden.' }); return null; }
    const { rows } = await db.query<{ id: number }>('select id from players where round_id = $1 and account_id = $2', [round.id, account.id]);
    if (!rows[0]) { reply.code(404).send({ error: 'Du hast in dieser Runde noch keine Station.' }); return null; }
    return rows[0].id;
  };

  app.get('/api/station', async (req, reply) => {
    const pid = await myPlayer(req, reply);
    if (pid == null) return;
    return stationView(db, pid);
  });

  type Act = NonNullable<Parameters<typeof withStation<string | null>>[2]>;
  /** Station-Aktion: rechnet ab, führt aus, antwortet mit neuem Stand oder 400 mit Fehlertext */
  const action = (fn: (body: Record<string, unknown>) => Act) =>
    async (req: FastifyRequest, reply: FastifyReply) => {
      const pid = await myPlayer(req, reply);
      if (pid == null) return;
      const { result } = await withStation<string | null>(db, pid, fn((req.body ?? {}) as Record<string, unknown>));
      if (result) return reply.code(400).send({ error: result });
      return stationView(db, pid);
    };

  app.post('/api/station/build', action((b) => async (s, open, now, q, pid) => {
    const r = startBuilding(s, open, String(b.building) as BuildingId, now);
    if ('error' in r) return { state: s, result: r.error };
    await insertJob(q, pid, r.job);
    return { state: r.state, result: null };
  }));

  app.post('/api/station/collectors', action((b) => async (s, open, now, q, pid) => {
    const r = startCollectors(s, open, Number(b.amount), now);
    if ('error' in r) return { state: s, result: r.error };
    await insertJob(q, pid, r.job);
    return { state: r.state, result: null };
  }));

  app.post('/api/station/ships', action((b) => async (s, open, now, q, pid) => {
    const r = startShips(s, open, String(b.ship), Number(b.amount), now);
    if ('error' in r) return { state: s, result: r.error };
    await insertJob(q, pid, r.job);
    return { state: r.state, result: null };
  }));

  app.post('/api/station/split', action((b) => async (s) => {
    const split = { alu: Number(b.alu), stahl: Number(b.stahl), pu: Number(b.pu) } as Split;
    if (![split.alu, split.stahl, split.pu].every((v) => Number.isFinite(v) && v >= 0) || split.alu + split.stahl + split.pu <= 0)
      return { state: s, result: 'Ungültige Aufteilung.' };
    return { state: { ...s, split }, result: null };
  }));

  app.get('/api/me', async (req) => {
    const account = await accountFromRequest(db, req);
    if (!account) return { account: null, player: null, round: roundInfo };
    const { rows } = await db.query<PlayerRow>('select id, station_name, x, y from players where round_id = $1 and account_id = $2', [round.id, account.id]);
    const p = rows[0];
    return { account, player: p ? { id: p.id, stationName: p.station_name, x: p.x, y: p.y } : null, round: roundInfo };
  });

  app.get('/api/map', async (req) => {
    const account = await accountFromRequest(db, req);
    const all = await stations();
    return {
      size: { width: MAP.width, height: MAP.height },
      seed: round.id,
      stations: all.map((s) => ({ id: s.id, name: s.station_name, owner: s.is_bot ? 'Bot' : s.name, x: s.x, y: s.y, own: account != null && s.account_id === account.id, bot: s.is_bot })),
      suggestions: suggestSpots(all, 3, round.id * 7919 + all.length),
    };
  });

  app.post<{ Body: { stationName?: string; x?: number; y?: number } }>('/api/player', async (req, reply) => {
    const account = await requireAccount(db, req, reply);
    if (!account) return;
    const stationName = (req.body?.stationName ?? '').trim();
    const x = Math.round(Number(req.body?.x)), y = Math.round(Number(req.body?.y));
    if (!NAME.test(stationName)) return reply.code(400).send({ error: 'Der Stationsname braucht 3 bis 20 Zeichen.' });
    if (!Number.isFinite(x) || !Number.isFinite(y)) return reply.code(400).send({ error: 'Bitte einen Platz auf der Karte wählen.' });
    const all = await stations();
    if (all.some((s) => s.account_id === account.id)) return reply.code(409).send({ error: 'Du hast in dieser Runde schon eine Station.' });
    const err = placementError({ x, y }, all);
    if (err) return reply.code(400).send({ error: err });
    const sv = startValues(Date.now());
    const { rows } = await db.query<{ id: number }>(
      `insert into players (round_id, account_id, station_name, x, y, res_alu, res_stahl, res_pu, res_at, collectors, split, buildings)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning id`,
      [round.id, account.id, stationName, x, y, sv.res_alu, sv.res_stahl, sv.res_pu, sv.res_at, sv.collectors, sv.split, sv.buildings],
    );
    return { player: { id: rows[0]!.id, stationName, x, y } };
  });
}
