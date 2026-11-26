import { rng } from '@aquata/rules';

/**
 * Tiefenlinien wie auf einer Seekarte: glattes Rauschfeld + Marching Squares.
 * Ergebnis: pro Höhenstufe eine flache Liste von Liniensegmenten [x1,y1,x2,y2,…] in Kartenkoordinaten.
 */
export function buildContours(seed: number, width: number, height: number, n = 90, levels = 20): number[][] {
  const r = rng(seed * 2654435761);
  const L = 9;
  const lat: number[][] = Array.from({ length: L + 1 }, () => Array.from({ length: L + 1 }, () => r()));
  const sm = (x: number) => x * x * (3 - 2 * x);
  const at = (i: number, j: number) => lat[i]![j]!;
  const noise = (x: number, y: number) => {
    let v = 0, amp = 1, f = 1, tot = 0;
    for (let o = 0; o < 3; o++) {
      const gx = (x * f * (L - 1)) % (L - 1), gy = (y * f * (L - 1)) % (L - 1);
      const i = Math.floor(gx), j = Math.floor(gy), fx = sm(gx - i), fy = sm(gy - j);
      v += amp * ((at(i, j) * (1 - fx) + at(i + 1, j) * fx) * (1 - fy) + (at(i, j + 1) * (1 - fx) + at(i + 1, j + 1) * fx) * fy);
      tot += amp; amp *= 0.5; f *= 2;
    }
    return v / tot;
  };
  const F: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => noise((i / n) * 0.999, (j / n) * 0.999)));
  const cw = width / n, ch = height / n;
  const out: number[][] = [];
  for (let k = 1; k < levels; k++) {
    const lv = 0.18 + k * (0.64 / levels);
    const seg: number[] = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = [F[i]![j]!, F[i + 1]![j]!, F[i + 1]![j + 1]!, F[i]![j + 1]!];
      const P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]] as const;
      const pts: number[] = [];
      for (let e = 0; e < 4; e++) {
        const a = v[e]!, b = v[(e + 1) % 4]!;
        if (a < lv !== b < lv) {
          const q = (lv - a) / (b - a), A = P[e]!, B = P[(e + 1) % 4]!;
          pts.push((A[0] + (B[0] - A[0]) * q) * cw, (A[1] + (B[1] - A[1]) * q) * ch);
        }
      }
      if (pts.length >= 4) seg.push(...pts.slice(0, 4));
      if (pts.length === 8) seg.push(...pts.slice(4, 8));
    }
    out.push(seg);
  }
  return out;
}
