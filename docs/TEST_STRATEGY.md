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
