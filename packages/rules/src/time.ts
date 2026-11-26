import { CLASS_EXTRA_TICKS, FLIGHT, SHIPS } from './data.ts';

export interface Point { x: number; y: number }

/** Index des Ticks, der zu einem Zeitpunkt zuletzt gelaufen ist (Tick 0 = Rundenstart) */
export function tickAt(roundStartMs: number, tickSeconds: number, nowMs: number): number {
  return Math.floor((nowMs - roundStartMs) / (tickSeconds * 1000));
}

export function tickTime(roundStartMs: number, tickSeconds: number, tick: number): number {
  return roundStartMs + tick * tickSeconds * 1000;
}

/**
 * Flugzeit in Ticks. Nie unter der Basis (Schlaf!), logarithmisch mit der Entfernung,
 * schlechterer Antrieb kostet Ticks, die langsamste Schiffsklasse bestimmt den Rest.
 */
export function flightTicks(from: Point, to: Point, driveLevel: number, shipIds: string[]): number {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  const distance = Math.min(FLIGHT.maxPenaltyTicks, Math.round(Math.log2(1 + d / FLIGHT.distanceScale)));
  const drive = Math.round(FLIGHT.drivePenaltyTicks * (1 - Math.min(driveLevel, FLIGHT.maxDriveLevel) / FLIGHT.maxDriveLevel));
  const extra = Math.max(0, ...shipIds.map((id) => CLASS_EXTRA_TICKS[SHIPS[id]?.class ?? 'klein']));
  return FLIGHT.baseTicks + distance + drive + extra;
}
