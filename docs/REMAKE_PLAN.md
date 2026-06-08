# Aquata Remake Plan

Stand: 2026-06-08

Dieses Dokument ist der persistierte Arbeitsplan fuer das Aquata-Remake. Es soll von Coding Agents fortgeschrieben werden: erledigte Punkte abhaken, Entscheidungen ergaenzen, Risiken konkretisieren und neue Erkenntnisse in den passenden Abschnitt eintragen.

Primaere Quellen:

- `Aquata - Game Design Document.md`: Produktvision, Spielgefuehl, Feature-Ideen und offene Designfragen.
- `old/`: historische PHP-Codebasis und SQL-Dump als technische und balanceseitige Referenz.

## 1. Kurzfazit

Aquata sollte nicht als direkte PHP-Portierung neu gebaut werden. Der bestehende Code ist historisch gewachsen, prozedural, stark datenbankgetrieben und mischt UI, Rechte, Spielregeln, Tick-Verarbeitung und Community-Funktionen in denselben Dateien. Das Remake sollte den Spielkern neu modellieren und nur die sinnvollen Konzepte uebernehmen.

Empfohlene Basis:

- Monorepo mit TypeScript.
- Backend: NestJS oder ein bewusst schlanker Fastify-Service. Empfehlung fuer dieses Projekt: NestJS, weil Module, Dependency Injection, Jobs, Guards und Testing-Konventionen Agenten klare Leitplanken geben.
- Frontend: React + Vite + TanStack Router + TanStack Query.
- Datenbank: PostgreSQL.
- DB-Zugriff: Drizzle ORM plus bewusstes Raw SQL fuer komplexe Tick-/Ranking-Queries.
- Tests: Playwright als fuehrende E2E-Schicht, zusaetzlich Vitest fuer deterministische Domain- und Tick-Logik.
- Infrastruktur: Docker Compose fuer lokale Entwicklung, CI mit Lint, Typecheck, Unit/Integration und E2E.

Das Ziel ist ein frueh spielbares, kleines Aquata: registrieren/einloggen, Station besitzen, Ressourcen produzieren, Schiffe/Sammler bauen, Forschung starten, Flotte bewegen und einfachen Kampf ausloesen. Danach werden Komfort, Tiefe, Allianzen und Community-Funktionen iterativ ergaenzt.

## 2. Bestandsaufnahme

### Aktuelle Struktur

- Die historische App liegt jetzt unter `old/` und ist via `.gitignore` aus dem neuen Arbeitsstand ausgeschlossen.
- Alter Einstieg: `old/index.php` laedt `old/php/portal.php`.
- Alte Gameplay-Seiten liegen unter `old/php/`: `main.php`, `resources.php`, `research.php`, `build.php`, `fleets.php`, `scans.php`, `settlements.php`, `trade.php`, `commandoship_*`.
- Community/Admin: Forum, Macbox/Chat, Bildergalerie, Support, MDS/Moderation, Toplisten, Journal, Achievements.
- Alter Tick: `old/php/tick.php` wird laut `old/app.json` per Cron jede Minute gestartet, laeuft normal aber rundenabhaengig zur Tick-Minute.
- Alte Spielkonfiguration: `old/php/include_config.php`.
- Referenzdaten und Live-/Seed-Daten: `old/aquata_db.sql`.
- Frontend: altes JS in `old/js/`, inklusive jQuery 1.7.1, viel DOM-Scripting und Frames/Popups.

### Spielkern aus dem Altcode

Wichtig fuer das Remake:

- Accounts und Sessions.
- Karte/Koordinaten: Ozean `x`, Siedlung `y`, Station `z`.
- Station/Siedlung mit Ressourcen: Leichtmetall, Schwermetall, Energie.
- Sammler/Bots: Leichtmetall-, Schwermetall- und Energieproduktion.
- Bauqueue: Tabelle `build`, `whatid` fuer Schiffe, Sammler, Scanpakete und Ausruestung.
- Forschung: Schiff-, Scan- und Reisetechnik.
- Flotten: mehrere Slots pro Spieler, Schiffszaehler `ns1` bis `ns13`, Bewegung, Missionen `att`, `def`, `gather`.
- Tick: Bau/Forschung abschliessen, Flotten bewegen, Kaempfe triggern, Ressourcen/Score berechnen, Schutz-/Inaktivitaetslogik, Toplisten.
- Kampf: Schiffsdaten, Zielprioritaeten, EMP/First Strike/Hackboot, Kommandoschiff-Boni.
- Schutzsysteme: Startschutz, weisse Flagge, Noob-Ocean-/Ozean-7-Regeln.
- Allianzen: Mitgliedschaft, Forum/Kommunikation, Flottenstatus, Buendnisse.

