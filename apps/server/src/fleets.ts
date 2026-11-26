import { addShips, countShips, fight, lootShares, planSend, returnTicks, shipsValue, tickAt, warnTick, type Cost, type FightResult, type Participant, type Ships } from '@aquata/rules';
import type { Db, Queryable } from './db/index.ts';
import type { Round } from './round.ts';
import { stationIn } from './economy.ts';

export interface FleetRow {
  id: number; round_id: number; player_id: number; target_id: number; mission: 'attack' | 'defend';
  status: 'outbound' | 'engaged' | 'returning'; ships: Ships; depart_tick: number; arrive_tick: number;
  warn_tick: number; fight_ticks: number; fought: number; cargo: Cost; leg: Leg | null;
}
export interface Leg { from: { x: number; y: number }; to: { x: number; y: number }; start: number; end: number }
const legJson = (from: { x: number; y: number }, to: { x: number; y: number }, start: number, end: number) =>
  JSON.stringify({ from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y }, start, end });
interface StationRow { id: number; station_name: string; x: number; y: number; buildings: { werft: number; antrieb: number; sonar: number }; ships: Ships; owner: string | null }

const ZERO: Cost = { alu: 0, stahl: 0, pu: 0 };
const addCost = (a: Cost, b: Cost): Cost => ({ alu: a.alu + b.alu, stahl: a.stahl + b.stahl, pu: a.pu + b.pu });
const worth = (s: Ships) => { const v = shipsValue(s); return v.alu + v.stahl + v.pu; };
const fmtN = (n: number) => Math.floor(n).toLocaleString('de-DE');

async function stationRow(q: Queryable, id: number): Promise<StationRow> {
  const { rows } = await q.query<StationRow>(
    `select p.id, p.station_name, p.x, p.y, p.buildings, p.ships, coalesce(a.name, 'Bot') as owner from players p left join accounts a on a.id = p.account_id where p.id = $1`, [id]);
  if (!rows[0]) throw new Error('Station nicht gefunden');
  return rows[0];
}

async function log(q: Queryable, playerId: number, tick: number, kind: string, text: string, reportId: number | null = null) {
  await q.query('insert into logbook (player_id, tick, kind, text, report_id) values ($1, $2, $3, $4, $5)', [playerId, tick, kind, text, reportId]);
}

/** Der zuletzt vollständig abgearbeitete Tick */
export async function processedTick(q: Queryable, roundId: number) {
  return (await q.query<{ processed_tick: number }>('select processed_tick from rounds where id = $1', [roundId])).rows[0]!.processed_tick;
}

/** Flotte losschicken: Schiffe verlassen sofort den Hangar, Treibstoff wird sofort fällig */
export async function sendFleet(db: Db, round: Round, playerId: number, body: { target?: unknown; ships?: unknown; arriveTick?: unknown; fightTicks?: unknown; mission?: unknown }) {
  return db.tx(async (q) => {
    const targetId = Number(body.target);
    const mission = body.mission === 'defend' ? 'defend' : 'attack';
    const { rows } = await q.query<{ id: number }>('select id from players where id = $1 and round_id = $2', [targetId, round.id]);
    if (!rows[0]) return { error: 'Ziel nicht gefunden.' };
    const me = await stationRow(q, playerId), target = await stationRow(q, targetId);
    const ships: Ships = {};
    for (const [id, n] of Object.entries((body.ships ?? {}) as Record<string, unknown>)) if (Number(n) > 0) ships[id] = Number(n);
    const nowTick = Math.max(tickAt(round.startedAt, round.tickSeconds, Date.now()), await processedTick(q, round.id));
    let error = '' as string;
    let fleetId = 0;
    await stationIn<null>(q, playerId, async (s) => {
      const plan = planSend({
        from: me, to: target, driveLevel: s.buildings.antrieb, ships, home: s.ships, pu: s.res.pu, nowTick,
        arriveTick: body.arriveTick == null ? undefined : Number(body.arriveTick), fightTicks: Number(body.fightTicks ?? 1), self: targetId === playerId,
      });
      if (!plan.ok) { error = plan.error; return { state: s, result: null }; }
      const warn = warnTick(me, target, nowTick, plan.arriveTick, target.buildings.sonar);
      const ins = await q.query<{ id: number }>(
        `insert into fleets (round_id, player_id, target_id, mission, status, ships, depart_tick, arrive_tick, warn_tick, fight_ticks, leg)
         values ($1, $2, $3, $4, 'outbound', $5, $6, $7, $8, $9, $10) returning id`,
        [round.id, playerId, targetId, mission, JSON.stringify(ships), nowTick, plan.arriveTick, warn, Number(body.fightTicks ?? 1), legJson(me, target, nowTick, plan.arriveTick)]);
      fleetId = ins.rows[0]!.id;
      return { state: { ...s, ships: addShips(s.ships, ships, -1), res: { ...s.res, pu: s.res.pu - plan.fuel } }, result: null };
    });
    if (error) return { error };
    return { id: fleetId };
  });
}

