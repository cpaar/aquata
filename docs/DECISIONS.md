# Aquata Remake Decisions

Stand: 2026-06-08

Dieses Dokument haelt getroffene Entscheidungen fest. Neue Entscheidungen bitte mit Datum, Kontext und kurzer Begruendung ergaenzen.

## 2026-06-08: Remake entsteht im Root

Entscheidung: Das neue Projekt wird direkt im Repository-Root aufgebaut.

Begruendung: Die alte PHP-App liegt unter `old/` und ist via `.gitignore` ausgeschlossen. Die Git-Historie wurde neu initialisiert, daher ist der Root sauber genug fuer das neue Monorepo.

## 2026-06-08: Stack fuer MVP

Entscheidung: TypeScript-Monorepo mit NestJS API/Jobs, React + Vite Web-App, TanStack Router, TanStack Query, PostgreSQL, Drizzle ORM und Playwright.

Begruendung: Das Spiel braucht eine testbare Server-Domaene fuer Tick, Kampf, Flotten und Ressourcen. NestJS gibt klare Modulgrenzen fuer Agents; React/Vite ist pragmatisch fuer ein schnelles, mobile-first Frontend; PostgreSQL/Drizzle liefern saubere Migrationen, Constraints und TypeScript-Naehe.

## 2026-06-08: Tickdauer

Entscheidung: Die Produktannahme fuer normale Runden ist ein 30-Minuten-Tick.

Begruendung: 30 Minuten erlauben feinere Reisezeit- und Timing-Abstufungen als 60 Minuten, bleiben aber noch schlaf- und alltagstauglich. Fuer Tests und Entwicklung wird der Tick deterministisch per API/Testhelper ausgeloest.

## 2026-06-08: Karte

Entscheidung: Das MVP startet mit einem 2D-Grid statt die alte Ozean/Siedlung/Station-Struktur direkt zu uebernehmen.

Begruendung: Das Game Design Document beschreibt eine zweidimensionale Karte als Zielrichtung. Nachbarschaftsgefuehl soll spaeter durch Regionen, Ressourcenverteilung und Reisezeiten entstehen, nicht durch das alte Schema als harte technische Vorgabe.

## 2026-06-08: Kampf im MVP

Entscheidung: Der MVP-Kampf wird stark vereinfacht, aber mit denselben Grundachsen gebaut: Schiffstypen, Treffer/Schaden, Verluste und Kampfbericht.

Begruendung: Der alte Kampf ist fuer den MVP zu komplex. Eine einfache, deterministische Kampflogik macht E2E-Spielbarkeit frueh moeglich und laesst EMP, Hack, First Strike, Mehrtick-Kampf und Beuteverteilung spaeter kontrolliert nachziehen.

## 2026-06-08: Onboarding

Entscheidung: Ein Dummy-Gegner gehoert in den MVP.

Begruendung: Er stuetzt Tutorial, E2E-Tests und fruehe Spielbarkeit, ohne echte Mehrspielerkoordination vorauszusetzen.

## 2026-06-08: Ausserhalb des MVP

Entscheidung: Kommandoschiff, Scans/Energie-Details, Allianzen, koordinierte Angriffs-/Verteidigungsplaene, Handel, Mail-Verifikation, Forum/Macbox und alte Sondermodi bleiben ausserhalb des MVP.

Begruendung: Diese Systeme sind wichtig, wuerden aber den ersten lauffaehigen Stand zu weit verzerren. Die Architektur soll sie vorbereiten, aber nicht vor dem Kernspiel erzwingen.

## 2026-06-08: Phase-1-Ressourcen

Entscheidung: Die MVP-Ressourcen heissen `aluminium`, `steel` und `energy`.

Begruendung: Die alten technischen Namen Light/Heavy Metal waren unintuitiv, weil das Spiel nach aussen Aluminium und Stahl meint. Domain-Code soll die fachlichen Spielbegriffe verwenden.

## 2026-06-08: Phase-1-Distanz und Reisezeit

Entscheidung: Distanzen im 2D-Grid werden als geradlinige Luftlinie berechnet. Fuer Reisezeit-Bands wird die euklidische Distanz auf die naechste ganze Feld-Distanz aufgerundet.

Begruendung: Das Spiel ist unter Wasser und Schiffe koennen geradlinig fahren. Ein Koordinatensystem bleibt wichtig, aber Manhattan-Distanz wuerde kuenstliche rechtwinklige Wege implizieren.

## 2026-06-08: Phase-1-MVP-Regeln

Entscheidung: Die Phase-1-Startannahmen werden bestaetigt: Reisezeit-Bands aus dem GDD-Beispiel, drei Kampfschiffe plus `harvester`, deterministischer Ein-Tick-MVP-Kampf und FIFO-Bauqueue mit Bauzeiten in Ticks.

Begruendung: Diese Regeln halten den MVP klein und testbar. Balancing kann spaeter ueber versionierte Definitionen angepasst werden.

## 2026-06-08: Phase-1-Kampf-Verluste

Entscheidung: Der MVP-Kampf teilt Schaden deterministisch und ohne Teilschaden-Persistenz zu. Beide Seiten verursachen im selben Tick ihren Angriffswert als Schaden; voll zerstoerte Schiffe werden in stabiler Schiffstyp-Reihenfolge als Verluste gezaehlt.

Begruendung: Phase 1 braucht reproduzierbare Kampfberichte ohne Zufall, Rundenlogik oder komplexe Zielprioritaeten. Die Regel ist absichtlich einfach und kann spaeter durch versionierte Kampfdefinitionen fuer EMP, Hack, First Strike oder Zielprioritaeten ersetzt werden.

