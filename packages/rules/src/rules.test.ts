import { describe, expect, it } from 'vitest';
import { buildingCost, flightTicks, normalizeSplit, productionPerHour, resourcesAt, tickAt } from './index.ts';

describe('Wirtschaft', () => {
  it('normalisiert die Aufteilung auf 100 %', () => {
    const s = normalizeSplit({ alu: 2, stahl: 1, pu: 1 });
    expect(s.alu).toBeCloseTo(50);
    expect(s.alu + s.stahl + s.pu).toBeCloseTo(100);
  });

  it('rechnet Ressourcen aus Stand und Rate', () => {
    const rate = productionPerHour(10, { alu: 100, stahl: 0, pu: 0 });
    const now = resourcesAt({ alu: 100, stahl: 0, pu: 0 }, rate, 0, 30 * 60_000);
    expect(now.alu).toBeCloseTo(100 + 10 * 60 * 0.5);
    expect(now.stahl).toBe(0);
  });

  it('Gebäude werden mit jeder Stufe teurer und langsamer', () => {
    const a = buildingCost('werft', 1);
    const b = buildingCost('werft', 2);
    expect(b.cost.alu).toBeGreaterThan(a.cost.alu);
    expect(b.seconds).toBeGreaterThan(a.seconds);
  });
});

describe('Zeit', () => {
  it('zählt Ticks ab Rundenstart', () => {
    expect(tickAt(0, 3600, 3599_000)).toBe(0);
    expect(tickAt(0, 3600, 3600_000)).toBe(1);
  });

  it('Flugzeit ist nie kürzer als die Basis', () => {
    expect(flightTicks({ x: 0, y: 0 }, { x: 1, y: 0 }, 10, ['piranha'])).toBe(4);
  });

  it('weiter weg und schwächerer Antrieb dauern länger', () => {
    const near = flightTicks({ x: 0, y: 0 }, { x: 50, y: 0 }, 10, ['piranha']);
    const far = flightTicks({ x: 0, y: 0 }, { x: 400, y: 0 }, 10, ['piranha']);
    const slow = flightTicks({ x: 0, y: 0 }, { x: 400, y: 0 }, 0, ['piranha']);
    expect(far).toBeGreaterThan(near);
    expect(slow).toBeGreaterThan(far);
  });
});

import { MAP, placementError, suggestSpots } from './index.ts';

describe('Karte', () => {
  it('lehnt Plätze am Rand und zu nah an Stationen ab', () => {
    expect(placementError({ x: 5, y: 500 }, [])).toMatch(/rand/i);
    expect(placementError({ x: 500, y: 500 }, [{ x: 510, y: 500 }])).toMatch(/Station/);
    expect(placementError({ x: 500, y: 500 }, [{ x: 600, y: 500 }])).toBeNull();
  });

  it('schlägt gültige, unterschiedliche Plätze vor', () => {
    const others = [{ x: 500, y: 500 }, { x: 560, y: 520 }];
    const spots = suggestSpots(others, 3, 7);
    expect(spots).toHaveLength(3);
    for (const s of spots) expect(placementError(s, others)).toBeNull();
    expect(Math.hypot(spots[0]!.x - spots[1]!.x, spots[0]!.y - spots[1]!.y)).toBeGreaterThanOrEqual(MAP.minStationDistance);
  });
});