Weniger wichtig fuer den MVP:

- Historisches Forum in voller Tiefe.
- Bildergalerie.
- Dopewars-Minispiel.
- Alte Voting-/Toplisten-Integrationen.
- MDS-/Moderationsspezialwerkzeuge.
- Bounty/Havoc/Reset-Sonderfaelle.
- Achievements in voller Breite.
- Mehrsprachigkeit jenseits Deutsch.

## 3. Produktziel

Das Remake bleibt ein strategisches, tickbasiertes Unterwasser-Browsergame. Der Fokus liegt auf planbaren Entscheidungen statt hektischer Realtime-Bedienung.

Leitplanken:

- Mobile zuerst: das Game-Design-Dokument priorisiert mobile Bildschirme vor Desktop und Tablet.
- Frueh lauffaehig: lieber wenige Kernmechaniken stabil als viele Altfeatures halb portiert.
- Einfache Einstiegskurve: neue Spieler starten mit Sammlern, wenigen Schiffstypen und klaren Dummy-/Tutorial-Situationen.
- Deterministisch: Tick und Kampf muessen reproduzierbar testbar sein.
- Schlafkompatibel: Aktivitaet soll helfen, aber nicht erzwingen; Tickdauer und Schutzmechaniken muessen normales Leben zulassen.
- Weniger Legacy-Ballast: Community- und Moderationsfeatures nur neu bauen, wenn sie das Spiel heute wirklich tragen.
- Runden statt endloser Altzustand: Rundenstart, Rundenende und Reset sauber modellieren; Speedrunde am Rundenende bleibt als Designoption offen.
- Regeln als Code und Daten: Schiffe, Forschung, Gebaeude, Kosten und Balancewerte als versionierte Definitionen.

### Designentscheidungen aus dem GDD

Diese Punkte gelten als bevorzugte Richtung, solange `docs/DECISIONS.md` nichts anderes festhaelt:

- Produktannahme fuer normale Runden ist ein 30-Minuten-Tick.
- Tickreihenfolge: Ressourcen auszahlen, Bauauftraege updaten, Flotten bewegen, Kampf, Errungenschaften pruefen.
- Spielwelt als 2D-Grid statt alter Ozean/Siedlung/Station-Struktur als harte Vorgabe.
- Reisezeiten in gut lesbaren Stufen statt krummer Formeln.
- Ressourcen koennen raeumlich verteilt sein, aber nicht so knapp, dass Positionierung frustriert.
- Sammler sind Kern des Wirtschaftsspiels und koennen gebaut, verteilt und spaeter gestohlen/gehackt werden.
- Energie wird als eigene Systemressource fuer Scans und moeglicherweise Schilde behandelt.
- Scans liefern abgestufte Informationen ueber Ressourcen, Flotten, Kommandoschiff, Produktion und Radar.
- Gemeinsame Angriffe/Verteidigungen sollen ueber Plaene koordinierbar sein; Start bleibt manuell.
- Kommandoschiff soll langfristig modularer werden: Slots, Module, Leveling, Forschung/Errungenschaften als Freischaltung.
- Account-Level und Langzeitstatistiken koennen rundenuebergreifend bleiben, waehrend spielrelevante Rundendaten resetten.
- Kommunikation soll schlanker werden: eher Chat/Raeume, Benachrichtigungen, Changelog, Wiki/Hilfe/Tooltips als ein grosses Legacy-Forum.
- Sharing ist ein eigenes Kernkonzept: Kampfberichte, Scans, Flotten- oder Kommandoschiffdaten koennen einmalig oder zeitlich begrenzt geteilt werden.

## 4. Architekturziel

### Monorepo

Vorschlag:

```text
apps/
  api/                 NestJS API, Jobs, Auth, Admin
  web/                 React/Vite Client
  e2e/                 Playwright Tests
packages/
  domain/              reine Spielregeln: Tick, Kampf, Ressourcen, Flotten
  db/                  Drizzle Schema, Migrationen, Seeds
  config/              gemeinsame Regeldefinitionen und Zod-Schemas
  ui/                  optionale gemeinsame UI-Komponenten
docs/
  REMAKE_PLAN.md
  DECISIONS.md
  GAME_DESIGN.md
  TEST_STRATEGY.md
```

