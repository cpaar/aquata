import { useEffect, useMemo, useRef } from 'react';
import { buildContours } from './contours';

export interface MapStation { id: number; name: string; owner: string | null; x: number; y: number; own: boolean; bot: boolean }
export interface Pt { x: number; y: number }

interface Props {
  seed: number;
  size: { width: number; height: number };
  stations: MapStation[];
  suggestions?: Pt[];
  picked?: Pt | null;
  onPick?: (p: Pt) => void;
  height?: number;
}

const C = { line: '159,208,200', petrol: '#5fa8a0', amber: '#d9a04a', rust: '#c4653f', fg: '#d9e4e2', muted: '#7f9a9a', deep: '#0b1519' };

/** Tiefenlinien-Karte auf Canvas. Ganze Karte passt in die Breite; Tippen meldet Kartenkoordinaten. */
export function DepthMap({ seed, size, stations, suggestions = [], picked, onPick, height = 420 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const contours = useMemo(() => buildContours(seed, size.width, size.height), [seed, size.width, size.height]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let raf = 0;
    const draw = (t: number) => {
      const rect = cv.getBoundingClientRect();
      const d = devicePixelRatio || 1;
      if (cv.width !== Math.round(rect.width * d)) { cv.width = Math.round(rect.width * d); cv.height = Math.round(rect.height * d); }
      const c = cv.getContext('2d')!;
      c.setTransform(d, 0, 0, d, 0, 0);
      const w = rect.width, h = rect.height;
      const sc = Math.min(w / size.width, h / size.height);
      const ox = (w - size.width * sc) / 2, oy = (h - size.height * sc) / 2;
      const X = (x: number) => ox + x * sc, Y = (y: number) => oy + y * sc;
      c.clearRect(0, 0, w, h);
      const bg = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.2);
      bg.addColorStop(0, '#13252c'); bg.addColorStop(1, C.deep);
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      contours.forEach((seg, k) => {
        const major = k % 4 === 0;
        c.strokeStyle = `rgba(${C.line},${major ? 0.32 : 0.14})`;
        c.lineWidth = major ? 1 : 0.7;
        c.beginPath();
        for (let q = 0; q < seg.length; q += 4) { c.moveTo(X(seg[q]!), Y(seg[q + 1]!)); c.lineTo(X(seg[q + 2]!), Y(seg[q + 3]!)); }
        c.stroke();
      });
      // Vorschläge
      const pulse = (Math.sin(t / 500) + 1) / 2;
      for (const s of suggestions) {
        c.strokeStyle = `rgba(217,160,74,${0.45 + pulse * 0.4})`; c.setLineDash([3, 4]); c.lineWidth = 1.2;
        c.beginPath(); c.arc(X(s.x), Y(s.y), 12 + pulse * 3, 0, 7); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.amber; c.beginPath(); c.arc(X(s.x), Y(s.y), 2.5, 0, 7); c.fill();
      }
      // Stationen
      c.font = '500 10px "IBM Plex Sans", sans-serif'; c.textAlign = 'center';
      for (const s of stations) {
        const col = s.own ? C.petrol : s.bot ? C.muted : C.rust;
        c.strokeStyle = col; c.lineWidth = 1.5; c.fillStyle = 'rgba(11,21,25,.8)';
        c.beginPath(); c.arc(X(s.x), Y(s.y), s.own ? 8 : 6, 0, 7); c.fill(); c.stroke();
        c.fillStyle = col; c.beginPath(); c.arc(X(s.x), Y(s.y), 2.2, 0, 7); c.fill();
        c.fillStyle = s.own ? C.fg : C.muted; c.fillText(s.name, X(s.x), Y(s.y) + 20);
      }
      // gewählter Platz
      if (picked) {
        c.strokeStyle = C.petrol; c.lineWidth = 2;
        c.beginPath(); c.arc(X(picked.x), Y(picked.y), 10, 0, 7); c.stroke();
        c.beginPath(); c.moveTo(X(picked.x) - 16, Y(picked.y)); c.lineTo(X(picked.x) - 6, Y(picked.y)); c.moveTo(X(picked.x) + 6, Y(picked.y)); c.lineTo(X(picked.x) + 16, Y(picked.y));
        c.moveTo(X(picked.x), Y(picked.y) - 16); c.lineTo(X(picked.x), Y(picked.y) - 6); c.moveTo(X(picked.x), Y(picked.y) + 6); c.lineTo(X(picked.x), Y(picked.y) + 16); c.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [contours, stations, suggestions, picked, size]);

  const click = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const sc = Math.min(rect.width / size.width, rect.height / size.height);
    const ox = (rect.width - size.width * sc) / 2, oy = (rect.height - size.height * sc) / 2;
    const x = (e.clientX - rect.left - ox) / sc, y = (e.clientY - rect.top - oy) / sc;
    // Tipp nahe an einem Vorschlag rastet dort ein
    const snap = suggestions.find((s) => Math.hypot(s.x - x, s.y - y) * sc < 22);
    onPick(snap ?? { x: Math.round(x), y: Math.round(y) });
  };

  return <canvas ref={ref} onClick={click} style={{ width: '100%', height, display: 'block', cursor: onPick ? 'crosshair' : 'default', borderRadius: 'var(--pebble)', border: '1px solid var(--line)' }} aria-label="Tiefenlinien-Karte" />;
}
