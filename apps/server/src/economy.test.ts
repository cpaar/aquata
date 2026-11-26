import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildingCost, COLLECTOR, START } from '@aquata/rules';
import { buildApp, type App } from './app.ts';
import { loadConfig } from './config.ts';

describe('Station und Wirtschaft', () => {
  let a: App;
  let cookie = '';
  beforeAll(async () => {
    a = await buildApp({ ...loadConfig({}), dataDir: 'memory://', webDist: '/nonexistent', tickSeconds: 120 }, { ticker: false });
    const reg = await a.app.inject({ method: 'POST', url: '/api/auth/register', payload: { email: 'w@x.de', name: 'Wirt', password: 'geheim123' } });
    cookie = String(reg.headers['set-cookie']).split(';')[0]!;
    await a.app.inject({ method: 'POST', url: '/api/player', payload: { stationName: 'Tiefe', x: 500, y: 500 }, headers: { cookie } });
  });
  afterAll(() => a?.stop());
  const post = (url: string, payload: object) => a.app.inject({ method: 'POST', url, payload, headers: { cookie } });

  it('startet mit Startwerten', async () => {
    const st = (await a.app.inject({ url: '/api/station', headers: { cookie } })).json();
    expect(st.collectors).toBe(START.collectors);
    expect(st.resources.alu).toBeGreaterThanOrEqual(START.resources.alu);
    expect(st.buildings.find((b: { id: string }) => b.id === 'werft').level).toBe(1);
  });

  it('baut ein Gebäude aus, aber nur eins gleichzeitig', async () => {
    const res = await post('/api/station/build', { building: 'werft' });
    expect(res.statusCode).toBe(200);
    const st = res.json();
    expect(st.jobs).toEqual([expect.objectContaining({ kind: 'building', item: 'werft', level: 2 })]);
    expect(st.resources.alu).toBeLessThan(START.resources.alu - buildingCost('werft', 2).cost.alu + 50);
    const again = await post('/api/station/build', { building: 'sonar' });
    expect(again.statusCode).toBe(400);
    expect(again.json().error).toMatch(/läuft schon/);
  });

  it('gibt Sammler in Auftrag und ändert die Aufteilung', async () => {
    const res = await post('/api/station/collectors', { amount: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.json().jobs.some((j: { kind: string; amount: number }) => j.kind === 'collector' && j.amount === 2)).toBe(true);
    expect(COLLECTOR.base).toBeGreaterThan(0);
    const sp = (await post('/api/station/split', { alu: 1, stahl: 1, pu: 2 })).json();
    expect(sp.split.pu).toBeCloseTo(50);
    expect((await post('/api/station/split', { alu: -1, stahl: 0, pu: 0 })).statusCode).toBe(400);
  });

  it('gibt Schiffe in Auftrag, gesperrte Typen nicht', async () => {
    const ok = await post('/api/station/ships', { ship: 'piranha', amount: 1 });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().jobs.some((j: { kind: string; item: string }) => j.kind === 'ship' && j.item === 'piranha')).toBe(true);
    expect(ok.json().shipTypes.find((t: { id: string }) => t.id === 'mako').unlocked).toBe(false);
    expect((await post('/api/station/ships', { ship: 'mako', amount: 1 })).statusCode).toBe(400);
  });
});