/** Rückruf: Auf dem Hinweg kehrt die Flotte um (so lange zurück, wie sie schon flog), am Ziel fliegt sie den vollen Rückweg */
export async function recallFleet(db: Db, round: Round, playerId: number, fleetId: number) {
  return db.tx(async (q) => {
    const { rows } = await q.query<FleetRow>('select * from fleets where id = $1 and player_id = $2 for update', [fleetId, playerId]);
    const f = rows[0];
    if (!f) return { error: 'Flotte nicht gefunden.' };
    if (f.status === 'returning') return { error: 'Die Flotte ist schon auf dem Heimweg.' };
    const now = await processedTick(q, round.id);
    const home = await stationRow(q, f.player_id), target = await stationRow(q, f.target_id);
    let arrive: number, from: { x: number; y: number } = target;
    if (f.status === 'outbound') {
      arrive = now + Math.max(1, now - f.depart_tick);
      // umkehren, wo die Flotte gerade ist
      const l = f.leg;
      if (l) { const k = Math.min(1, Math.max(0, (now - l.start) / Math.max(1, l.end - l.start))); from = { x: Math.round(l.from.x + (l.to.x - l.from.x) * k), y: Math.round(l.from.y + (l.to.y - l.from.y) * k) }; }
    } else arrive = now + returnTicks(target, home, home.buildings.antrieb, f.ships);
    await q.query(`update fleets set status = 'returning', arrive_tick = $2, leg = $3 where id = $1`, [f.id, arrive, legJson(from, home, now, arrive)]);
    return { ok: true, arriveTick: arrive };
  });
}

/**
 * Ein Tick, in einer Transaktion:
 * 1. Heimkehrer landen (Schiffe und Fracht zurück in die Station)
 * 2. Flotten, deren Ankunft fällig ist, sind am Ziel
 * 3. An jedem angegriffenen Ziel wird gekämpft: Angreifer gegen Hangar plus Verteidigungsflotten
 * 4. Wer fertig ist (Kampfticks aufgebraucht oder keine Schiffe mehr), fliegt heim
 */
export async function processTick(q: Queryable, round: Round, tick: number) {
  // 1. Heimkehrer
  const back = (await q.query<FleetRow>(`select * from fleets where round_id = $1 and status = 'returning' and arrive_tick <= $2 order by id`, [round.id, tick])).rows;
  for (const f of back) {
    await stationIn<null>(q, f.player_id, async (s) => ({ state: { ...s, ships: addShips(s.ships, f.ships), res: addCost(s.res, f.cargo) }, result: null }));
    await q.query('delete from fleets where id = $1', [f.id]);
    const target = await stationRow(q, f.target_id);
    const cargo = f.cargo.alu + f.cargo.stahl + f.cargo.pu;
    await log(q, f.player_id, tick, 'heimkehr', `Flotte von ${target.station_name} zurück: ${countShips(f.ships)} Schiffe${cargo > 0 ? `, Fracht ${fmtN(f.cargo.alu)} Alu · ${fmtN(f.cargo.stahl)} Stahl · ${fmtN(f.cargo.pu)} Pu` : ''}.`);
  }

  // 2. Ankunft
  await q.query(`update fleets set status = 'engaged', leg = null where round_id = $1 and status = 'outbound' and arrive_tick <= $2`, [round.id, tick]);

  // 3. Kämpfe
  const engaged = (await q.query<FleetRow>(`select * from fleets where round_id = $1 and status = 'engaged' order by id`, [round.id])).rows;
  const targets = [...new Set(engaged.filter((f) => f.mission === 'attack').map((f) => f.target_id))];
  for (const targetId of targets) {
    const attackers = engaged.filter((f) => f.target_id === targetId && f.mission === 'attack');
    const helpers = engaged.filter((f) => f.target_id === targetId && f.mission === 'defend');
    await stationIn(q, targetId); // fertige Schiffe der Werft zählen mit
    const target = await stationRow(q, targetId);
    const homeShips: Ships = Object.fromEntries(Object.entries(target.ships).filter(([, n]) => n > 0));
    const defenders: Participant[] = [{ id: 0, ships: homeShips }, ...helpers.map((f) => ({ id: f.id, ships: f.ships }))];
    const result = fight(attackers.map((f) => ({ id: f.id, ships: f.ships })), defenders, round.id * 1_000_003 + tick * 7919 + targetId);
    await applyFight(q, round, tick, target, attackers, helpers, result);
  }

  // Verteidiger ohne Angriff zählen ihre Ticks trotzdem
  const idleHelpers = engaged.filter((f) => f.mission === 'defend' && !targets.includes(f.target_id));
  for (const f of idleHelpers) await q.query('update fleets set fought = fought + 1 where id = $1', [f.id]);

  // 4. Heimflug
  const done = (await q.query<FleetRow>(`select * from fleets where round_id = $1 and status = 'engaged' and (fought >= fight_ticks or ships = '{}'::jsonb)`, [round.id])).rows;
  for (const f of done) {
    const home = await stationRow(q, f.player_id), target = await stationRow(q, f.target_id);
    const arrive = tick + returnTicks(target, home, home.buildings.antrieb, f.ships);
    await q.query(`update fleets set status = 'returning', arrive_tick = $2, leg = $3 where id = $1`, [f.id, arrive, legJson(target, home, tick, arrive)]);
  }
}

