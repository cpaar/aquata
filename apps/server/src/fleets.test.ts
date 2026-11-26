import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp, type App } from './app.ts';
import { loadConfig } from './config.ts';
import { processTick } from './fleets.ts';

describe('Flotten, Tick und Kampf', () => {
  let a: App;
  const cookies: string[] = [];
  const ids: number[] = [];
  let tick = 0;

  const runTick = async () => {
    tick = (await a.db.query<{ processed_tick: number }>('select processed_tick from rounds where id = $1', [a.round.id])).rows[0]!.processed_tick + 1;
    await a.db.tx(async (q) => { await processTick(q, a.round, tick); await q.query('update rounds set processed_tick = $2 where id = $1', [a.round.id, tick]); });
  };
  const get = (i: number, url: string) => a.app.inject({ url, headers: { cookie: cookies[i]! } }).then((r: { json: () => any }) => r.json());
  const post = (i: number, url: string, payload: object) => a.app.inject({ method: 'POST', url, payload, headers: { cookie: cookies[i]! } });

  beforeAll(async () => {
    a = await buildApp({ ...loadConfig({}), dataDir: 'memory://', webDist: '/nonexistent', tickSeconds: 120 }, { ticker: false });
    for (const [i, p] of [[0, { x: 200, y: 200 }], [1, { x: 300, y: 260 }], [2, { x: 260, y: 330 }]] as const) {
      const reg = await a.app.inject({ method: 'POST', url: '/api/auth/register', payload: { email: `f${i}@x.de`, name: `Flotte${i}`, password: 'geheim123' } });
      cookies[i] = String(reg.headers['set-cookie']).split(';')[0]!;
      const pl = await a.app.inject({ method: 'POST', url: '/api/player', payload: { stationName: `Basis${i}`, ...p }, headers: { cookie: cookies[i]! } });
      ids[i] = pl.json().player.id;
    }
    await a.db.query(`update players set ships = '{"piranha": 40, "mako": 5}' where id = $1`, [ids[0]]);
    await a.db.query(`update players set ships = '{"piranha": 4}' where id = $1`, [ids[1]]);
    await a.db.query(`update players set ships = '{"piranha": 6}' where id = $1`, [ids[2]]);
  });
  afterAll(() => a?.stop());

  it('schickt eine Flotte los: Schiffe und Treibstoff verlassen die Station', async () => {
    const before = await get(0, '/api/station');
    const res = await post(0, '/api/fleets', { target: ids[1], ships: { piranha: 30, mako: 5 }, fightTicks: 2 });
    expect(res.statusCode).toBe(200);
    const after = await get(0, '/api/station');
    expect(after.ships.piranha).toBe(10);
    expect(after.ships.mako ?? 0).toBe(0);
    expect(after.resources.pu).toBeLessThan(before.resources.pu);
    const f = res.json().own[0];
    expect(f).toMatchObject({ status: 'outbound', mission: 'attack', target: { id: ids[1] }, leg: { from: { x: 200, y: 200 }, to: { x: 300, y: 260 } } });
    expect((await post(0, '/api/fleets', { target: ids[0], ships: { piranha: 1 } })).statusCode).toBe(400);
    expect((await post(0, '/api/fleets', { target: ids[1], ships: { piranha: 99 } })).statusCode).toBe(400);
  });

  it('Verbündeter schickt Verteidigung, das Ziel sieht den Angriff spätestens 3 Ticks vorher', async () => {
    const own = (await get(0, '/api/fleets')).own[0];
    const ok = await post(2, '/api/fleets', { target: ids[1], ships: { piranha: 6 }, mission: 'defend', fightTicks: 3, arriveTick: own.arriveTick });
    expect(ok.statusCode).toBe(200);
    while (tick < own.arriveTick - 3) await runTick();
    const seen = await get(1, '/api/fleets');
    expect(seen.incoming.some((f: { from: { id: number }; mission: string; size: number }) => f.from.id === ids[0] && f.mission === 'attack' && f.size === 35)).toBe(true);
  });

  it('kämpft bei Ankunft, schreibt Berichte und Logbuch, plündert und fliegt heim', async () => {
    const own = (await get(0, '/api/fleets')).own[0];
    const resBefore = (await get(1, '/api/station')).resources;
    while (tick < own.arriveTick) await runTick();
    const reports = await get(0, '/api/reports');
    expect(reports.length).toBe(1);
    const rep = await get(0, `/api/reports/${reports[0].id}`);
    expect(rep.attackers[0].playerId).toBe(ids[0]);
    expect(rep.defenders.map((d: { playerId: number }) => d.playerId)).toEqual([ids[1], ids[2]]);
    expect(rep.phases.map((p: { phase: string }) => p.phase)).toEqual(['emp', 'erstschlag', 'normal']);
    expect((await get(1, '/api/reports')).length).toBe(1);
    expect((await get(2, '/api/reports')).length).toBe(1);
    expect((await get(1, '/api/logbook'))[0].text).toMatch(/Kampf an Basis1/);

    // zweiter Kampftick, danach Heimflug
    await runTick();
    const after = await get(0, '/api/fleets');
    expect(after.own[0].status).toBe('returning');
    expect(after.own[0].fought).toBe(2);
    const second = await get(0, `/api/reports/${(await get(0, '/api/reports'))[0].id}`);
    if (second.winner === 'attacker') expect(second.attackers[0].loot.alu).toBeGreaterThan(0);
    expect(resBefore.alu).toBeGreaterThan(0);
    const cargo = after.own[0].cargo;
    expect(cargo.alu + cargo.stahl).toBeGreaterThan(0); // mindestens Müll

    const homeBefore = (await get(0, '/api/station')).ships.piranha;
    const back = after.own[0].arriveTick;
    while (tick < back) await runTick();
    expect((await get(0, '/api/fleets')).own.length).toBe(0);
    const st = await get(0, '/api/station');
    expect(st.ships.piranha).toBeGreaterThanOrEqual(homeBefore);
    expect((await get(0, '/api/logbook'))[0].text).toMatch(/zurück/);
  });

  it('ruft eine Flotte auf dem Hinweg zurück', async () => {
    const res = await post(0, '/api/fleets', { target: ids[1], ships: { piranha: 2 } });
    const f = res.json().own.find((x: { status: string }) => x.status === 'outbound');
    await runTick();
    const r = await post(0, `/api/fleets/${f.id}/recall`, {});
    expect(r.statusCode).toBe(200);
    const g = r.json().own.find((x: { id: number }) => x.id === f.id);
    expect(g.status).toBe('returning');
    expect(g.arriveTick).toBe(tick + 1);
    expect(g.leg).toMatchObject({ to: { x: 200, y: 200 }, start: tick, end: tick + 1 });
    expect((await post(0, `/api/fleets/${f.id}/recall`, {})).statusCode).toBe(400);
  });
});
