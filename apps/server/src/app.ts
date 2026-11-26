import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';
import { existsSync } from 'node:fs';
import { BUILDINGS, SHIPS } from '@aquata/rules';
import type { Config } from './config.ts';
import { openDb, migrate, type Db } from './db/index.ts';
import { currentRound, tickInfo, type Round } from './round.ts';
import { startTicker } from './tick.ts';
import { registerRoutes } from './routes.ts';
import { catchUp } from './fleets.ts';

export interface App { app: ReturnType<typeof Fastify>; db: Db; round: Round; stop: () => Promise<void> }

export async function buildApp(config: Config, opts: { ticker?: boolean; logger?: boolean } = {}): Promise<App> {
  const db = await openDb(config);
  await migrate(db);
  const round = await currentRound(db, config.tickSeconds);

  const app = Fastify({ logger: opts.logger ?? false });
  await app.register(fastifyWebsocket);
  await app.register(fastifyCookie);

  const sockets = new Set<{ send: (s: string) => void }>();
  const broadcast = (msg: unknown) => { const s = JSON.stringify(msg); for (const ws of sockets) ws.send(s); };

  app.get('/api/health', async () => {
    const { rows } = await db.query<{ ok: number }>('select 1 as ok');
    return { ok: rows[0]?.ok === 1, db: db.kind, round: { id: round.id, name: round.name }, ...tickInfo(round) };
  });

  registerRoutes(app, db, round, config.secureCookies);

  app.get('/api/rules', async () => ({ ships: SHIPS, buildings: BUILDINGS }));

  app.get('/ws', { websocket: true }, (socket) => {
    sockets.add(socket);
    socket.send(JSON.stringify({ type: 'hello', ...tickInfo(round) }));
    socket.on('close', () => sockets.delete(socket));
  });

  if (existsSync(config.webDist)) {
    await app.register(fastifyStatic, { root: config.webDist });
    app.setNotFoundHandler((req, reply) => (req.url.startsWith('/api') ? reply.code(404).send({ error: 'not found' }) : reply.sendFile('index.html')));
  }

  // Ticks abarbeiten (auch verpasste nach einem Neustart), danach alle Clients benachrichtigen
  const runTicks = async () => {
    try { await catchUp(db, round); } catch (e) { app.log.error(e, 'Tick fehlgeschlagen'); }
  };
  if (opts.ticker !== false) await runTicks();
  const stopTicker = opts.ticker === false ? () => {} : startTicker(round, async (tick) => { await runTicks(); broadcast({ type: 'tick', ...tickInfo(round), tick }); });

  return { app, db, round, stop: async () => { stopTicker(); await app.close(); await db.close(); } };
}
