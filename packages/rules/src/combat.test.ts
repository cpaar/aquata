import { describe, expect, it } from 'vitest';
import { fight, countShips, fuelCost, planSend, warnTick, lootShares, MIN_WARNING_TICKS, sonarRange } from './index.ts';

describe('Kampf', () => {
  it('ist mit gleichem Seed reproduzierbar', () => {
    const a = [{ id: 1, ships: { piranha: 30, mako: 5 } }], d = [{ id: 2, ships: { piranha: 20, squid: 10 } }];
    expect(fight(a, d, 42)).toEqual(fight(a, d, 42));
  });

  it('ohne Verteidiger gewinnt der Angreifer kampflos', () => {
    const r = fight([{ id: 1, ships: { piranha: 3 } }], [{ id: 2, ships: {} }], 1);
    expect(r.winner).toBe('attacker');
    expect(r.phases).toEqual([]);
    expect(r.attackers[0]!.lost).toEqual({});
  });

  it('eine klar überlegene Flotte vernichtet die kleine', () => {
    const r = fight([{ id: 1, ships: { mako: 40, piranha: 40 } }], [{ id: 2, ships: { piranha: 5 } }], 7);
    expect(r.winner).toBe('attacker');
    expect(countShips(r.defenders[0]!.after)).toBe(0);
    expect(r.phases.map((p) => p.phase)).toEqual(['emp', 'erstschlag', 'normal']);
  });

  it('Erstschlag schießt vor der normalen Phase: tote Ziele schießen nicht mehr zurück', () => {
    // 50 Piranhas zerstören 3 Makos im Erstschlag, bevor diese feuern
    const r = fight([{ id: 1, ships: { piranha: 50 } }], [{ id: 2, ships: { mako: 3 } }], 3);
    expect(r.attackers[0]!.lost).toEqual({});
    expect(r.winner).toBe('attacker');
  });

  it('EMP lähmt: gelähmte Erstschläger schießen nicht', () => {
    const without = fight([{ id: 1, ships: { piranha: 10 } }], [{ id: 2, ships: { mako: 2 } }], 5);
    const withEmp = fight([{ id: 1, ships: { piranha: 10 } }], [{ id: 2, ships: { mako: 2, squid: 10 } }], 5);
    expect(withEmp.phases[0]!.attacker.paralyzed.piranha).toBeGreaterThan(0);
    const firedWithout = without.phases[1]!.attacker.active.piranha ?? 0;
    const firedWith = withEmp.phases[1]!.attacker.active.piranha ?? 0;
    expect(firedWith).toBeLessThan(firedWithout);
  });

  it('verteilt Verluste anteilig auf mehrere Angreifer und gibt beiden Seiten Müll', () => {
    const r = fight([{ id: 1, ships: { piranha: 20 } }, { id: 2, ships: { piranha: 20 } }], [{ id: 3, ships: { mako: 6 } }], 11);
    const [x, y] = r.attackers;
    expect(Math.abs((x!.lost.piranha ?? 0) - (y!.lost.piranha ?? 0))).toBeLessThanOrEqual(1);
    expect(r.defenders[0]!.debris.alu).toBeGreaterThan(0);
    expect(r.attackers[0]!.debris.pu).toBe(0);
  });

  it('erzeugt nie Rohstoffe: Müll bleibt unter dem zerstörten Wert', () => {
    const r = fight([{ id: 1, ships: { piranha: 60, mako: 10 } }], [{ id: 2, ships: { piranha: 40, squid: 20, mako: 8 } }], 99);
    const debris = [...r.attackers, ...r.defenders].reduce((s, p) => s + p.debris.alu + p.debris.stahl, 0);
    const lost = [...r.attackers, ...r.defenders].reduce((s, p) => s + Object.entries(p.lost).reduce((t, [id, n]) => t + n * ({ piranha: 1500, squid: 1500, mako: 4500 } as Record<string, number>)[id]!, 0), 0);
    expect(debris).toBeLessThan(lost);
  });
});

describe('Flotten', () => {
  const base = { from: { x: 100, y: 100 }, to: { x: 400, y: 300 }, driveLevel: 0, home: { piranha: 10 }, pu: 5000, nowTick: 10, fightTicks: 1, self: false };

  it('plant einen Angriff mit frühester Ankunft und Treibstoff', () => {
    const r = planSend({ ...base, ships: { piranha: 5 } });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.arriveTick).toBe(10 + r.ticks);
      expect(r.fuel).toBe(fuelCost({ piranha: 5 }, r.ticks, 0));
    }
  });

  it('lehnt zu viele Schiffe, zu frühe Ankunft und Selbstangriff ab', () => {
    expect(planSend({ ...base, ships: { piranha: 11 } }).ok).toBe(false);
    expect(planSend({ ...base, ships: { piranha: 1 }, arriveTick: 11 }).ok).toBe(false);
    expect(planSend({ ...base, ships: { piranha: 1 }, self: true }).ok).toBe(false);
    expect(planSend({ ...base, ships: { piranha: 1 }, fightTicks: 4 }).ok).toBe(false);
    expect(planSend({ ...base, ships: { piranha: 10 }, pu: 1 }).ok).toBe(false);
  });

  it('warnt spätestens 3 Ticks vor Ankunft, mit Sonar früher', () => {
    const far = { x: 900, y: 900 }, home = { x: 100, y: 100 };
    expect(warnTick(far, home, 0, 10, 0)).toBe(10 - MIN_WARNING_TICKS);
    expect(warnTick(far, home, 0, 10, 10)).toBeLessThan(10 - MIN_WARNING_TICKS);
    expect(sonarRange(0)).toBe(0);
  });

  it('teilt Beute nach Gewicht', () => {
    const [a, b] = lootShares({ alu: 10000, stahl: 5000, pu: 0 }, [3, 1]);
    expect(a!.alu).toBe(750);
    expect(b!.alu).toBe(250);
  });
});