## Arbeitsmodus nach MVP

Entscheidung: Erst MVP bauen, dann die naechste Detailplanung anhand eines spielbaren Stands schaerfen.

Begruendung: Der aktuelle Plan reicht fuer Architektur und MVP-Schnitt. Zu viel Detailplanung vor dem ersten spielbaren Stand wuerde wahrscheinlich falsche Annahmen zementieren. Nach dem MVP sollen Kampf-Tiefe, Kommandoschiff, Scans/Energie, Allianzen und Sharing anhand realer Bedienung und Tests priorisiert werden.

## 2026-06-08: Phase-2-Persistenz-Defaults

Entscheidung: Fuer Phase 2 werden die vorgeschlagenen Defaults ausserhalb der Auth-Strategie bestaetigt: Registrierung mit Username, E-Mail und Passwort ohne E-Mail-Verifikation im MVP; Passwort-Hashing mit Argon2id; Migrationen mit Drizzle-Kit; relationale Kernbeziehungen plus `jsonb` fuer kleine Domain-Snapshots; Dev-Tick nur ausserhalb von Production oder mit `TICK_ADMIN_TOKEN`; deterministische Station-Startpositionen; API-Integrationstests gegen echte PostgreSQL-Testdatenbank.

Begruendung: Diese Defaults passen zur bestehenden TypeScript/PostgreSQL-Architektur, halten den MVP klein und lassen sich spaeter erweitern, ohne jetzt unnoetige Infrastruktur vorzuziehen.

## 2026-06-08: Phase-2-Auth-Strategie

Entscheidung: Phase 2 nutzt eine eigene HTTP-only Cookie-Session mit opaque Session-ID in der Datenbank. Es gibt keinen JWT-Flow und keinen externen Auth-Provider im MVP.

Begruendung: Fast jede relevante Spielaktion braucht ohnehin Datenbankzugriff; serverseitige Sessions machen Logout, Ablauf und Sperren im MVP direkt kontrollierbar. Die Auth-Grenze bleibt in `apps/api/src/auth` gekapselt, damit spaeter ein Provider angeschlossen werden kann.

## 2026-06-08: Phase-2-Test-Bootstrap

Entscheidung: API-Integrationstests migrieren eine echte PostgreSQL-Testdatenbank ueber die Drizzle-Migration und laufen nur, wenn `TEST_DATABASE_URL` gesetzt ist.

Begruendung: Damit bleibt `pnpm test` ohne lokale Testdatenbank lauffaehig, waehrend CI und lokale Verifikation mit PostgreSQL dieselben transaktionalen API-Flows pruefen koennen.

## 2026-06-08: Phase-3-Web-MVP-Richtung

Entscheidung: Phase 3 baut eine moderne, ruhige und funktionale Web-UI mit Aquata-Unterwasser-Identitaet. Nach Registrierung ist der User direkt eingeloggt. Der Dev-Tick ist in Non-Production als sichtbarer Button erlaubt. Die Game-Shell nutzt eigene Detailseiten fuer Bau, Forschung, Flotten und Berichte; das Dashboard zeigt wie frueher die wichtigsten Informationen als Uebersicht. Kampfberichte duerfen in Phase 3 minimal als Text oder Tabelle dargestellt werden.

Begruendung: Diese Richtung bringt den MVP schnell in einen spielbaren Zustand, ohne Zeit in nostalgische Skin-Arbeit oder komplexe Report-Visualisierung zu investieren. Eigene Detailseiten halten die Workflows klar, waehrend das Dashboard die alte Aquata-Staerke einer schnellen Lageuebersicht aufnimmt.

## 2026-06-08: Phase-4-Spieltieregeln

Entscheidung: Phase 4 fokussiert Kampf v2, Defense und Station-Scans. Flotten koennen beim Start eine Stationierungsdauer erhalten: Angreifer 1 bis 3 Ticks, Verteidiger 1 bis 6 Ticks. Eigene Flotten koennen unterwegs und stationiert fruehzeitig zurueckgerufen werden. Station-Scans liefern vorerst exakte Werte und kosten einen fixen Energy-Betrag. Mehrtick-Kampf wird in Phase 4 aufgenommen. Schiffsnamen, Kosten und Typen werden aus dem alten `ships`-Katalog uebernommen; Spezialeffekte wie EMP/Hack/First Strike werden als Traits beruecksichtigt, aber nicht als vollstaendige Altformel nachgebaut.

Begruendung: Damit bekommt das Spiel direkt mehr Planung und Counterplay, ohne die schwer wartbare historische Kampfmatrix, Kommandoschiff-Boni und Spezialfaelle komplett zu portieren. Stationierungsdauer und Rueckruf geben Angriff und Verteidigung echte taktische Entscheidungen.

## 2026-06-08: Ressourcenanzeige

Entscheidung: Ressourcen werden in UI, Berichten und Kostenlisten immer in der Reihenfolge Aluminium, Stahl, Energie angezeigt. Kostenlisten zeigen nur Ressourcen, die wirklich anfallen; Ressourcen mit Kosten 0 werden nicht ausgeschrieben.

Begruendung: Eine stabile Reihenfolge macht Preise und Bestandsanzeigen schneller vergleichbar. Ausgeblendete Nullkosten reduzieren visuelles Rauschen, besonders in Schiffskatalog und mobilen Ansichten.
