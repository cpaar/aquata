import type { MapStation, Pt } from './map/DepthMap';

export interface Me {
  account: { id: number; email: string; name: string } | null;
  player: { id: number; stationName: string; x: number; y: number } | null;
  round: { id: number; name: string };
}
export interface MapData { size: { width: number; height: number }; seed: number; stations: MapStation[]; suggestions: Pt[] }

export class ApiError extends Error {}

async function call<T>(method: 'GET' | 'POST', url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as { error?: string }).error ?? `Fehler ${res.status}`);
  return data as T;
}

export const api = {
  me: () => call<Me>('GET', '/api/me'),
  register: (email: string, name: string, password: string) => call('POST', '/api/auth/register', { email, name, password }),
  login: (email: string, password: string) => call('POST', '/api/auth/login', { email, password }),
  logout: () => call('POST', '/api/auth/logout', {}),
  map: () => call<MapData>('GET', '/api/map'),
  place: (stationName: string, p: Pt) => call('POST', '/api/player', { stationName, ...p }),
};
