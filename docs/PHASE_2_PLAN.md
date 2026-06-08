# Phase 2 Plan: Datenbank und API-MVP

Stand: 2026-06-08

Ziel von Phase 2 ist, den in Phase 1 implementierten Domain-Core persistent und ueber eine API nutzbar zu machen. Phase 2 baut noch keine vollstaendige Spiel-UI. Sie liefert Datenmodell, Migrationen, Seeds, Auth, transaktionale Commands und einen deterministischen Tick-Endpunkt, auf dem Phase 3 die Web-Flows aufbauen kann.

## Leitlinien

- Domain-Regeln bleiben in `packages/domain`; API und DB duerfen sie nur orchestrieren.
- Alle spielveraendernden API-Commands laufen transaktional.
- Persistenzmodelle speichern Snapshots so, dass `runGameTick` und CombatReports ohne UI reproduzierbar bleiben.
- E2E bleibt Smoke-Level; API-/DB-Verhalten wird in Phase 2 vor allem ueber Integrationstests abgesichert.
- Keine Mail-Verifikation, keine Kommandoschiffe, keine Scans, keine Allianzen, kein Handel.

## Phase-2-Ergebnis

Am Ende von Phase 2 soll es moeglich sein:

- PostgreSQL per Migration auf MVP-Schema zu bringen.
- Eine neue Runde mit 30-Minuten-Tick zu seed/initieren.
- Einen User zu registrieren, einzuloggen, auszuloggen und eine Session zu halten.
- Fuer einen User automatisch einen Player und eine Station in der aktiven Runde zu erzeugen.
- Stationsstatus per API abzurufen.
- Build-, Research- und Fleet-Commands per API auszufuehren.
- Einen manuellen Dev/Test-Tick auszufuehren, der den Domain-Tick persistent anwendet.
- Tick-Laeufe idempotent in `tick_runs` zu speichern.
- Kampfberichte aus angekommenen Angriffen persistent abrufbar zu machen.

## Vorgeschlagene Reihenfolge

### 1. DB-Grundlage und Migrationen

Deliverables:

- Drizzle-Kit in `packages/db` einrichten.
- `drizzle.config.ts`.
- Scripts fuer `db:generate`, `db:migrate`, `db:studio` oder equivalent.
- Migrationsordner, der in Git getrackt wird.
- DB-Client/Pool Factory in `packages/db`.

Abnahme:

- Frische PostgreSQL-Datenbank kann per Script migriert werden.
- `corepack pnpm --filter @aquata/db typecheck` bleibt gruen.

### 2. MVP-Schema

Tabellen fuer Phase 2:

- `users`: Login-Identitaet.
- `sessions`: opaque Session-ID, User, Ablaufzeit.
- `rounds`: Runde, Status, Ticklaenge, aktueller Tick.
- `players`: User in Runde.
- `stations`: Player, Position, Ressourcen, Produktion.
- `station_ships`: Station und Schiffsbestaende.
- `research_states`: Completed/active Research pro Station oder Player.
- `build_orders`: FIFO-Bauqueue.
- `fleets`: persistierte Flottenbewegungen.
- `combat_reports`: Kampfbericht-Snapshots.
- `tick_runs`: Idempotenz und Audit fuer Tickausfuehrung.

MVP-Annahme:

- IDs sind UUIDs.
- Kleine Snapshots wie `ships`, `resources`, `research.completed` und CombatReport koennen als `jsonb` gespeichert werden, solange Constraints fuer Kernbeziehungen sauber bleiben.
- `tick_runs` bekommt einen Unique-Key auf `(round_id, tick_number)`.

Abnahme:

- Schema bildet die Phase-1-Domain-Snapshots ohne Informationsverlust ab.
- Es gibt keine Abhaengigkeit auf alte PHP-Tabellen.

### 3. Seeds und Testdaten

Deliverables:

- Seed fuer eine aktive MVP-Runde.
- Dummy-Gegner/Station fuer Onboarding und Tests.
- Optional: Dev-User fuer lokale Entwicklung.
- Test-Factory-Helper fuer API-Integrationstests.

MVP-Annahme:

- Stationspositionen koennen vorerst deterministisch vergeben werden.
- Dummy-Gegner ist kein normaler User-Flow, sondern Seed/Testfixture.

Abnahme:

- Nach Seed existiert eine aktive Runde und ein Dummy-Ziel.
- Tests koennen isolierte User/Stationsdaten erstellen.

### 4. API-Infrastruktur

Deliverables:

- DB Provider in `apps/api`.
- Config-Modul fuer `DATABASE_URL`, Session-Secret/Tick-Token und Runtime-Modus.
- Global Validation Pipe fuer DTOs.
- Einheitliche Fehlerantworten fuer Commands.
- Integrationstest-Setup fuer API + Testdatenbank.

Abnahme:

- API kann DB-Health pruefen.
- Tests koennen AppModule mit Test-DB starten.

### 5. Auth und Sessions

Deliverables:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- Password Hashing.
- HTTP-only Session-Cookie mit opaque Session-ID.
- Session Cleanup oder Ablaufzeit.

MVP-Annahme:

- Registrierung braucht Username, E-Mail und Passwort.
- E-Mail-Verifikation bleibt ausserhalb des MVP.
- Login per Username oder E-Mail ist erlaubt, wenn einfach umsetzbar.

Abnahme:

- Registrierter User kann sich einloggen und `me` abrufen.
- Logout invalidiert die Session.
- Passwort wird nie im Klartext gespeichert.

