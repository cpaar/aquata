# Phase 1 Plan: Spieldefinitionen und Domain-Core

Stand: 2026-06-08

Ziel von Phase 1 ist ein framework- und datenbankfreier Spielkern in `packages/domain`. Phase 1 soll keine API-Endpunkte, keine UI-Flows und keine Persistenz erzwingen. Alles, was hier entsteht, muss deterministisch mit Vitest testbar sein und spaeter von API, Jobs und E2E-Flows genutzt werden koennen.

## Leitlinien

- Domain-Code bleibt frei von NestJS, Drizzle, HTTP, Browser APIs und Datenbankzugriff.
- Regeln werden ueber versionierte Definitionen modelliert, nicht ueber hart verdrahtete UI-Logik.
- Zahlenwerte duerfen fuer den MVP pragmatisch sein, muessen aber in Configs sichtbar und testbar sein.
- Alte Aquata-Werte aus `old/` sind Referenz, nicht Pflicht.
- Jeder Teilabschnitt endet mit Tests und einem kleinen, stabilen Export aus `packages/domain`.

## Phase-1-Ergebnis

Am Ende von Phase 1 soll `packages/domain` Folgendes liefern:

- Ressourcentypen, ResourceStock und sichere Rechenfunktionen.
- Produktionsmodell fuer Stationen/Sammler.
- 2D-Koordinatenmodell und gestufte Reisezeitberechnung.
- Schiffstyp-Definitionen fuer MVP-Schiffe.
- Forschungsdefinitionen und einfache Unlock-Regeln.
- Flotten-Snapshots und Bewegung/ETA als reine Domain-Regeln.
- Minimaler Kampf-Simulator mit Kampfbericht-Snapshot.
- Tick-Snapshot-Modell fuer Ressourcen, Bau/Forschung, Flottenankunft und Kampftrigger-Vorbereitung.
- Vitest-Abdeckung fuer alle oben genannten Regeln.

## Vorgeschlagene Reihenfolge

### 1. Ressourcen und Produktion

Deliverables:

- `ResourceType`, `ResourceStock`, `ResourceDelta`.
- Funktionen: `emptyResources`, `addResources`, `subtractResources`, `canAfford`, `multiplyResources`, `clampResources`.
- Produktionsdefinition fuer Sammler/Station: `ProductionSource`, `calculateProduction`.
- Tests fuer Addition, Kostenpruefung, negative Werte, Rundung und 30-Minuten-Tick-Produktion.

MVP-Annahme:

- Ressourcen bleiben vorerst nah am alten Spiel: `lightMetal`, `heavyMetal`, `energy`.
- Sammlerproduktion wird fuer das MVP einfach berechnet. Raeumliche Ressourcenvorkommen werden vorbereitet, aber noch nicht gameplay-kritisch gemacht.

Abnahme:

- Ressourcenfunktionen sind pure und geben neue Objekte zurueck.
- Keine Ressource kann durch Domain-Commands unbeabsichtigt negativ werden.

### 2. Karte und Reisezeit

Deliverables:

- `Coordinate { x, y }`.
- Distanzfunktion, bevorzugt Manhattan-Distanz fuer das MVP.
- `TravelBand`-Definitionen.
- `calculateTravelTicks(origin, destination, travelConfig)`.
- Tests fuer gleiche Position, kurze/mittlere/lange Wege und Bandgrenzen.

MVP-Annahme:

- 2D-Grid.
- Reisezeit in Stufen, keine krummen Formeln.
- Startwerte koennen sein: 1-10 Felder = 4 Ticks, 11-20 = 5 Ticks, 21-30 = 6 Ticks, 31+ = 7 Ticks. Diese Zahlen stammen aus dem GDD-Beispiel und sollen spaeter balanciert werden.

Abnahme:

- Reisezeit ist deterministisch und unabhaengig von Echtzeit.
- Tickdauer ist kein Teil der Reisezeitlogik; Reisezeit wird in Ticks berechnet.

### 3. Schiffstypen

Deliverables:

- `ShipClass`, `ShipTypeDefinition`, `ShipLoadout`.
- Eine versionierte MVP-Schiffsliste.
- Hilfsfunktionen: `getShipType`, `calculateFleetPower`, `calculateFleetCost`, `isFleetEmpty`.
- Tests fuer Kosten, Kampfkraft und leere Flotten.

MVP-Annahme:

- Start mit wenigen Schiffen statt allen alten 12 Typen.
- Empfohlener MVP-Schnitt:
  - `fighter`: einfacher Angreifer.
  - `interceptor`: schneller/leichter Konter.
  - `frigate`: teurer/stabiler Grundtyp.
  - `harvester`: kein Kampfschiff, Wirtschaftseinheit.
- Alte Namen wie Piranha, Hai, Taifun koennen spaeter als Displaynamen genutzt werden, aber Phase 1 sollte interne IDs klar und englisch halten.

Abnahme:

- Schiffsdaten liegen als Config vor.
- Kampf-Simulator kann ohne Datenbank nur mit Loadouts laufen.

### 4. Forschung und Unlocks

Deliverables:

- `ResearchDefinition`, `ResearchState`, `UnlockRequirement`.
- Minimaler Forschungsbaum fuer MVP-Schiffe und Produktion.
- Funktionen: `canStartResearch`, `completeResearch`, `isUnlocked`.
- Tests fuer Voraussetzungen, Kosten und Freischaltung.

