import { ATTACK, FUEL_PER_TICK, FUEL_SAVING_PER_DRIVE_LEVEL, LOOT_SHARE, MIN_WARNING_TICKS, SHIPS, SONAR, type Cost } from './data.ts';
import { flightTicks, type Point } from './time.ts';
import type { Ships } from './combat.ts';

/** Plutonium für Hin- und Rückflug, beim Losschicken fällig. Das Antriebslabor spart Treibstoff. */
export function fuelCost(ships: Ships, ticks: number, driveLevel: number): number {
  const perTick = Object.entries(ships).reduce((s, [id, n]) => s + n * FUEL_PER_TICK[SHIPS[id]?.class ?? 'klein'], 0);
  return Math.ceil(perTick * ticks * 2 * Math.max(0.2, 1 - FUEL_SAVING_PER_DRIVE_LEVEL * driveLevel));
}

export const sonarRange = (level: number) => (level > 0 ? SONAR.base + SONAR.perLevel * level : 0);

/**
 * Ab welchem Tick das Ziel die anfliegende Flotte sieht: sobald sie in Sonar-Reichweite ist
 * (die Flotte zieht gleichmäßig vom Start zum Ziel), spätestens aber MIN_WARNING_TICKS vor Ankunft.
 */
export function warnTick(from: Point, to: Point, departTick: number, arriveTick: number, targetSonarLevel: number): number {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  const range = sonarRange(targetSonarLevel);
  const latest = arriveTick - MIN_WARNING_TICKS;
  const span = Math.max(1, arriveTick - departTick);
  for (let k = departTick; k <= latest; k++) if ((d * (arriveTick - k)) / span <= range) return k;
  return latest;
}

export interface SendCheck { ticks: number; earliest: number; latest: number; fuel: number }

/** Prüft einen Angriff, bevor er losfliegt. Ankunft frühestens nach der Flugzeit, höchstens ATTACK.maxDelayTicks später. */
export function planSend(opts: { from: Point; to: Point; driveLevel: number; ships: Ships; home: Ships; pu: number; nowTick: number; arriveTick?: number; fightTicks: number; self: boolean }):
  ({ ok: true; arriveTick: number } & SendCheck) | { ok: false; error: string } {
  const ids = Object.keys(opts.ships).filter((id) => opts.ships[id]! > 0);
  if (opts.self) return { ok: false, error: 'Die eigene Station kann man nicht angreifen.' };
  if (!ids.length) return { ok: false, error: 'Bitte mindestens ein Schiff auswählen.' };
  for (const id of ids) {
    const n = opts.ships[id]!;
    if (!SHIPS[id]) return { ok: false, error: 'Unbekannter Schiffstyp.' };
    if (!Number.isInteger(n) || n < 0) return { ok: false, error: 'Ungültige Anzahl.' };
    if (n > (opts.home[id] ?? 0)) return { ok: false, error: `Nicht genug ${SHIPS[id]!.name} zuhause.` };
  }
  if (!Number.isInteger(opts.fightTicks) || opts.fightTicks < 1 || opts.fightTicks > ATTACK.maxFightTicks)
    return { ok: false, error: `Bitte 1 bis ${ATTACK.maxFightTicks} Kampfticks.` };
  const ticks = flightTicks(opts.from, opts.to, opts.driveLevel, ids);
  const earliest = opts.nowTick + ticks;
  const latest = earliest + ATTACK.maxDelayTicks;
  const arriveTick = opts.arriveTick ?? earliest;
  if (!Number.isInteger(arriveTick) || arriveTick < earliest || arriveTick > latest)
    return { ok: false, error: `Ankunft geht frühestens zu Tick ${earliest} und spätestens zu Tick ${latest}.` };
  const fuel = fuelCost(Object.fromEntries(ids.map((id) => [id, opts.ships[id]!])), ticks, opts.driveLevel);
  if (fuel > opts.pu) return { ok: false, error: `Zu wenig Plutonium: ${fuel} nötig.` };
  return { ok: true, arriveTick, ticks, earliest, latest, fuel };
}

/** Rückflugzeit: wie der Hinflug, nur ohne Verzögerung. */
export const returnTicks = (from: Point, to: Point, driveLevel: number, ships: Ships) =>
  flightTicks(from, to, driveLevel, Object.keys(ships).filter((id) => ships[id]! > 0));

/** Beute eines gewonnenen Kampfticks, nach Flottenwert auf die Angreifer verteilt. Rohstoffbeute ist nicht gedeckelt. */
export function lootShares(targetRes: Cost, weights: number[]): Cost[] {
  const pot: Cost = { alu: Math.floor(targetRes.alu * LOOT_SHARE), stahl: Math.floor(targetRes.stahl * LOOT_SHARE), pu: Math.floor(targetRes.pu * LOOT_SHARE) };
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => {
    const f = sum > 0 ? w / sum : 0;
    return { alu: Math.floor(pot.alu * f), stahl: Math.floor(pot.stahl * f), pu: Math.floor(pot.pu * f) };
  });
}
