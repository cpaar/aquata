import { useEffect, useMemo, useRef, useState } from 'react';
import { buildContours } from './contours';

export interface MapStation { id: number; name: string; owner: string | null; x: number; y: number; own: boolean; bot: boolean }
export interface Pt { x: number; y: number }
/** Flotte auf der Karte: Abschnitt von → nach, progress 0..1 */
export interface MapFleet { id: string; from: Pt; to: Pt; progress: number; tone: 'petrol' | 'rust' | 'amber'; label?: string }

interface Props {
  seed: number;
  size: { width: number; height: number };
  stations: MapStation[];
  suggestions?: Pt[];
  picked?: Pt | null;
  onPick?: (p: Pt) => void;
  /** Sonar-Kreis um die eigene Station */
  sonar?: { x: number; y: number; r: number } | null;
  fleets?: MapFleet[];
  selected?: number | null;
  onStation?: (s: MapStation) => void;
  /** Startansicht: Mittelpunkt und Zoom (1 = ganze Karte) */
  focus?: Pt;
  zoom?: number;
  height?: number;
}

const C = { line: '159,208,200', petrol: '#5fa8a0', amber: '#d9a04a', rust: '#c4653f', fg: '#d9e4e2', muted: '#7f9a9a', deep: '#0b1519' };