async function applyFight(q: Queryable, round: Round, tick: number, target: StationRow, attackers: FleetRow[], helpers: FleetRow[], r: FightResult) {
  const owners = new Map<number, StationRow>();
  const owner = async (pid: number) => owners.get(pid) ?? (owners.set(pid, await stationRow(q, pid)), owners.get(pid)!);

  // Beute: nur wenn die Verteidigung weg ist, nach verbliebenem Flottenwert verteilt
  let loot: Cost[] = attackers.map(() => ZERO);
  await stationIn<null>(q, target.id, async (s) => {
    const home = r.defenders[0]!;
    let res = addCost(s.res, home.debris); // Müll der Heimverteidigung kommt sofort an
    if (r.winner === 'attacker') {
      loot = lootShares(res, r.attackers.map((a) => worth(a.after)));
      const taken = loot.reduce(addCost, ZERO);
      res = { alu: res.alu - taken.alu, stahl: res.stahl - taken.stahl, pu: res.pu - taken.pu };
    }
    return { state: { ...s, ships: addShips(s.ships, home.lost, -1), res }, result: null };
  });

  for (const [i, f] of attackers.entries()) {
    const a = r.attackers[i]!;
    await q.query('update fleets set ships = $2, cargo = $3, fought = fought + 1 where id = $1', [f.id, JSON.stringify(a.after), JSON.stringify(addCost(addCost(f.cargo, a.debris), loot[i]!))]);
  }
  for (const [i, f] of helpers.entries()) {
    const d = r.defenders[i + 1]!;
    await q.query('update fleets set ships = $2, cargo = $3, fought = fought + 1 where id = $1', [f.id, JSON.stringify(d.after), JSON.stringify(addCost(f.cargo, d.debris))]);
  }

  const side = async (fleets: FleetRow[] | null, results: FightResult['attackers'], lootFor?: Cost[]) =>
    Promise.all(results.map(async (p, i) => {
      const f = fleets ? fleets[i] : null;
      const pid = f ? f.player_id : target.id;
      const o = await owner(pid);
      return { playerId: pid, station: o.station_name, owner: o.owner, fleetId: f?.id ?? null, fightNo: f ? f.fought + 1 : null, of: f?.fight_ticks ?? null, before: p.before, after: p.after, lost: p.lost, debris: p.debris, loot: lootFor?.[i] ?? ZERO };
    }));
  const data = {
    tick,
    target: { id: target.id, station: target.station_name, owner: target.owner, x: target.x, y: target.y },
    winner: r.winner,
    phases: r.phases,
    attackers: await side(attackers, r.attackers, loot),
    defenders: [...(await side(null, [r.defenders[0]!])), ...(await side(helpers, r.defenders.slice(1)))],
  };
  const rep = await q.query<{ id: number }>('insert into reports (round_id, tick, target_id, data) values ($1, $2, $3, $4) returning id', [round.id, tick, target.id, JSON.stringify(data)]);
  const reportId = rep.rows[0]!.id;
  const readers = new Map<number, 'attacker' | 'defender'>();
  for (const f of attackers) readers.set(f.player_id, 'attacker');
  readers.set(target.id, 'defender');
  for (const f of helpers) if (!readers.has(f.player_id)) readers.set(f.player_id, 'defender');
  for (const [pid, s] of readers) {
    await q.query('insert into report_readers (report_id, player_id, side) values ($1, $2, $3) on conflict do nothing', [reportId, pid, s]);
    const won = (s === 'attacker') === (r.winner === 'attacker');
    const verdict = r.winner === 'draw' ? 'unentschieden' : won ? 'gewonnen' : 'verloren';
    await log(q, pid, tick, 'kampf', `Kampf an ${target.station_name}: ${verdict}.`, reportId);
  }
}

