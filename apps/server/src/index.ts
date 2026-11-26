import { loadConfig } from './config.ts';
import { buildApp } from './app.ts';

const config = loadConfig();
const { app, db, round, stop } = await buildApp(config, { logger: true });
await app.listen({ port: config.port, host: config.host });
app.log.info(`Aquata-Server: ${db.kind}, Runde "${round.name}", Tick alle ${round.tickSeconds}s`);

for (const sig of ['SIGINT', 'SIGTERM'] as const) process.on(sig, () => void stop().then(() => process.exit(0)));
