import { describe, expect, it } from 'vitest';
import { START, buildingCost, productionPerHour, settle, startBuilding, startCollectors, type EconomyState, type Job } from './index.ts';

const fresh = (): EconomyState => ({ res: { ...START.resources }, resAt: 0, collectors: 10, split: { alu: 100, stahl: 0, pu: 0 }, buildings: { ...START.buildings } });
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

  it('stellt neue Sammler hinter laufende Sammler-Aufträge', () => {
    const r1 = startCollectors(fresh(), [], 2, 0);
    if ('error' in r1) throw new Error(r1.error);
    const r2 = startCollectors(r1.state, [{ id: 1, ...r1.job }], 1, 0);
    if ('error' in r2) throw new Error(r2.error);
    expect(r2.job.startedAt).toBe(r1.job.finishesAt);
  });

  it('lehnt zu teure Aufträge ab', () => {
    const poor = { ...fresh(), res: { alu: 10, stahl: 10, pu: 0 } };
    expect(startCollectors(poor, [], 5, 0)).toEqual({ error: 'Nicht genug Rohstoffe.' });
  });
});