### 6. Round, Player und Station Bootstrap

Deliverables:

- Aktive Runde abrufen.
- Beim ersten Login/erstem Station-Request Player + Station in aktiver Runde erzeugen.
- Deterministische Startressourcen, Startproduktion und Startschiffe.
- `GET /game/me` oder `GET /stations/me` fuer aktuellen Stationssnapshot.

MVP-Annahme:

- Ein User hat im MVP genau eine Station pro aktiver Runde.
- Startposition kann vorerst automatisch vergeben werden.

Abnahme:

- Neuer User bekommt ohne manuelle DB-Eingriffe eine spielbare Station.
- Snapshot ist kompatibel mit Phase-1-Domain-Typen.

### 7. Commands: Build, Research, Fleet

Deliverables:

- `POST /build-orders`
- `POST /research`
- `POST /fleets`
- DTO-Validierung fuer Mengen, IDs, Koordinaten.
- Domain-Command-Aufruf plus persistierte Updates in einer Transaktion.

Abnahme:

- Build Command zieht Ressourcen ab und schreibt FIFO-Order.
- Research Command zieht Ressourcen ab und setzt aktive Forschung.
- Fleet Command zieht Schiffe von Station ab und schreibt Bewegung mit berechneter ETA.
- Ungueltige Commands liefern klare 4xx-Antworten.

### 8. Persistierter Tick

Deliverables:

- Service `runPersistedTick(roundId, tickNumber)`.
- Dev/Test-Endpunkt, z.B. `POST /dev/tick`.
- DB-Load: Stations, Buildqueues, Research, Fleets.
- Domain-Aufruf `runGameTick`.
- DB-Write: Ressourcen, Schiffe, Build/Research, Fleets, CombatReports.
- Idempotenz ueber `tick_runs`.

Abnahme:

- Derselbe Tick kann nicht doppelt angewendet werden.
- Tick schreibt Auditdaten in `tick_runs`.
- Angekommene Angriffe erzeugen persistierte CombatReports.

### 9. API-Integrationstests

Pflichtszenarien:

- Register -> Login -> `me`.
- Login -> Station wird in aktiver Runde erzeugt.
- Build starten -> Dev-Tick -> Schiffbestand steigt.
- Research starten -> Dev-Tick(s) -> Completed Research sichtbar.
- Fleet senden -> Dev-Tick(s) -> Fleet kommt an oder CombatReport entsteht.
- Idempotenz: gleicher Tick wird nicht doppelt angewendet.

Abnahme:

- Tests laufen lokal mit isolierter Testdatenbank.
- CI kann die Testdatenbank bereitstellen.

## Nicht in Phase 2

- Vollstaendige Web-UI fuer Build/Forschung/Flotten.
- Playwright-MVP-Flow ueber echte Bedienung.
- Mail-Verifikation.
- Reset-/Rundenende-Management.
- Admin-UI.
- Balancing-Dashboards.
- Kommandoschiff, Scans, Allianzen, Handel.

## Bestaetigte Entscheidungen

Diese Entscheidungen sind fuer Phase 2 gesetzt:

1. Registrierung: Username + E-Mail + Passwort, aber ohne E-Mail-Verifikation im MVP.
2. Passwort-Hashing: Argon2id.
3. Migrations-Tooling: Drizzle-Kit fuer Migrationen.
4. Persistenzform: Ressourcen/Ships/Research/CombatReports teilweise als `jsonb`, relationale Tabellen fuer Kernbeziehungen.
5. Dev-Tick-Endpunkt: nur in Non-Production oder mit `TICK_ADMIN_TOKEN`.
6. Station-Startposition: fuer MVP automatisch deterministisch vergeben.
7. Testdatenbank: Integrationstests gegen echte PostgreSQL-Testdatenbank statt SQLite/Mocks.

## Auth-Entscheidung

Die Auth-Strategie ist fuer Phase 2 festgelegt:

- Eigene HTTP-only Session-Cookie mit opaque DB-Session.
- Kein JWT und kein externer Auth-Provider im MVP.
- Auth bleibt in `apps/api/src/auth` gekapselt, damit spaeter ein Provider angeschlossen werden kann.

## Implementierungsstand

- [x] Drizzle-Kit, DB-Client, MVP-Schema und Migration.
- [x] Seed/Testdaten fuer aktive Runde und Dummy-Gegner.
- [x] API Config, DB Provider, Validation Pipe und DB-Healthcheck.
- [x] Register/Login/Logout/me mit Argon2id und HTTP-only Session-Cookie.
- [x] Player-/Station-Bootstrap fuer aktive Runde.
- [x] Transaktionale Commands fuer Build, Research und Fleet.
- [x] Persistierter Dev-Tick mit `tick_runs`-Idempotenz.
- [x] API-Integrationstests gegen PostgreSQL via `TEST_DATABASE_URL`.

## Verifikation fuer Phase 2

Nach groesseren Schritten:

- `corepack pnpm --filter @aquata/db typecheck`
- `corepack pnpm --filter @aquata/api test`
- `corepack pnpm typecheck`
- `corepack pnpm lint`

Vor Abschluss von Phase 2:

- `corepack pnpm format:check`
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm test`
- API-Integrationstests mit PostgreSQL.
- `corepack pnpm build`
- `corepack pnpm e2e`, damit Phase-0-Smoke weiterhin gruen bleibt.
