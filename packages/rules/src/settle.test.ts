import { describe, expect, it } from 'vitest';
import { START, SHIPS, buildingCost, productionPerHour, settle, startBuilding, startCollectors, startShips, type EconomyState, type Job } from './index.ts';

const fresh = (): EconomyState => ({ res: { ...START.resources }, resAt: 0, collectors: 10, split: { alu: 100, stahl: 0, pu: 0 }, buildings: { ...START.buildings }, ships: {} });
const H = 3_600_000;

describe('Wirtschaft abrechnen', () => {
  it('lässt Rohstoffe mit der Zeit wachsen', () => {
    const { state } = settle(fresh(), [], H);
    expect(state.res.alu).toBeCloseTo(START.resources.alu + productionPerHour(10, { alu: 100, stahl: 0, pu: 0 }).alu);
  });

  it('zählt neue Sammler erst ab ihrer Fertigstellung', () => {
    const job: Job = { id: 1, kind: 'collector', amount: 10, startedAt: 0, finishesAt: H / 2 };
    const { state, done, open } = settle(fresh(), [job], H);
    const rate10 = productionPerHour(10, { alu: 100, stahl: 0, pu: 0 }).alu;
    expect(state.collectors).toBe(20);
    expect(state.res.alu).toBeCloseTo(START.resources.alu + rate10 * 0.5 + rate10 * 2 * 0.5);
    expect(done).toHaveLength(1);
    expect(open).toHaveLength(0);
  });

  it('erlaubt nur einen Ausbau gleichzeitig und bucht die Kosten', () => {
    const s = fresh();
    const r = startBuilding(s, [], 'werft', 0);
    if ('error' in r) throw new Error(r.error);
    expect(r.state.res.alu).toBe(s.res.alu - buildingCost('werft', 2).cost.alu);
    expect(r.job.level).toBe(2);
    const again = startBuilding(r.state, [{ id: 1, ...r.job }], 'sonar', 0);
    expect('error' in again && again.error).toMatch(/läuft schon/);
  });

  it('Sammler-Aufträge dauern 4 Ticks, egal wie viele, und laufen parallel', () => {
    const r1 = startCollectors(fresh(), [], 2, 0, 3600);
    if ('error' in r1) throw new Error(r1.error);
    const r2 = startCollectors(r1.state, [{ id: 1, ...r1.job }], 5, 0, 3600);
    if ('error' in r2) throw new Error(r2.error);
    expect(r1.job.finishesAt).toBe(4 * 3600 * 1000);
    expect(r2.job.startedAt).toBe(0);
    expect(r2.job.finishesAt).toBe(r1.job.finishesAt);
  });

  it('lehnt zu teure Aufträge ab', () => {
    const poor = { ...fresh(), res: { alu: 10, stahl: 10, pu: 0 } };
    expect(startCollectors(poor, [], 5, 0, 3600)).toEqual({ error: 'Nicht genug Rohstoffe.' });
  });
});

describe('Werft', () => {
  it('baut nur freigeschaltete Schiffe', () => {
    const s = fresh();
    expect(startShips(s, [], 'mako', 1, 0)).toEqual({ error: `Mako braucht Werft Stufe ${SHIPS.mako!.werft}.` });
    expect('job' in startShips(s, [], 'piranha', 2, 0)).toBe(true);
  });

  it('ein Auftrag dauert gleich lang, egal wie viele Schiffe; Aufträge laufen parallel', () => {
    const rich = { ...fresh(), res: { alu: 1e7, stahl: 1e7, pu: 1e5 } };
    const a = startShips(rich, [], 'piranha', 1, 0), b = startShips(rich, [], 'piranha', 2000, 0);
    if ('error' in a || 'error' in b) throw new Error('unerwartet');
    expect(b.job.finishesAt).toBe(a.job.finishesAt);
    const c = startShips(b.state, [{ id: 1, ...b.job }], 'piranha', 10, 0);
    if ('error' in c) throw new Error(c.error);
    expect(c.job.startedAt).toBe(0);
  });

  it('fertige Schiffe landen im Hangar', () => {
    const r = startShips(fresh(), [], 'piranha', 3, 0);
    if ('error' in r) throw new Error(r.error);
    const { state } = settle(r.state, [{ id: 9, ...r.job }], r.job.finishesAt);
    expect(state.ships.piranha).toBe(3);
  });
});
