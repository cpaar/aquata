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
