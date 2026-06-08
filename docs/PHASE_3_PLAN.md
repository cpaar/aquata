# Phase 3 Plan: Frueh spielbares Web

Stand: 2026-06-08

Ziel von Phase 3 ist der erste echte Web-MVP: Ein neuer User kann sich registrieren, einloggen, seine Station sehen, Bau und Forschung starten, eine Flotte zum Dummy-Ziel senden, Ticks deterministisch ausloesen und danach den Kampfbericht sehen. Phase 3 baut noch keine vollstaendige Spieltiefe, aber sie macht den bestehenden API-/Domain-Core als Browsergame bedienbar.

## Leitlinien

- Mobile-first ist primaer. Desktop darf dichter sein, aber Mobile muss der fuehrende Abnahme-Viewport sein.
- Keine Landingpage. Der erste Screen ist Login/Register oder die geschuetzte Spieloberflaeche.
- Keine Spielregeln im Frontend. Das Frontend zeigt Server-State und sendet Commands.
- UI-Komponenten bleiben klein und fachlich benannt. Erst lokale Komponenten, kein separates UI-Package in Phase 3.
- TanStack Query ist die Quelle fuer Server-State; Mutations invalidieren gezielt den Game-Snapshot.
- Cookies werden mit `credentials: "include"` gesendet.
- E2E prueft den echten Browser-Flow, nicht nur API-Health.
- API-Erweiterungen in Phase 3 bleiben klein und dienen nur der Web-Spielbarkeit.

## Phase-3-Ergebnis

Am Ende von Phase 3 soll es moeglich sein:

- Einen neuen Account ueber die Web-App zu registrieren.
- Sich einzuloggen, auszuloggen und bei Reload eingeloggt zu bleiben.
- Eine geschuetzte Game-Shell mit Navigation zu nutzen.
- Ressourcen, Produktion, Position, Schiffe, Bauqueue, Forschung, aktive Flotten, Dummy-Ziele und letzte Kampfberichte zu sehen.
- Einen Bauauftrag fuer einfache Schiffe/Sammler zu starten.
- Eine Forschung zu starten.
- Eine Angriffsflotte zum Dummy-Ziel zu senden.
- In Non-Production einen Tick ueber die UI auszufuehren.
- Nach ausreichend Ticks einen Kampfbericht im Web zu sehen.
- Einen Playwright-Test zu haben, der den MVP-Flow von Register bis Kampfbericht abdeckt.

## Vorgeschlagene Reihenfolge

### 1. Web-App-Struktur aufraeumen

Deliverables:

- `apps/web/src/App.tsx` in Router-/Layout-/Page-Komponenten aufteilen.
- API-Client in `apps/web/src/api/` mit `credentials: "include"`.
- Typen fuer API-Responses und Command-Payloads zentral ablegen.
- Einheitliches Error-Handling fuer Query-/Mutation-Fehler.
- Query-Keys und Mutation-Helper fuer Auth und Game.

Abnahme:

- Health-Smoke bleibt erhalten oder wird in einen sinnvolleren App-Smoke ueberfuehrt.
- `@aquata/web` bleibt typisiert ohne `any`-drift.

### 2. Auth-Flow im Web

Deliverables:

- Login- und Register-Route.
- `GET /auth/me` beim App-Start.
- Geschuetzte Routen fuer Game-Seiten.
- Logout-Button in der App-Shell.
- Form-Validierung fuer Username, E-Mail und Passwort.
- Klare Fehlermeldungen fuer falsche Logins, doppelte User und fehlende Felder.

Abnahme:

- Neuer User kann sich registrieren und landet danach entweder direkt im Spiel oder im Login.
- Eingeloggter User bleibt nach Reload im Spiel.
- Logout fuehrt zur Auth-Seite zurueck.

### 3. Game-Snapshot fuer Web komplettieren

Phase 2 liefert bereits `GET /game/me`, aber die Web-MVP-Anzeige braucht voraussichtlich mehr Daten.

Deliverables:

- `GET /game/me` um aktive eigene Flotten ergaenzen oder separate `GET /fleets`-Route einfuehren.
- Letzte eigene Kampfberichte abrufbar machen, bevorzugt als `recentCombatReports` im Snapshot oder als `GET /combat-reports`.
- Response-Shape so halten, dass UI nicht mehrere unnoetige Roundtrips fuer den MVP braucht.
- API-Integrationstest fuer die neue Snapshot-/Reports-Daten.

Abnahme:

- Nach Fleet-Command und Ticks kann das Web den Fleet-Status und spaeter den CombatReport anzeigen.
- Keine direkte DB-Abfrage in E2E noetig, um Kampfbericht-Anzeige zu pruefen.

### 4. Geschuetzte Game-Shell und Dashboard

Deliverables:

- App-Shell mit kompakter Navigation: Dashboard, Bau, Forschung, Flotten, Berichte.
- Dashboard zeigt:
  - Stationname und Koordinaten.
  - Ressourcen `aluminium`, `steel`, `energy`.
  - Produktion pro Tick.
  - Schiffsbestaende.
  - Rundenstatus und aktuelle Ticknummer.
  - naechste sinnvolle Aktion als UI-Zustand, nicht als erklaerender Marketingtext.
- Mobile Layout ohne horizontales Scrollen.

Abnahme:

- Ein frischer Spieler versteht aus der UI heraus, dass Ressourcen, Schiffe und Dummy-Ziel vorhanden sind.
- Dashboard bleibt bei Lade-, Fehler- und Empty-State stabil.

