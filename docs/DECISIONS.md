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
