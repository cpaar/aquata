import { BUILDINGS, COLLECTOR_YIELD_PER_HOUR, LEVEL_GROWTH, RESOURCES, type BuildingId, type Cost, type Resource } from './data.ts';

/** Aufteilung der Sammler in Prozent, Summe 100 */
export type Split = Record<Resource, number>;

export function normalizeSplit(split: Split): Split {
  const total = RESOURCES.reduce((s, r) => s + Math.max(0, split[r]), 0);
  if (total === 0) return { alu: 100, stahl: 0, pu: 0 };
  return { alu: (Math.max(0, split.alu) / total) * 100, stahl: (Math.max(0, split.stahl) / total) * 100, pu: (Math.max(0, split.pu) / total) * 100 };
}

/** Produktion pro Stunde für eine Anzahl Sammler und eine Aufteilung */
export function productionPerHour(collectors: number, split: Split): Cost {
  const s = normalizeSplit(split);
  const out = {} as Cost;
  for (const r of RESOURCES) out[r] = collectors * (s[r] / 100) * COLLECTOR_YIELD_PER_HOUR[r];
  return out;
}

/** Ressourcen aus gespeichertem Stand + Rate × vergangene Zeit (Echtzeit-Wirtschaft ohne Hintergrund-Job) */
export function resourcesAt(stored: Cost, ratePerHour: Cost, sinceMs: number, nowMs: number): Cost {
  const hours = Math.max(0, nowMs - sinceMs) / 3_600_000;
  const out = {} as Cost;
  for (const r of RESOURCES) out[r] = stored[r] + ratePerHour[r] * hours;
  return out;
}

export function buildingCost(id: BuildingId, toLevel: number): { cost: Cost; seconds: number } {
  const b = BUILDINGS[id];
  const f = Math.pow(LEVEL_GROWTH.cost, toLevel - 1);
  const t = Math.pow(LEVEL_GROWTH.time, toLevel - 1);
  const cost = {} as Cost;
  for (const r of RESOURCES) cost[r] = Math.round(b.baseCost[r] * f);
  return { cost, seconds: Math.round(b.baseSeconds * t) };
}

export function canAfford(have: Cost, cost: Cost): boolean {
  return RESOURCES.every((r) => have[r] >= cost[r]);
}
