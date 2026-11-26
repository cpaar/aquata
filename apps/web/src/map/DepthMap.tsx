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
  /** Startansicht: Mittelpunkt und Zoom (1 = ganze Karte). Danach zoomt man stufenlos per Mausrad, zwei Fingern oder Knöpfen. */
  focus?: Pt;
  zoom?: number;
  height?: number;
}

const C = { line: '159,208,200', petrol: '#5fa8a0', amber: '#d9a04a', rust: '#c4653f', fg: '#d9e4e2', muted: '#7f9a9a', deep: '#0b1519' };

const MIN_ZOOM = 1, MAX_ZOOM = 8;

/** Tiefenlinien-Karte auf Canvas. Stufenlos zoombar (Mausrad, zwei Finger, Knöpfe), Ziehen verschiebt, Tippen wählt Station oder Platz. */
export function DepthMap({ seed, size, stations, suggestions = [], picked, onPick, sonar, fleets = [], selected, onStation, focus, zoom: startZoom = 1, height = 420 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const contours = useMemo(() => buildContours(seed, size.width, size.height), [seed, size.width, size.height]);
  const home = focus ?? { x: size.width / 2, y: size.height / 2 };
  const [cam, setCam] = useState({ c: home, z: startZoom });
  const camRef = useRef(cam);
  camRef.current = cam;
  const { c: center, z: zoom } = cam;
  const pointers = useRef(new Map<number, Pt>());
  const drag = useRef<{ moved: boolean; last: Pt; pinch?: number } | null>(null);

  /** Abbildung Karte → Bildschirm für eine Kamera und Rahmengröße; der Mittelpunkt wird so begrenzt, dass die Karte den Rahmen füllt */
  const viewOf = (c: Pt, z: number, w: number, h: number) => {
    const sc = Math.max(w / size.width, h / size.height) * z;
    const half = { x: w / 2 / sc, y: h / 2 / sc };
    const cx = half.x * 2 >= size.width ? size.width / 2 : Math.min(size.width - half.x, Math.max(half.x, c.x));
    const cy = half.y * 2 >= size.height ? size.height / 2 : Math.min(size.height - half.y, Math.max(half.y, c.y));
    return { sc, ox: w / 2 - cx * sc, oy: h / 2 - cy * sc, cx, cy };
  };
  const view = (w: number, h: number) => viewOf(center, zoom, w, h);

  /** Zoomt um einen Bildschirmpunkt (sx, sy relativ zum Canvas), der Kartenpunkt darunter bleibt stehen */
  const zoomAt = (factor: number, sx?: number, sy?: number) => {
    const cv = ref.current;
    if (!cv) return;
    const { width: w, height: h } = cv.getBoundingClientRect();
    const { c, z } = camRef.current;
    const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor));
    const px = sx ?? w / 2, py = sy ?? h / 2;
    const v = viewOf(c, z, w, h);
    const m = { x: (px - v.ox) / v.sc, y: (py - v.oy) / v.sc };
    const nsc = Math.max(w / size.width, h / size.height) * nz;
    const nc = { x: m.x - (px - w / 2) / nsc, y: m.y - (py - h / 2) / nsc };
    const cl = viewOf(nc, nz, w, h);
    setCam({ c: { x: cl.cx, y: cl.cy }, z: nz });
  };
  const panBy = (dx: number, dy: number) => {
    const cv = ref.current;
    if (!cv) return;
    const { width: w, height: h } = cv.getBoundingClientRect();
    const { c, z } = camRef.current;
    const v = viewOf(c, z, w, h);
    const cl = viewOf({ x: v.cx - dx / v.sc, y: v.cy - dy / v.sc }, z, w, h);
    setCam({ c: { x: cl.cx, y: cl.cy }, z });
  };

  // Mausrad und Trackpad-Pinch: nativer Listener, damit die Seite dabei nicht scrollt
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = cv.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    };
    cv.addEventListener('wheel', onWheel, { passive: false });
    return () => cv.removeEventListener('wheel', onWheel);
  }); // eslint-disable-line react-hooks/exhaustive-deps

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
        if (zoom > 1.6 || s.own || sel || stations.length < 12) { c.fillStyle = s.own || sel ? C.fg : C.muted; c.fillText(s.name, X(s.x), Y(s.y) + 20); }
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
  }, [contours, stations, suggestions, picked, size, sonar, fleets, selected, cam]); // eslint-disable-line react-hooks/exhaustive-deps

  const toMap = (el: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect();
    const { sc, ox, oy } = view(rect.width, rect.height);
    return { x: (clientX - rect.left - ox) / sc, y: (clientY - rect.top - oy) / sc, sc };
  };

  const rel = (e: React.PointerEvent<HTMLCanvasElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const pinchState = () => {
    const [p, q] = [...pointers.current.values()];
    return { d: Math.hypot(p!.x - q!.x, p!.y - q!.y), mid: { x: (p!.x + q!.x) / 2, y: (p!.y + q!.y) / 2 } };
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.set(e.pointerId, rel(e));
    e.currentTarget.setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) { const ps = pinchState(); drag.current = { moved: true, last: ps.mid, pinch: ps.d }; }
    else drag.current = { moved: false, last: rel(e) };
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, rel(e));
    const dr = drag.current;
    if (!dr) return;
    if (pointers.current.size >= 2 && dr.pinch) {
      const ps = pinchState();
      zoomAt(ps.d / dr.pinch, ps.mid.x, ps.mid.y);
      panBy(ps.mid.x - dr.last.x, ps.mid.y - dr.last.y);
      drag.current = { moved: true, last: ps.mid, pinch: ps.d };
      return;
    }
    const p = rel(e);
    if (!dr.moved && Math.hypot(p.x - dr.last.x, p.y - dr.last.y) < 6) return;
    panBy(p.x - dr.last.x, p.y - dr.last.y);
    drag.current = { moved: true, last: p };
  };
  const up = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    const dr = drag.current;
    if (pointers.current.size > 0) { const [p] = [...pointers.current.values()]; drag.current = { moved: true, last: p! }; return; }
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
    <div className="depthmap">
      <canvas ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{ width: '100%', height, display: 'block', touchAction: 'none', cursor: onPick ? 'crosshair' : 'grab', borderRadius: 'var(--pebble)', border: '1px solid var(--line)' }}
        aria-label="Tiefenlinien-Karte" />
      <div className="depthmap__ctl">
        <button type="button" aria-label="hineinzoomen" onClick={() => zoomAt(1.5)} disabled={zoom >= MAX_ZOOM}>+</button>
        <button type="button" aria-label="herauszoomen" onClick={() => zoomAt(1 / 1.5)} disabled={zoom <= MIN_ZOOM}>−</button>
        {focus && <button type="button" aria-label="zur eigenen Station" onClick={() => setCam({ c: home, z: Math.max(zoom, 2.6) })}>⌖</button>}
      </div>
    </div>
  );
}
