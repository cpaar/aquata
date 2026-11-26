import { afterAll, describe, expect, it } from 'vitest';
import { buildApp, type App } from './app.ts';
import { loadConfig } from './config.ts';

describe('Server', () => {
  let a: App;
  afterAll(() => a?.stop());

  it('startet mit In-Memory-Datenbank und meldet Gesundheit + Tick', async () => {
    a = await buildApp({ ...loadConfig({}), dataDir: 'memory://', webDist: '/nonexistent', tickSeconds: 120 }, { ticker: false });
    const res = await a.app.inject({ method: 'GET', url: '/api/health' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.ok).toBe(true);
    expect(body.db).toBe('pglite');
    expect(body.tickSeconds).toBe(120);
    expect(body.nextTickAt).toBeGreaterThan(body.now);
  });

  it('liefert die Regeltabellen', async () => {
    const res = await a.app.inject({ method: 'GET', url: '/api/rules' });
    expect(Object.keys(res.json().ships)).toEqual(['piranha', 'squid', 'mako']);
  });
});