### Backend-Grenzen

- `domain` enthaelt keine HTTP-, ORM- oder Framework-Abhaengigkeiten.
- `api` orchestriert Use-Cases, Transaktionen, Auth und Jobs.
- `db` kennt Tabellen und Migrationen, aber keine UI.
- Tick-Verarbeitung wird als expliziter Job modelliert: `runTick(roundId, tickNumber)`.
- Kaempfe werden aus Snapshots berechnet und schreiben danach ein Ergebnis zurueck.

### Frontend-Grenzen

- Keine Spielregeln im Frontend.
- UI liest Server-State ueber TanStack Query.
- Aktionen laufen ueber explizite Commands: `startBuildOrder`, `sendFleet`, `startResearch`, `renameStation`.
- Der erste Client ist ein produktives, mobile-first Game-Dashboard, keine Landingpage.

## 5. Datenmodell neu schneiden

Der alte Dump ist Referenz, nicht Zielmodell. Neue Tabellen sollten fachlich benannt und normalisiert werden.

MVP-Tabellen:

- `users`: Login-Identitaet, Rollen.
- `sessions`: serverseitige Sessions.
- `rounds`: Runde, Status, Start/Ende, Tick-Laenge.
- `players`: User in einer Runde.
- `stations`: Position, Name, Ressourcen, Schutzstatus.
- `settlements`: Gruppierung von Stationen nach Ozean/Siedlung.
- `map_tiles` oder `resource_nodes`: optionale Ressourcenverteilung im 2D-Grid.
- `fleets`: Flottenslot, Owner, Status, Mission, Start/Ziel, Timing.
- `fleet_ships`: Schiffe je Flotte und Typ.
- `ship_types`: versionierte Schiffsdaten.
- `build_orders`: Bauqueue.
- `research_types`: Forschungskatalog.
- `player_research`: Fortschritt/Freischaltungen.
- `tick_runs`: Tick-Status, Dauer, Fehler, Idempotenz-Key.
- `combat_reports`: Kampfergebnisse als lesbare und auditierbare Daten.
- `news_events`: Ereignisse fuer Spieler, spaeter Journal/Benachrichtigung.

Spaetere Tabellen:

- `alliances`, `alliance_members`, `alliance_invites`.
- `messages`, `chat_rooms`.
- `scans`, `scan_reports`.
- `command_ships`, `command_ship_skills`.
- `trade_orders` oder direkte Transfers.
- `rankings`.
- `achievements`.

## 6. MVP-Schnitt

Der erste spielbare Stand sollte bewusst klein sein.

### MVP muss koennen

- User registriert sich und loggt sich ein.
- User bekommt eine Station in einer neuen Runde.
- Dashboard zeigt mobil sauber lesbar Position, Ressourcen, Produktion, Flotten, Bauqueue und naechsten Tick.
- Tick produziert Ressourcen.
- User startet Bau von Sammlern oder einfachen Schiffen.
- Bauqueue wird im Tick fertiggestellt.
- User kann einfache Forschung starten und abschliessen.
- User kann eine Flotte zu einer Zielstation schicken.
- Flotte kommt nach berechneter Tickdauer an.
- Einfacher Kampf loest aus und erzeugt einen Kampfbericht.
- Tutorial-/Dummy-Gegner fuer den ersten Angriff ist als Test- und Onboarding-Ziel vorbereitet.
- Playwright prueft diesen kompletten Flow.

### MVP darf noch nicht koennen

- Vollstaendige Alt-Kampfkomplexitaet.
- Kommandoschiff-Skilltree.
- Modul-Kommandoschiff.
- Allianzen.
- Scans.
- Koordinierte Angriffs-/Verteidigungsplaene.
- Handel.
- Bounty/Havoc/White-Flag-Feinlogik.
- Forum/Macbox/Bildergalerie.

## 7. Teststrategie

E2E ist die fuehrende Sicherheitsschicht, aber nicht die einzige.

### E2E mit Playwright

Erste kritische Szenarien:

- Registrierung -> Login -> Station sichtbar.
- Ressourcen steigen nach manuell ausgeloestem Tick.
- Bauauftrag anlegen -> Tick laufen lassen -> Bestand steigt.
- Forschung starten -> Tick(s) -> Forschung freigeschaltet.
- Flotte senden -> Tick(s) -> Flotte bewegt/kommt an.
- Angriff mit zwei Testspielern -> Kampfbericht erscheint -> Schiffe/Ressourcen veraendert.
- Mobile Viewport prueft dieselben Kernpfade ohne horizontales Scrollen oder unbedienbare Controls.

