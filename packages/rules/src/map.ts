import type { Point } from './time.ts';

/** Kartenmaße der Testrunde. Die Karte wächst später mit der Spielerzahl. */
export const MAP = { width: 1000, height: 1000, minStationDistance: 45, edge: 30 };

export function placementError(p: Point, others: Point[]): string | null {
  if (p.x < MAP.edge || p.y < MAP.edge || p.x > MAP.width - MAP.edge || p.y > MAP.height - MAP.edge) return 'Zu nah am Kartenrand.';
  if (others.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < MAP.minStationDistance)) return 'Zu nah an einer anderen Station.';
  return null;
}

/** Kleiner, deterministischer Zufallsgenerator (gleicher Seed, gleiche Folge) */
export function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Empfohlene Startplätze: aus Zufallskandidaten die, die am weitesten von allen
 * bestehenden Stationen (und voneinander) entfernt sind, aber nahe der Mitte des Geschehens.
 */
export function suggestSpots(others: Point[], count = 3, seed = 1): Point[] {
  const r = rng(seed);
  const center = others.length
    ? { x: others.reduce((s, o) => s + o.x, 0) / others.length, y: others.reduce((s, o) => s + o.y, 0) / others.length }
    : { x: MAP.width / 2, y: MAP.height / 2 };
  const chosen: Point[] = [];
  for (let k = 0; k < count; k++) {
    let best: Point | null = null;
    let bestScore = -Infinity;
    for (let i = 0; i < 400; i++) {
      const p = { x: Math.round(MAP.edge + r() * (MAP.width - 2 * MAP.edge)), y: Math.round(MAP.edge + r() * (MAP.height - 2 * MAP.edge)) };
      const all = [...others, ...chosen];
      if (placementError(p, all)) continue;
      const near = all.length ? Math.min(...all.map((o) => Math.hypot(o.x - p.x, o.y - p.y))) : 200;
      // genug Abstand (bis ~140 zählt voll), nicht zu weit vom Geschehen
      const score = Math.min(near, 140) - 0.25 * Math.hypot(center.x - p.x, center.y - p.y);
      if (score > bestScore) { bestScore = score; best = p; }
    }
    if (best) chosen.push(best);
  }
  return chosen;
}