/** Tiefenlinien-Karte auf Canvas. Ziehen verschiebt (wenn gezoomt), Tippen wählt Station oder Platz. */
export function DepthMap({ seed, size, stations, suggestions = [], picked, onPick, sonar, fleets = [], selected, onStation, focus, zoom = 1, height = 420 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const contours = useMemo(() => buildContours(seed, size.width, size.height), [seed, size.width, size.height]);
  const [center, setCenter] = useState<Pt>(focus ?? { x: size.width / 2, y: size.height / 2 });
  useEffect(() => { if (focus) setCenter(focus); }, [focus?.x, focus?.y, zoom]); // eslint-disable-line react-hooks/exhaustive-deps
  const drag = useRef<{ x: number; y: number; c: Pt; moved: boolean } | null>(null);

  /** Abbildung Karte → Bildschirm für die aktuelle Größe */
  const view = (w: number, h: number) => {
    const sc = Math.min(w / size.width, h / size.height) * zoom;
    const half = { x: w / 2 / sc, y: h / 2 / sc };
    // Mittelpunkt so begrenzen, dass die Karte den Rahmen füllt
    const cx = zoom <= 1 ? size.width / 2 : Math.min(size.width - half.x, Math.max(half.x, center.x));
    const cy = zoom <= 1 ? size.height / 2 : Math.min(size.height - half.y, Math.max(half.y, center.y));
    return { sc, ox: w / 2 - cx * sc, oy: h / 2 - cy * sc };
  };

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let raf = 0;
    const draw = (t: number) => {
      const rect = cv.getBoundingClientRect();
      const d = devicePixelRatio || 1;
      if (cv.width !== Math.round(rect.width * d) || cv.height !== Math.round(rect.height * d)) { cv.width = Math.round(rect.width * d); cv.height = Math.round(rect.height * d); }
      const c = cv.getContext('2d')!;
      c.setTransform(d, 0, 0, d, 0, 0);
      const w = rect.width, h = rect.height;
      const { sc, ox, oy } = view(w, h);
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
      const pulse = (Math.sin(t / 500) + 1) / 2;
      // Sonar: ruhiger Kreis plus langsam laufender Puls
      if (sonar && sonar.r > 0) {
        c.fillStyle = 'rgba(95,168,160,.06)'; c.strokeStyle = 'rgba(95,168,160,.45)'; c.lineWidth = 1; c.setLineDash([2, 5]);
        c.beginPath(); c.arc(X(sonar.x), Y(sonar.y), sonar.r * sc, 0, 7); c.fill(); c.stroke(); c.setLineDash([]);
        const k = (t / 3000) % 1;
        c.strokeStyle = `rgba(95,168,160,${0.35 * (1 - k)})`;
        c.beginPath(); c.arc(X(sonar.x), Y(sonar.y), sonar.r * sc * k, 0, 7); c.stroke();
      }
      // Vorschläge
      for (const s of suggestions) {
        c.strokeStyle = `rgba(217,160,74,${0.45 + pulse * 0.4})`; c.setLineDash([3, 4]); c.lineWidth = 1.2;
        c.beginPath(); c.arc(X(s.x), Y(s.y), 12 + pulse * 3, 0, 7); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.amber; c.beginPath(); c.arc(X(s.x), Y(s.y), 2.5, 0, 7); c.fill();
      }
      // Flotten: gestrichelte Bahn, Punkt an der aktuellen Position
      for (const f of fleets) {
        const col = C[f.tone];
        c.strokeStyle = col; c.globalAlpha = 0.55; c.lineWidth = 1.2; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(X(f.from.x), Y(f.from.y)); c.lineTo(X(f.to.x), Y(f.to.y)); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
        const p = Math.max(0, Math.min(1, f.progress));
        const px = X(f.from.x + (f.to.x - f.from.x) * p), py = Y(f.from.y + (f.to.y - f.from.y) * p);
        const ang = Math.atan2(f.to.y - f.from.y, f.to.x - f.from.x);
        c.save(); c.translate(px, py); c.rotate(ang);
        c.fillStyle = col; c.beginPath(); c.moveTo(7, 0); c.lineTo(-5, -4.5); c.lineTo(-2, 0); c.lineTo(-5, 4.5); c.closePath(); c.fill();
        c.restore();
        if (f.label) { c.font = '500 9px "IBM Plex Mono", monospace'; c.textAlign = 'left'; c.fillStyle = col; c.fillText(f.label, px + 8, py - 6); }
      }
      // Stationen
      c.font = '500 10px "IBM Plex Sans", sans-serif'; c.textAlign = 'center';
      for (const s of stations) {
        const col = s.own ? C.petrol : s.bot ? C.muted : C.rust;
        const sel = s.id === selected;
        if (sel) { c.strokeStyle = C.amber; c.lineWidth = 1.5; c.beginPath(); c.arc(X(s.x), Y(s.y), 13 + pulse * 2, 0, 7); c.stroke(); }
        c.strokeStyle = col; c.lineWidth = 1.5; c.fillStyle = 'rgba(11,21,25,.8)';
        c.beginPath(); c.arc(X(s.x), Y(s.y), s.own ? 8 : 6, 0, 7); c.fill(); c.stroke();
        c.fillStyle = col; c.beginPath(); c.arc(X(s.x), Y(s.y), 2.2, 0, 7); c.fill();
        if (zoom > 1 || s.own || sel || stations.length < 12) { c.fillStyle = s.own || sel ? C.fg : C.muted; c.fillText(s.name, X(s.x), Y(s.y) + 20); }
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
  }, [contours, stations, suggestions, picked, size, sonar, fleets, selected, zoom, center]); // eslint-disable-line react-hooks/exhaustive-deps

  const toMap = (el: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect();
    const { sc, ox, oy } = view(rect.width, rect.height);
    return { x: (clientX - rect.left - ox) / sc, y: (clientY - rect.top - oy) / sc, sc };
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, c: center, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const dr = drag.current;
    if (!dr || zoom <= 1) return;
    const dx = e.clientX - dr.x, dy = e.clientY - dr.y;
    if (!dr.moved && Math.hypot(dx, dy) < 6) return;
    dr.moved = true;
    const { sc } = toMap(e.currentTarget, e.clientX, e.clientY);
    setCenter({ x: dr.c.x - dx / sc, y: dr.c.y - dy / sc });
  };
  const up = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const dr = drag.current;
    drag.current = null;
    if (dr?.moved) return;
    const { x, y, sc } = toMap(e.currentTarget, e.clientX, e.clientY);
    if (onStation) {
      const hit = stations.map((s) => ({ s, d: Math.hypot(s.x - x, s.y - y) * sc })).filter((h) => h.d < 22).sort((a, b) => a.d - b.d)[0];
      if (hit) return onStation(hit.s);
    }
    if (!onPick) return;
    // Tipp nahe an einem Vorschlag rastet dort ein
    const snap = suggestions.find((s) => Math.hypot(s.x - x, s.y - y) * sc < 22);
    onPick(snap ?? { x: Math.round(x), y: Math.round(y) });
  };

  return (
    <canvas ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up}
      style={{ width: '100%', height, display: 'block', touchAction: zoom > 1 ? 'none' : 'auto', cursor: onPick ? 'crosshair' : zoom > 1 ? 'grab' : 'default', borderRadius: 'var(--pebble)', border: '1px solid var(--line)' }}
      aria-label="Tiefenlinien-Karte" />
  );
}
