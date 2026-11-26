import { useEffect, useState } from 'react';

export interface TickState { tick: number; nextTickAt: number; tickSeconds: number; now: number }
export interface Health extends TickState { ok: boolean; db: string; round: { id: number; name: string } }

/** Verbindung zum Server: Gesundheit per REST, Ticks live per WebSocket. Ohne Server: null. */
export function useServer() {
  const [health, setHealth] = useState<Health | null>(null);
  const [tick, setTick] = useState<TickState | null>(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let ws: WebSocket | undefined;
    let retry: ReturnType<typeof setTimeout>;
    let alive = true;
    fetch('/api/health').then((r) => r.json()).then((h: Health) => { if (alive) { setHealth(h); setTick(h); } }).catch(() => {});
    const connect = () => {
      ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`);
      ws.onopen = () => setOnline(true);
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data) as TickState & { type: string };
        if (msg.type === 'hello' || msg.type === 'tick') setTick(msg);
      };
      ws.onclose = () => { setOnline(false); if (alive) retry = setTimeout(connect, 3000); };
    };
    connect();
    return () => { alive = false; clearTimeout(retry); ws?.close(); };
  }, []);

  return { health, tick, online };
}

/** Ersatzwerte, damit die Oberfläche auch ohne Server sinnvoll aussieht */
export function fallbackTick(now = Date.now()): TickState {
  const len = 3600;
  const tick = Math.floor(now / (len * 1000));
  return { tick: tick % 1000, nextTickAt: (tick + 1) * len * 1000, tickSeconds: len, now };
}