E2E-Anforderungen:

- Jeder Test startet mit frischer Datenbank oder isolierter Test-Runde.
- Tests duerfen den Tick deterministisch per API/Testhelper ausloesen.
- Testdaten werden ueber Factories erstellt, nicht ueber UI-Klickorgien.
- UI-Flows werden trotzdem fuer die Kernpfade voll geklickt.

### Domain-/Unit-Tests

Pflicht fuer:

- Ressourcenproduktion.
- Baukosten und Bauzeiten.
- Reisezeitberechnung.
- Tick-Idempotenz.
- Kampfberechnung.
- Ranking/Score-Berechnung.

### Integrationstests

Pflicht fuer:

- Transaktionale Commands.
- Tick-Job gegen Testdatenbank.
- Auth/Session.
- Migrationen und Seeds.

## 8. Phasenplan

### Phase 0: Projektfundament

- [x] Entscheidung Stack finalisieren.
- [x] Entscheiden, ob bestehende `.git`-Historie geloescht und ein wirklich neues Git-Repo initialisiert werden soll.
- [x] Neues Monorepo scaffolden.
- [x] Docker Compose fuer PostgreSQL, API und Web.
- [x] TypeScript strict, ESLint, Prettier, pnpm Workspaces.
- [x] CI einrichten: install, lint, typecheck, test, e2e.
- [x] Playwright-Grundsetup mit Healthcheck-Test.
- [x] `docs/DECISIONS.md`, `docs/GAME_DESIGN.md`, `docs/TEST_STRATEGY.md` anlegen.

Abnahme:

- `pnpm test`, `pnpm typecheck`, `pnpm e2e` laufen lokal.
- Web und API starten mit einem Kommando.
- Eine leere Startseite/API-Healthcheck ist per E2E getestet.

Umgesetzt am 2026-06-08:

- Workspace im Repo-Root mit `apps/api`, `apps/web`, `apps/e2e`, `packages/domain`, `packages/db`.
- Lokale Shell nutzt bei Bedarf `corepack pnpm`, weil auf Chris' Maschine kein direkter `pnpm`-Shim im PATH lag.
- Verifiziert: `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm test`, `corepack pnpm e2e`, `corepack pnpm build`.

### Phase 1: Spieldefinitionen und Domain-Core

Operativer Detailplan: `docs/PHASE_1_PLAN.md`.

- [x] Schiffstypen aus Altcode als versionierte Config uebernehmen und bereinigen.
- [x] Forschungstypen modellieren.
- [x] Ressourcenmodell definieren.
- [x] 2D-Kartenmodell und gestufte Reisezeit definieren.
- [x] Reisezeitmodell definieren.
- [x] Minimalen Kampf-Simulator bauen.
- [x] Domain-Tests fuer alle Regeln schreiben.

Abnahme:

- Kampf und Tick koennen ohne Datenbank gegen Snapshots getestet werden.
- Balancewerte sind in Config-Dateien versioniert.

Umgesetzt am 2026-06-08:

- Domain-Core in `packages/domain` mit Ressourcen/Produktion, Karte/Reisezeit, MVP-Schiffen, Forschung, FIFO-Bauqueue, Flottenbewegung, deterministischem Kampf und `runGameTick`.
- Verifiziert: `corepack pnpm format:check`, `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm test`, `corepack pnpm build`, `corepack pnpm e2e`.

### Phase 2: Datenbank und API-MVP

Operativer Detailplan: `docs/PHASE_2_PLAN.md`.

- [x] Neues Drizzle-Schema fuer MVP-Tabellen.
- [x] Migrationen und Seeds.
- [x] Auth: Registrierung, Login, Logout, Session.
- [x] Round-/Player-/Station-Erstellung.
- [x] Commands fuer Bau, Forschung und Flottenbewegung.
- [x] Manueller Tick-Endpunkt fuer Dev/Test, geschuetzter Job fuer Produktion.

Abnahme:

- API kann eine Test-Runde anlegen.
- Zwei Spieler koennen erstellt und bewegt werden.
- Tick laeuft idempotent und schreibt `tick_runs`.

Umgesetzt am 2026-06-08:

- Phase 2 wurde als Commit `723ac67 phase 2` abgeschlossen.
- Drizzle-Kit, Migration, Seed, API-Config, DB-Provider, Auth, Game-Snapshot, Commands, persistierter Dev-Tick und API-Integrationstests sind vorhanden.

