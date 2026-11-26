# Aquata

Neuaufbau des Tick-basierten Unterwasser-Strategiespiels. Konzept: `docs/konzept/spielkonzept.md`.

## Aufbau

| Teil | Inhalt |
| --- | --- |
| `packages/rules` | Spielregeln und alle Zahlen (`src/data.ts`), reine Funktionen mit Tests. Server und Browser nutzen denselben Code. |
| `apps/server` | Node.js + Fastify. REST unter `/api`, WebSocket unter `/ws`, Tick-Job, Datenbank (PGlite lokal, Postgres über `DATABASE_URL`). |
| `apps/web` | React + Vite, Handy zuerst, Stil E „Petrol“. Baukasten in `src/kit`, Vorschau unter `#baukasten`. |

## Entwickeln

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev          # Server auf 3101, Web mit Hot Reload auf 3102
npm test             # Regeln und Server
npm run typecheck
```

Anschauen vom eigenen Rechner aus (nodedev, Ports nur auf localhost):

```bash
ssh -L 3102:localhost:3102 -L 3101:localhost:3101 nodedev
# dann http://localhost:3102 (Brücke) und http://localhost:3102/#baukasten
```

Nur Server mit fertig gebautem Web (wie später auf Dokku):

```bash
npm run build && npm start   # http://localhost:3101
```

## Einstellungen (Umgebungsvariablen)

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `PORT` | 3101 | Port des Servers |
| `HOST` | 127.0.0.1 | auf Dokku `0.0.0.0` |
| `TICK_SECONDS` | 3600 | Tick-Länge; zum Testen z. B. `120` |
| `DATABASE_URL` | leer | Postgres-Verbindung; leer = PGlite in `data/pglite` |
| `DATA_DIR` | `data/pglite` | Ordner für PGlite |
| `WEB_PORT` / `API_PORT` | 3102 / 3101 | Ports für den Vite-Entwicklungsserver |