### 5. Bauansicht

Deliverables:

- Liste der baubaren MVP-Einheiten: `fighter`, `interceptor`, `frigate`, `harvester`.
- Kosten, Bauzeit und vorhandener Bestand anzeigen.
- Quantity-Input mit sinnvollen Grenzen.
- Command `POST /build-orders`.
- Bauqueue mit Restticks anzeigen.
- Nach Mutation Snapshot aktualisieren.

Abnahme:

- User kann einen Bauauftrag starten.
- Ressourcen sinken sofort im UI.
- Nach Dev-Tick verschwindet abgeschlossener Auftrag und Bestand steigt.

### 6. Forschungsansicht

Deliverables:

- Liste der MVP-Forschungen: `shipbuilding`, `frigateEngineering`, `industrialLogistics`.
- Kosten, Dauer, Status: verfuegbar, aktiv, abgeschlossen.
- Command `POST /research`.
- Aktive Forschung mit Restticks anzeigen.

Abnahme:

- User kann eine Forschung starten.
- Nach ausreichend Dev-Ticks erscheint sie als abgeschlossen.
- Bereits aktive/abgeschlossene Forschung ist nicht erneut startbar.

### 7. Flottenansicht

Deliverables:

- Dummy-Ziele aus Snapshot anzeigen.
- Schiffsauswahl fuer verfügbare Schiffe.
- Command `POST /fleets`.
- Aktive Flotten mit Mission, Ziel, Schiffsloadout und Restticks anzeigen.
- Validation: keine leere Flotte, keine Mengen ueber Bestand.

Abnahme:

- User kann eine Flotte zum Dummy-Ziel senden.
- Schiffe werden aus der Station abgezogen.
- Aktive Flotte ist bis zur Ankunft sichtbar.

### 8. Berichte und Dev-Tick

Deliverables:

- Berichteseite oder Dashboard-Sektion fuer letzte Kampfberichte.
- Minimal lesbare Darstellung: Angreifer, Verteidiger, Tick, eingesetzte Schiffe, Verluste, Gewinner/Outcome soweit im Report vorhanden.
- Dev-Tick-Button nur fuer Non-Production/Test sichtbar.
- Dev-Tick-Button invalidiert den Snapshot und Reports.

Abnahme:

- User kann lokal Ticks ausloesen und Fortschritt sofort sehen.
- Nach Angriff und Ankunft ist ein Kampfbericht im Web sichtbar.

### 9. Playwright-MVP-Flow

Pflichtszenario:

1. Register ueber Web.
2. Game-Dashboard erscheint.
3. Bauauftrag starten.
4. Dev-Tick ausloesen.
5. Schiffbestand steigt.
6. Forschung starten.
7. Ausreichend Dev-Ticks ausloesen.
8. Forschung ist abgeschlossen.
9. Flotte zum Dummy-Ziel senden.
10. Ausreichend Dev-Ticks ausloesen.
11. Kampfbericht erscheint.
12. Logout funktioniert.

Zusatzanforderungen:

- Test laeuft gegen isolierte Testdaten oder eine frisch geseedete Runde.
- Mobile Viewport wird mindestens fuer Dashboard und einen Command-Flow geprueft.
- Keine harten sleeps; auf UI-Zustand warten.

## Nicht in Phase 3

- Vollstaendige visuelle Karte.
- Scans.
- Allianzen.
- Handel.
- Kommandoschiff.
- Passwort-Reset.
- E-Mail-Verifikation.
- Admin-UI.
- Produktives Tick-Scheduling.
- Balance-Redesign.
- Komplexe Kampfbericht-Visualisierung.

## Offene Entscheidungen

Diese Entscheidungen sollte Chris vor oder frueh in Phase 3 bestaetigen:

1. UI-Richtung: modern, ruhig und funktional mit Aquata-Unterwasser-Identitaet statt nostalgischer Legacy-Skin?
2. Register-Verhalten: Nach Registrierung automatisch einloggen oder danach explizit zum Login schicken?
3. Dev-Tick im Web: In Non-Production als sichtbarer Button im Game erlauben, damit Entwicklung und E2E schnell bleiben?
4. Navigation: Eigene Seiten fuer Bau/Forschung/Flotten/Berichte oder ein dichteres Dashboard mit Tabs?
5. Berichtsdaten: Reicht fuer Phase 3 eine minimale Text-/Tabellenansicht der Kampfberichte?

Empfehlung:

- UI modern und funktional bauen, mit zurueckhaltender Aquata-Identitaet.
- Nach Registrierung automatisch einloggen, wenn die API das ohne grossen Umbau erlaubt; sonst direkt Login nachziehen.
- Dev-Tick-Button in Non-Production anzeigen und in Production hart verstecken.
- Fuer Mobile Tabs/Segmente innerhalb einer geschuetzten Game-Shell nutzen; auf Desktop darf die Shell mehrere Bereiche nebeneinander zeigen.
- Kampfberichte in Phase 3 minimal textlich/tabellarisch darstellen.

## Verifikation fuer Phase 3

Nicht erneut fuer Phase 2 noetig, aber vor Abschluss von Phase 3:

- `corepack pnpm --filter @aquata/web typecheck`
- `corepack pnpm --filter @aquata/web build`
- `corepack pnpm --filter @aquata/e2e test`
- `corepack pnpm format:check`
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm test`
- `corepack pnpm build`
- `corepack pnpm e2e`

Bei API-Erweiterungen:

- API-Integrationstests mit `TEST_DATABASE_URL`.