### Phase 3: Frueh spielbares Web

Operativer Detailplan: `docs/PHASE_3_PLAN.md`.

- [x] App-Shell mit Navigation fuer Dashboard, Bau, Forschung, Flotten, Berichte.
- [x] Dashboard mit Ressourcen, Produktion, Position, naechstem Tick.
- [x] Mobile-first Layout als primaere Umsetzung.
- [x] Onboarding-Flow mit Dummy-Ziel fuer ersten Angriff.
- [x] Bauansicht fuer Sammler und einfache Schiffe.
- [x] Forschungsansicht.
- [x] Flottenansicht mit Senden und Status.
- [x] Kampfberichtsanzeige.
- [x] Playwright-MVP-Flow.

Abnahme:

- Ein neuer User kann ohne manuelle DB-Eingriffe sinnvoll spielen.
- Der MVP-E2E-Flow ist stabil.

Umgesetzt am 2026-06-08:

- Phase 3 wurde als Commit `d175279 phase 3` abgeschlossen.
- Web-MVP mit Auth, Game-Shell, Dashboard, Bau, Forschung, Flotten, Berichten, Dev-Tick und Playwright-MVP-Flow ist vorhanden.
- `GET /game/me` liefert fuer das Web zusaetzlich Catalog-Daten, aktive eigene Flotten und letzte eigene Kampfberichte.

### Phase 4: Spieltiefe ausbauen

Operativer Detailplan: `docs/PHASE_4_PLAN.md`.

- [ ] Kampfregeln naeher an Aquata bringen: EMP, First Strike, Hackboot, Zielprioritaeten.
- [ ] Mehrtick-Kampf pruefen und ggf. einfuehren.
- [ ] Energie als Systemressource fuer Scans/Schilde konkretisieren.
- [ ] Scans und Scanenergie.
- [ ] Kommandoschiff in reduzierter erster Version.
- [ ] Modulares Kommandoschiff mit Slots/Modulen als Zielmodell ausarbeiten.
- [ ] Schutzsysteme: Startschutz, Inaktivitaet, einfache weisse Flagge.
- [ ] Rankings und Toplisten.
- [ ] News/Journalsystem.
- [ ] Account-Level und rundenuebergreifende Langzeitstatistiken konzipieren.

Abnahme:

- Erweiterte Kampf- und Scanregeln sind domain-getestet.
- E2E deckt mindestens einen Angriff, eine Verteidigung und einen Scan ab.

### Phase 5: Soziale Systeme

- [ ] Allianzen: erstellen, beitreten, verlassen, Rollen.
- [ ] Allianzuebersicht und einfache Allianzkommunikation.
- [ ] Private Nachrichten oder schlanker Chat.
- [ ] Angriffs- und Verteidigungsplaene fuer koordinierte Flottenstarts.
- [ ] Sharing fuer Kampfberichte, Scans und ausgewaehlte Live-Daten.
- [ ] Ozean-/Siedlungsuebersicht.
- [ ] Optional: Forum nur falls es heute noch Produktwert hat.

Abnahme:

- Zwei Spieler koennen sich in einer Allianz koordinieren.
- Allianzstatus beeinflusst relevante UI und spaetere Flottenfunktionen.

### Phase 6: Rundenbetrieb, Admin, Balancing

- [ ] Rundenstart/-ende/-reset.
- [ ] Admin-Tools fuer Spieler-/Runden-/Tick-Status.
- [ ] Observability: strukturierte Logs, Metriken, Tick-Dauer, Fehler.
- [ ] Backup-/Restore-Konzept.
- [ ] Balance-Dashboards und Export der Rundenstatistik.

Abnahme:

- Eine Testrunde kann gestartet, gespielt, beendet und neu gestartet werden.
- Tick-Fehler sind sichtbar und wiederholbar.

## 9. Agent-Regeln fuer die Umsetzung

Jeder Agent soll:

- Vor Aenderungen dieses Dokument und relevante `docs/*` lesen.
- Kleine, abnahmefaehige Tasks waehlen.
- Keine Alt-PHP-Struktur blind nachbauen.
- Spielregeln zuerst in `packages/domain` testen.
- Fuer UI-Arbeit mindestens einen Playwright-Test oder eine begruendete Testnotiz liefern.
- Nach substantieller Erkenntnis dieses Dokument oder `docs/DECISIONS.md` aktualisieren.
- Keine Secrets aus `include_config.php` uebernehmen.

