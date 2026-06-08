# Aquata Test Strategy

Stand: 2026-06-08

## Grundsatz

Playwright ist die fuehrende Akzeptanzschicht fuer spielbare Flows. Deterministische Spielregeln werden zusaetzlich in `packages/domain` mit Vitest getestet.

## Phase 0

- `pnpm lint` prueft den Workspace mit ESLint.
- `pnpm typecheck` prueft alle TypeScript-Projekte strict.
- `pnpm test` fuehrt Domain-Unit-Tests aus.
- `pnpm e2e` startet API und Web ueber Playwright-Webserver und prueft Web-Startseite plus API-Healthcheck.

## Naechste Ausbaustufe

- Domain-Tests fuer Ressourcenproduktion, Bauzeiten, Reisezeiten, Kampf und Tick-Idempotenz.
- API-Integrationstests gegen eine isolierte PostgreSQL-Testdatenbank.
- E2E-Flows fuer Registrierung, Login, Station, Tick, Bau, Forschung, Flottenbewegung und Kampfbericht.

## Phase 1

- `packages/domain` deckt Ressourcen/Produktion, Karte/Reisezeit, Schiffsdaten, Forschung, Bauqueue, Flottenbewegung, Kampf und Tick-Snapshot mit Vitest ab.
- Abschlussverifikation lief mit Formatcheck, Lint, Typecheck, Domain-Tests, Build und E2E-Smoke.

## Phase 2

- API-Integrationstests laufen gegen eine echte PostgreSQL-Testdatenbank.
- Tests pruefen Registrierung/Login/Logout, Session, Station-Bootstrap, Build/Research/Fleet-Commands und persistierten Tick.
- Tick-Tests muessen Idempotenz beweisen: derselbe `(roundId, tickNumber)` wird nicht doppelt angewendet.
- E2E bleibt zunaechst Smoke-Level; echte UI-Flows kommen in Phase 3.

## Phase 3

- Playwright prueft den ersten spielbaren Web-MVP: Registrierung mit direkter Session, Dashboard, Bauauftrag, Dev-Tick, Forschung, Flotte zum Dummy-Ziel, Kampfbericht und Logout.
- Der E2E-Test migriert und seedet seine PostgreSQL-Datenbank selbst. Fuer lokale Laeufe kann `TEST_DATABASE_URL` gesetzt werden; ohne Env wird die Default-URL `postgres://aquata:aquata@localhost:55432/aquata` genutzt.
- API-Integrationstests pruefen aktive Flotten, Catalog-Daten und letzte Kampfberichte im Game-Snapshot, laufen aber weiterhin nur, wenn `TEST_DATABASE_URL` gesetzt ist.

## Lokale Ports

- API: `3300`
- Web: `5174`
- PostgreSQL: `55432`

## Lokaler Dev-Start

Empfohlener Ablauf:

1. `docker compose up -d postgres`
2. `npm run dev`

`npm run dev` fuehrt vor dem Start von API und Web automatisch `db:migrate` und `db:seed` aus. Damit existieren die Tabellen, die aktive Runde und das Dummy-Ziel auch im manuellen Dev-Flow. Wenn Postgres wegen alter lokaler Volumes falsche Credentials nutzt, kann der lokale Projektzustand mit `docker compose down -v` zurueckgesetzt und danach neu gestartet werden.
