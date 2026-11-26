import { BUILDINGS, COLLECTOR, MAX_LEVEL, MAX_ORDER, RESOURCES, SHIPS, type BuildingId, type Cost } from './data.ts';
import { buildingCost, canAfford, productionPerHour, type Split } from './economy.ts';

export interface EconomyState {
  res: Cost;
  /** Zeitpunkt, zu dem res zuletzt festgeschrieben wurde (ms) */
  resAt: number;
  collectors: number;
  split: Split;
  buildings: Record<BuildingId, number>;
  /** Schiffe zuhause (nicht unterwegs) */
  ships: Record<string, number>;
}

export type Job =
  | { id: number; kind: 'building'; item: BuildingId; level: number; startedAt: number; finishesAt: number }
  | { id: number; kind: 'collector'; amount: number; startedAt: number; finishesAt: number }
  | { id: number; kind: 'ship'; item: string; amount: number; startedAt: number; finishesAt: number };

/** Auftrag ohne Datenbank-ID (vor dem Speichern) */
export type NewJob = { [K in Job['kind']]: Omit<Extract<Job, { kind: K }>, 'id'> }[Job['kind']];

function advance(state: EconomyState, to: number): EconomyState {
  if (to <= state.resAt) return state;
  const rate = productionPerHour(state.collectors, state.split);
  const hours = (to - state.resAt) / 3_600_000;
  const res = {} as Cost;
  for (const r of RESOURCES) res[r] = state.res[r] + rate[r] * hours;
  return { ...state, res, resAt: to };
}

/**
 * Bringt die Wirtschaft einer Station auf den Stand „now“: Rohstoffe wachsen mit der jeweils gültigen Rate,
 * fällige Aufträge werden in zeitlicher Reihenfolge abgeschlossen (ein fertiger Sammler zählt ab seiner Fertigstellung).
 */
export function settle(state: EconomyState, jobs: Job[], now: number): { state: EconomyState; done: Job[]; open: Job[] } {
  const due = jobs.filter((j) => j.finishesAt <= now).sort((a, b) => a.finishesAt - b.finishesAt);
  let s = state;
  for (const j of due) {
    s = advance(s, j.finishesAt);
    if (j.kind === 'building') s = { ...s, buildings: { ...s.buildings, [j.item]: j.level } };
    else if (j.kind === 'collector') s = { ...s, collectors: s.collectors + j.amount };
    else s = { ...s, ships: { ...s.ships, [j.item]: (s.ships[j.item] ?? 0) + j.amount } };
  }
  s = advance(s, now);
  return { state: s, done: due, open: jobs.filter((j) => j.finishesAt > now) };
}

const pay = (res: Cost, cost: Cost): Cost => ({ alu: res.alu - cost.alu, stahl: res.stahl - cost.stahl, pu: res.pu - cost.pu });

/** Prüft und bucht einen Gebäudeausbau. Erwartet einen bereits auf „now“ gebrachten Zustand. */
export function startBuilding(state: EconomyState, open: Job[], id: BuildingId, now: number): { state: EconomyState; job: Omit<Job & { kind: 'building' }, 'id'> } | { error: string } {
  if (!(id in BUILDINGS)) return { error: 'Unbekanntes Gebäude.' };
  if (open.some((j) => j.kind === 'building')) return { error: 'Es läuft schon ein Ausbau.' };
  const level = state.buildings[id] + 1;
  if (level > MAX_LEVEL) return { error: 'Höchste Stufe erreicht.' };
  const { cost, seconds } = buildingCost(id, level);
  if (!canAfford(state.res, cost)) return { error: 'Nicht genug Rohstoffe.' };
  return { state: { ...state, res: pay(state.res, cost) }, job: { kind: 'building', item: id, level, startedAt: now, finishesAt: now + seconds * 1000 } };
}

/** Prüft und bucht neue Sammler. Jeder Auftrag dauert COLLECTOR.buildTicks Ticks, Aufträge laufen parallel. */
export function startCollectors(state: EconomyState, open: Job[], amount: number, now: number, tickSeconds: number): { state: EconomyState; job: Omit<Job & { kind: 'collector' }, 'id'> } | { error: string } {
  void open;
  if (!Number.isInteger(amount) || amount < 1 || amount > MAX_ORDER) return { error: 'Bitte eine Anzahl ab 1 angeben.' };
  const cost = { alu: COLLECTOR.cost.alu * amount, stahl: COLLECTOR.cost.stahl * amount, pu: COLLECTOR.cost.pu * amount };
  if (!canAfford(state.res, cost)) return { error: 'Nicht genug Rohstoffe.' };
  return { state: { ...state, res: pay(state.res, cost) }, job: { kind: 'collector', amount, startedAt: now, finishesAt: now + COLLECTOR.buildTicks * tickSeconds * 1000 } };
}

/** Bauzeit pro Auftrag: jede Werftstufe über 1 macht 5 % schneller, höchstens 40 % */
export function shipSeconds(shipId: string, werftLevel: number): number {
  const base = SHIPS[shipId]?.buildSeconds ?? 0;
  return Math.round(base * (1 - Math.min(0.4, 0.05 * (werftLevel - 1))));
}

/** Prüft und bucht Schiffe. Ein Auftrag dauert die Bauzeit des Typs, egal wie viele Schiffe; Aufträge laufen parallel. */
export function startShips(state: EconomyState, open: Job[], shipId: string, amount: number, now: number): { state: EconomyState; job: NewJob & { kind: 'ship' } } | { error: string } {
  const ship = SHIPS[shipId];
  if (!ship) return { error: 'Unbekannter Schiffstyp.' };
  if (state.buildings.werft < ship.werft) return { error: `${ship.name} braucht Werft Stufe ${ship.werft}.` };
  if (!Number.isInteger(amount) || amount < 1 || amount > MAX_ORDER) return { error: 'Bitte eine Anzahl ab 1 angeben.' };
  const cost = { alu: ship.cost.alu * amount, stahl: ship.cost.stahl * amount, pu: ship.cost.pu * amount };
  if (!canAfford(state.res, cost)) return { error: 'Nicht genug Rohstoffe.' };
  void open;
  return { state: { ...state, res: pay(state.res, cost) }, job: { kind: 'ship', item: shipId, amount, startedAt: now, finishesAt: now + shipSeconds(shipId, state.buildings.werft) * 1000 } };
}
