import { useCallback, useEffect, useState } from 'react';
import type { Cost, PhaseLog, Ships } from '@aquata/rules';

export interface Place { id: number; station: string; owner: string; x: number; y: number }
export interface OwnFleet {
  id: number; mission: 'attack' | 'defend'; status: 'outbound' | 'engaged' | 'returning'; ships: Ships;
  departTick: number; arriveTick: number; fightTicks: number; fought: number; cargo: Cost; target: Place;
}
export interface IncomingFleet { id: number; mission: 'attack' | 'defend'; status: 'outbound' | 'engaged'; arriveTick: number; size: number; from: Place }
export interface FleetsData { tick: number; own: OwnFleet[]; incoming: IncomingFleet[] }
export interface ReportItem { id: number; tick: number; side: 'attacker' | 'defender'; seen: boolean; winner: 'attacker' | 'defender' | 'draw'; target: string }
export interface ReportSide { playerId: number; station: string; owner: string; fleetId: number | null; fightNo: number | null; of: number | null; before: Ships; after: Ships; lost: Ships; debris: Cost; loot: Cost }
export interface Report { id: number; side: 'attacker' | 'defender'; tick: number; winner: ReportItem['winner']; target: { station: string; owner: string }; phases: PhaseLog[]; attackers: ReportSide[]; defenders: ReportSide[] }
export interface LogEntry { id: number; tick: number; kind: string; text: string; reportId: number | null }

async function call<T>(method: 'GET' | 'POST', url: string, body?: unknown): Promise<T> {
  const r = await fetch(url, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error ?? `Fehler ${r.status}`);
  return d as T;
}

export const getReport = (id: number) => call<Report>('GET', `/api/reports/${id}`);

/** Flotten, Berichte und Logbuch; lädt zu jedem Tick neu */
export function useFleets(tick: number) {
  const [fleets, setFleets] = useState<FleetsData | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [logbook, setLogbook] = useState<LogEntry[]>([]);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      const [f, r, l] = await Promise.all([call<FleetsData>('GET', '/api/fleets'), call<ReportItem[]>('GET', '/api/reports'), call<LogEntry[]>('GET', '/api/logbook')]);
      setFleets(f); setReports(r); setLogbook(l);
    } catch (e) { setError((e as Error).message); }
  }, []);
  // kurz nach dem Tick neu laden, damit der Server fertig gerechnet hat
  useEffect(() => { const t = setTimeout(reload, 600); return () => clearTimeout(t); }, [tick, reload]);

  const send = async (body: { target: number; ships: Ships; arriveTick: number; fightTicks: number; mission: 'attack' | 'defend' }) => {
    setError('');
    try { setFleets(await call<FleetsData>('POST', '/api/fleets', body)); return true; } catch (e) { setError((e as Error).message); return false; }
  };
  const recall = async (id: number) => {
    setError('');
    try { setFleets(await call<FleetsData>('POST', `/api/fleets/${id}/recall`, {})); } catch (e) { setError((e as Error).message); }
  };
  const markSeen = (id: number) => setReports((rs) => rs.map((r) => (r.id === id ? { ...r, seen: true } : r)));
  return { fleets, reports, logbook, error, reload, send, recall, markSeen };
}
