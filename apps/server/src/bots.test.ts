import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { START, settle, type EconomyState } from '@aquata/rules';
import { buildApp, type App } from './app.ts';
import { loadConfig } from './config.ts';
import { botDecide, ensureBots, runBots } from './bots.ts';

const fresh = (): EconomyState => ({ res: { alu: 50000, stahl: 50000, pu: 5000 }, resAt: Date.now(), collectors: START.collectors, split: { ...START.split }, buildings: { ...START.buildings }, ships: {} });

describe('Bots', () => {
  it('bauen Gebäude, Sammler und Schiffe und behalten eine Reserve', () => {
    const { state, jobs } = botDecide(fresh(), [], 1);
    expect(jobs.map((j) => j.kind).sort()).toEqual(['building', 'collector', 'ship']);
    expect(jobs.find((j) => j.kind === 'building')).toMatchObject({ item: 'werft', level: 2 });
    expect(state.res.alu).toBeGreaterThan(0);
    expect(state.res.alu).toBeGreaterThanOrEqual(50000 * 0.3);
    // nichts doppelt, solange Aufträge laufen
    const again = botDecide(state, jobs.map((j, i) => ({ ...j, id: i })), 2);
    expect(again.jobs.filter((j) => j.kind === 'building')).toEqual([]);
    expect(settle(state, [], Date.now()).state.res.alu).toBeGreaterThanOrEqual(0);
  });

  describe('auf dem Server', () => {
    let a: App;
    beforeAll(async () => { a = await buildApp({ ...loadConfig({}), dataDir: 'memory://', webDist: '/nonexistent', tickSeconds: 120, bots: 4 }, { ticker: false }); });
    afterAll(() => a?.stop());

    it('legen Bot-Stationen an, die auf der Karte stehen und ziehen', async () => {
      const map = (await a.app.inject({ url: '/api/map' })).json();
      expect(map.stations.filter((s: { bot: boolean }) => s.bot).length).toBe(4);
      expect(await ensureBots(a.db, a.round, 4)).toBe(0);
      await runBots(a.db, a.round, 1, false);
      const jobs = await a.db.query<{ n: number }>('select count(*)::int as n from jobs');
      expect(jobs.rows[0]!.n).toBeGreaterThanOrEqual(8);
    });
  });
});
