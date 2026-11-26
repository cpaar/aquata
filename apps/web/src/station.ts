import { useCallback, useEffect, useState } from 'react';
import { resourcesAt, type BuildingId, type Cost } from '@aquata/rules';
import { useNow } from './kit';

export interface StationJob { id: number; kind: 'building' | 'collector' | 'ship'; item?: BuildingId; level?: number; amount?: number; startedAt: number; finishesAt: number }
export interface StationData {
  resources: Cost; resAt: number; rate: Cost; collectors: number; split: Cost;
  buildings: { id: BuildingId; name: string; level: number; next: { cost: Cost; seconds: number } }[];
  collector: { cost: Cost; buildTicks: number };
  ships: Record<string, number>;
  shipTypes: { id: string; name: string; class: string; role: 'normal' | 'emp' | 'erstschlag'; cost: Cost; seconds: number; werft: number; unlocked: boolean }[];
  jobs: StationJob[];
}

async function req(method: 'GET' | 'POST', url: string, body?: unknown): Promise<StationData> {
  const r = await fetch(url, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error ?? `Fehler ${r.status}`);
  return d;
}

/** Stationsdaten vom Server; Rohstoffe laufen im Browser sekündlich weiter, fertige Aufträge lösen ein Neuladen aus */
export function useStation() {
  const [data, setData] = useState<StationData | null>(null);
  const [error, setError] = useState('');
  const now = useNow();
  const reload = useCallback(() => req('GET', '/api/station').then(setData).catch((e) => setError(e.message)), []);
  useEffect(() => { reload(); const t = setInterval(reload, 30_000); return () => clearInterval(t); }, [reload]);
  const nextDone = data?.jobs.reduce((m, j) => Math.min(m, j.finishesAt), Infinity) ?? Infinity;
  useEffect(() => { if (nextDone !== Infinity && now >= nextDone + 300) reload(); }, [now, nextDone, reload]);

  const act = async (url: string, body: unknown) => {
    setError('');
    try { setData(await req('POST', url, body)); return true; } catch (e) { setError((e as Error).message); return false; }
  };
  const live = data ? resourcesAt(data.resources, data.rate, data.resAt, now) : null;
  return { data, live, now, error, setError, reload, act };
}

export const RES_NAMES: Record<keyof Cost, string> = { alu: 'Alu', stahl: 'Stahl', pu: 'Plutonium' };
export const fmtCost = (c: Cost) => (Object.keys(c) as (keyof Cost)[]).filter((r) => c[r] > 0).map((r) => `${Math.round(c[r]).toLocaleString('de-DE')} ${RES_NAMES[r]}`).join(' · ') || 'kostenlos';
export const fmtDuration = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60), h = Math.floor(m / 60);
  return h ? `${h} h ${m % 60} min` : `${m} min ${s % 60 ? `${s % 60} s` : ''}`.trim();
};