/** Alle fälligen Ticks nacheinander, jeder in einer eigenen Transaktion. Mehrfachaufrufe sind harmlos. */
export async function catchUp(db: Db, round: Round, now = Date.now()) {
  const current = tickAt(round.startedAt, round.tickSeconds, now);
  let processed: number[] = [];
  for (;;) {
    const next = await db.tx(async (q) => {
      const done = (await q.query<{ processed_tick: number }>('select processed_tick from rounds where id = $1 for update', [round.id])).rows[0]!.processed_tick;
      if (done >= current) return null;
      const t = done + 1;
      await processTick(q, round, t);
      await q.query('update rounds set processed_tick = $2 where id = $1', [round.id, t]);
      return t;
    });
    if (next == null) return processed;
    processed = [...processed, next];
  }
}

/** Flotten aus Sicht eines Spielers: eigene, und fremde, die er schon im Sonar hat */
export async function fleetsView(db: Db, round: Round, playerId: number) {
  const tick = await processedTick(db, round.id);
  const names = async (ids: number[]) => {
    if (!ids.length) return new Map<number, { station: string; owner: string; x: number; y: number }>();
    const { rows } = await db.query<{ id: number; station_name: string; owner: string; x: number; y: number }>(
      `select p.id, p.station_name, coalesce(a.name, 'Bot') as owner, p.x, p.y from players p left join accounts a on a.id = p.account_id where p.id = any($1::int[])`, [ids]);
    return new Map(rows.map((r) => [r.id, { station: r.station_name, owner: r.owner, x: r.x, y: r.y }]));
  };
  const own = (await db.query<FleetRow>('select * from fleets where player_id = $1 order by arrive_tick, id', [playerId])).rows;
  const incoming = (await db.query<FleetRow>(
    `select * from fleets where target_id = $1 and player_id <> $1 and ((status = 'outbound' and warn_tick <= $2) or status = 'engaged') order by arrive_tick, id`, [playerId, tick])).rows;
  const n = await names([...new Set([...own.map((f) => f.target_id), ...incoming.map((f) => f.player_id)])]);
  return {
    tick,
    own: own.map((f) => ({ id: f.id, mission: f.mission, status: f.status, ships: f.ships, departTick: f.depart_tick, arriveTick: f.arrive_tick, fightTicks: f.fight_ticks, fought: f.fought, cargo: f.cargo, leg: f.leg, target: { id: f.target_id, ...n.get(f.target_id)! } })),
    // Sonar zeigt nur die Größe, keine Zusammensetzung
    incoming: incoming.map((f) => ({ id: f.id, mission: f.mission, status: f.status, arriveTick: f.arrive_tick, size: countShips(f.ships), leg: f.leg, from: { id: f.player_id, ...n.get(f.player_id)! } })),
  };
}

export async function reportsList(db: Db, playerId: number) {
  return (await db.query<{ id: number; tick: number; side: string; seen: boolean; data: { winner: string; target: { station: string } } }>(
    `select r.id, r.tick, rr.side, rr.seen, r.data from reports r join report_readers rr on rr.report_id = r.id where rr.player_id = $1 order by r.id desc limit 50`, [playerId])).rows
    .map((r) => ({ id: r.id, tick: r.tick, side: r.side, seen: r.seen, winner: r.data.winner, target: r.data.target.station }));
}

export async function reportGet(db: Db, playerId: number, id: number) {
  const { rows } = await db.query<{ data: unknown; side: string }>(
    'select r.data, rr.side from reports r join report_readers rr on rr.report_id = r.id where r.id = $1 and rr.player_id = $2', [id, playerId]);
  if (!rows[0]) return null;
  await db.query('update report_readers set seen = true where report_id = $1 and player_id = $2', [id, playerId]);
  return { id, side: rows[0].side, ...(rows[0].data as object) };
}

export async function logbookGet(db: Db, playerId: number) {
  return (await db.query<{ id: number; tick: number; kind: string; text: string; report_id: number | null }>(
    'select id, tick, kind, text, report_id from logbook where player_id = $1 order by id desc limit 30', [playerId])).rows
    .map((l) => ({ id: l.id, tick: l.tick, kind: l.kind, text: l.text, reportId: l.report_id }));
}