## 10. Offene Entscheidungen fuer Chris

Diese Punkte sollten vor oder waehrend Phase 0 besprochen werden:

- Soll die bestehende `.git`-Historie entfernt und mit `git init` wirklich neu gestartet werden? Aktuell wurde die Historie bewusst nicht geloescht.
- Soll das Remake direkt im Root entstehen oder in einem neuen Unterordner wie `remake/`?
- Soll PostgreSQL gesetzt sein, oder ist MySQL/MariaDB wegen bestehender DDEV-/Dump-Naehe bevorzugt?
- Wie nah soll der Kampf an der alten Formel bleiben, wenn das GDD Mehrtick-Kaempfe und neue Beuteverteilung andeutet?
- Welche Altfeatures sind emotional wichtig und sollen nicht gestrichen werden?
- Soll es wieder feste Runden mit Reset/Havoc geben?
- Sind 30 oder 60 Minuten Tickdauer die erste Zielannahme?
- Soll die alte Ozean/Siedlung/Station-Logik komplett durch ein 2D-Grid ersetzt werden?
- Soll die Community-Kommunikation intern bleiben oder eher ueber moderne externe Tools laufen?
- Soll die UI nostalgisch an Aquata erinnern oder bewusst komplett modern werden?

## 11. Bewusste Entschlackung

Kandidaten zum Weglassen oder spaeten Wiederaufnehmen:

- Dopewars.
- Bildergalerie.
- Voting-Integrationen.
- Historische MDS-/Moderationswerkzeuge.
- Alte Forumskomplexitaet mit Polls/Observed/Lastseen in voller Tiefe.
- Spezialsprachen wie `wn`, `mageh`, `mafia`.
- Tarnaccounts und hardcodierte User-IDs.
- Legacy-Header-/Frame-Konzept.

Kandidaten zum Behalten:

- Koordinaten-/Karten-Gefuehl.
- Organische Nachbarschaften durch Karte, Ressourcenverteilung und Reisezeiten.
- Tickbasierte Planung.
- Flotten mit Ankunftszeit und Abfang-/Verteidigungsmoeglichkeiten.
- Schiffsklassen und Counterplay.
- Kommandoschiff als langfristige Identitaet, spaeter modular statt als direkte Alt-Portierung.
- Kampfberichte und Journal als Spielgedaechtnis.
- Sharing von Berichten, Scans und Daten als kooperatives Kernfeature.

## 12. Erste konkrete Tasks

1. Phase-2-Entscheidungen aus `docs/PHASE_2_PLAN.md` bestaetigen und bei Bedarf in `docs/DECISIONS.md` eintragen.
2. Drizzle-Kit, Migrationen und DB-Client in `packages/db` einrichten.
3. MVP-Schema fuer User, Sessions, Runden, Spieler, Stationen, Orders, Research, Fleets, Reports und Tick Runs implementieren.
4. Seeds und Testdaten fuer aktive Runde, Dummy-Gegner und Dev-User vorbereiten.
5. API-Infrastruktur mit DB Provider, Config und Validation aufsetzen.
6. Auth-Endpunkte mit HTTP-only Session-Cookie implementieren.
7. Player/Station-Bootstrap und Stationssnapshot-Endpoint implementieren.
8. Build-, Research- und Fleet-Commands transaktional implementieren.
9. Persistierten Dev/Test-Tick mit Idempotenz und CombatReport-Persistenz implementieren.
10. API-Integrationstests gegen PostgreSQL schreiben und Phase 2 verifizieren.

## 13. Technische Referenzen

- NestJS beschreibt sich als Framework fuer effiziente, skalierbare serverseitige Node.js-Anwendungen mit modularer Architektur: https://docs.nestjs.com/applications/architecture
- Vite bietet einen modernen Dev-Server mit schneller HMR und TypeScript/React-Templates: https://vite.dev/guide/
- Playwright Test ist fuer End-to-End-Tests moderner Web-Apps ausgelegt und unterstuetzt TypeScript: https://playwright.dev/docs/test-typescript
- Drizzle unterstuetzt PostgreSQL, SQL-Migrationen und TypeScript-Schemaarbeit: https://orm.drizzle.team/docs/get-started/postgresql-new.html
- TanStack Router legt Fokus auf type-safe Routing fuer React: https://tanstack.com/router/latest/docs/framework/react/guide/type-safety
- TanStack Query deckt Server-State, Fetching, Caching und Synchronisation im Frontend ab: https://tanstack.com/query/