MVP-Annahme:

- Forschung ist zuerst linear/klein.
- Kommandoschiff, Scans und Allianzen werden nicht freigeschaltet, nur als spaetere Systeme vermerkt.

Abnahme:

- Forschungsregeln sind unabhaengig von User-/DB-Modellen.
- Unlocks koennen spaeter fuer UI/API abgefragt werden.

### 5. Bauqueue und Domain-Commands

Deliverables:

- `BuildOrder`, `BuildableDefinition`, `BuildQueueState`.
- Funktionen: `canStartBuild`, `startBuildOrder`, `advanceBuildQueue`.
- Tests fuer Kosten, Bauzeit, Fertigstellung und mehrere Orders.

MVP-Annahme:

- Bauzeiten werden in Ticks gerechnet.
- Bauqueue kann anfangs simpel FIFO sein.

Abnahme:

- Ein Build-Tick kann aus Snapshot A einen Snapshot B erzeugen.
- Fertige Orders geben klar zurueck, welche Einheiten hinzugefuegt werden sollen.

### 6. Flotten und Bewegung

Deliverables:

- `Fleet`, `FleetMission`, `FleetMovement`.
- Funktionen: `createFleetMovement`, `advanceFleetMovement`, `hasArrived`.
- Tests fuer Hinflug, Ankunft, Rueckkehr-Vorbereitung und ungueltige Ziele.

MVP-Annahme:

- Missionen im MVP: `attack`, optional `return`.
- Verteidigung/Stationierung/Sammelpunkte kommen spaeter.

Abnahme:

- Bewegung ist tickbasiert und deterministisch.
- Kampftrigger kann aus angekommenen Angriffen abgeleitet werden.

### 7. Minimaler Kampf-Simulator

Deliverables:

- `CombatSide`, `CombatInput`, `CombatResult`, `CombatReport`.
- Deterministische Kampfberechnung ohne Zufall oder mit injizierbarem Seed.
- Verluste pro Schiffstyp.
- Ergebnis: Angreifer gewinnt, Verteidiger gewinnt oder beide verlieren.
- Tests fuer klare Uebermacht, Gleichstand, leere Flotten, ungueltige Inputs und Berichtsdaten.

MVP-Annahme:

- Ein Kampf wird im MVP in einem Tick aufgeloest.
- Keine EMP-/Hack-/First-Strike-Sonderregeln.
- Kein Kommandoschiff.
- Kein Beutemodell ausser optionaler Report-Platzhalter.

Abnahme:

- Kampf kann aus reinen Snapshots ausgefuehrt werden.
- Ergebnis ist reproduzierbar.
- Report enthaelt genug Daten fuer Phase-3-UI.

### 8. Tick-Snapshot

Deliverables:

- `GameTickInput`, `GameTickResult`.
- Orchestrierende Domain-Funktion fuer MVP-Schritte:
  - Ressourcen produzieren.
  - Bauqueue fortschreiben.
  - Forschung fortschreiben.
  - Flotten bewegen.
  - angekommenen Angriff als CombatInput vorbereiten oder direkt auswerten.
- Tests fuer einen kleinen End-to-End-Domain-Snapshot.

MVP-Annahme:

- Der echte persistierte Tick-Job kommt in Phase 2.
- Phase 1 liefert nur die reine Berechnung.

Abnahme:

- Ein Test kann aus einem Startsnapshot nach einem Tick erwartete Ressourcen, Orders, Flottenstatus und ggf. CombatReport pruefen.
- Keine Seiteneffekte ausser Rueckgabewert.

## Nicht in Phase 1

- API-Commands und Controller.
- Drizzle-Migrationen ausser wenn Phase 2 vorbereitet wird.
- Auth, Sessions, Registrierung.
- Web-UI.
- Playwright-Flows jenseits Phase-0-Smoke.
- Kommandoschiff-Module.
- Scans/Energie-Detailsystem.
- Allianzen und koordinierte Plaene.
- Handel.

## Offene Entscheidungen

Diese Entscheidungen sollten vor oder sehr frueh in Phase 1 bestaetigt werden:

1. Ressourcennamen: bleiben `lightMetal`, `heavyMetal`, `energy` fuer MVP?
2. Distanzmodell: Manhattan-Distanz fuer das 2D-Grid?
3. Reisezeit-Bands: GDD-Beispiel als Startwerte uebernehmen?
4. MVP-Schiffe: mit 3 Kampfschiffen plus `harvester` starten?
5. Kampf: komplett deterministisch ohne Zufall fuer MVP?
6. Bauqueue: FIFO und Bauzeiten in Ticks?

Empfehlung: Alle sechs Punkte wie oben vorgeschlagen bestaetigen. Das haelt Phase 1 klein und laesst Balancing spaeter ohne Architekturbruch zu.

## Verifikation fuer Phase 1

Nach jedem groesseren Schritt:

- `corepack pnpm --filter @aquata/domain test`
- `corepack pnpm typecheck`
- `corepack pnpm lint`

Vor Abschluss von Phase 1:

- `corepack pnpm format:check`
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm test`
- `corepack pnpm build`
- Optional weiterhin `corepack pnpm e2e`, damit Phase 0 nicht regressiert.
