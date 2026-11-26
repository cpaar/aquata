import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp, type App } from './app.ts';
import { loadConfig } from './config.ts';

describe('Konto und Platzwahl', () => {
  let a: App;
  let cookie = '';
  beforeAll(async () => {
    a = await buildApp({ ...loadConfig({}), dataDir: 'memory://', webDist: '/nonexistent', tickSeconds: 120 }, { ticker: false });
  });
  afterAll(() => a?.stop());

  const post = (url: string, payload: object, c = cookie) => a.app.inject({ method: 'POST', url, payload, headers: c ? { cookie: c } : {} });

  it('registriert ein Konto und setzt ein Sitzungs-Cookie', async () => {
    const res = await post('/api/auth/register', { email: 'Chris@Example.org', name: 'Chris', password: 'geheim123' }, '');
    expect(res.statusCode).toBe(200);
    cookie = String(res.headers['set-cookie']).split(';')[0]!;
    const me = (await a.app.inject({ url: '/api/me', headers: { cookie } })).json();
    expect(me.account.email).toBe('chris@example.org');
    expect(me.player).toBeNull();
  });

  it('lehnt doppelte Namen und falsche Passwörter ab', async () => {
    expect((await post('/api/auth/register', { email: 'x@y.de', name: 'chris', password: 'geheim123' }, '')).statusCode).toBe(409);
    expect((await post('/api/auth/login', { email: 'chris@example.org', password: 'falsch!!' }, '')).statusCode).toBe(401);
    expect((await post('/api/auth/login', { email: 'chris@example.org', password: 'geheim123' }, '')).statusCode).toBe(200);
  });

  it('platziert eine Station auf einem empfohlenen Platz, aber nur einmal', async () => {
    const map = (await a.app.inject({ url: '/api/map', headers: { cookie } })).json();
    expect(map.suggestions.length).toBe(3);
    const spot = map.suggestions[0];
    const res = await post('/api/player', { stationName: 'Nerea', ...spot });
    expect(res.statusCode).toBe(200);
    expect((await post('/api/player', { stationName: 'Nochmal', x: 100, y: 100 })).statusCode).toBe(409);
    const after = (await a.app.inject({ url: '/api/map', headers: { cookie } })).json();
    expect(after.stations).toEqual([expect.objectContaining({ name: 'Nerea', own: true, owner: 'Chris' })]);
  });

  it('ohne Anmeldung kein Platz', async () => {
    expect((await post('/api/player', { stationName: 'Gast', x: 300, y: 300 }, '')).statusCode).toBe(401);
  });
});
