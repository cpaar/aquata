# Phase 4 Plan: Erste Spieltiefe

Stand: 2026-06-08

Ziel von Phase 4 ist, aus dem spielbaren MVP ein strategisch interessanteres Browsergame zu machen, ohne schon die volle alte Aquata-Komplexitaet zu portieren. Der Fokus liegt auf drei Achsen: bessere Kampfentscheidungen, einfache Verteidigung und erste Scans mit Energieeinsatz. Diese Systeme geben Spielern mehr Planung, mehr Information und mehr Counterplay, ohne sofort Kommandoschiff, Allianzen oder Handel mitzuziehen.

## Leitlinien

- Bestehender MVP-Flow bleibt stabil und wird nicht neu geschnitten.
- Spielregeln zuerst im Domain-Core, danach Persistenz/API, danach UI.
- Phase 4 ergaenzt Tiefe, aber keine schwer wartbaren Sonderfaelle aus dem Altcode.
- Neue Regeln bleiben deterministisch und domain-getestet.
- E2E deckt mindestens Angriff, Verteidigung und Scan ab.
- Scans nutzen `energy` als erste echte Systemressource.
- Kampfberichte und Scanberichte sind spielbare Information, nicht nur Debug-Ausgabe.
- Ressourcen werden in UI, Berichten und Kostenlisten immer in derselben Reihenfolge angezeigt: Aluminium, Stahl, Energie.
- Kostenlisten zeigen nur Ressourcen mit Kosten groesser 0; Nullkosten werden nicht ausgeschrieben.

## Phase-4-Ergebnis

Am Ende von Phase 4 soll es moeglich sein:

- Mehr als einen menschlichen Spieler sinnvoll als Ziel oder Verteidiger zu nutzen.
- Eine Flotte nicht nur als Angriff, sondern auch zur Verteidigung einzusetzen.
- Beim Flottenstart festzulegen, wie viele Ticks die Flotte vor Ort stationiert bleibt.
- Angriffsflotten fuer 1 bis 3 Ticks vor Ort zu halten.
- Verteidigungsflotten fuer 1 bis 6 Ticks vor Ort zu halten.
- Flotten auf dem Weg und vor Ort fruehzeitig zurueckzurufen.
- Vor einem Angriff ein Ziel zu scannen und einen Scanbericht zu sehen.
- Energie fuer Scans auszugeben.
- Einen Kampfbericht mit klareren Verlusten, Beteiligten und Beteiligungsrollen zu sehen.
- Einen E2E-Flow zu haben, der Scan -> Angriff -> Verteidigung -> Bericht prueft.

## Vorgeschlagene Reihenfolge

### 1. Phase-3-Abschluss im Hauptplan nachziehen

Deliverables:

- `docs/REMAKE_PLAN.md` Phase 3 als umgesetzt markieren.
- Abschlussnotiz mit Commit `d175279 phase 3` und den wichtigsten Phase-3-Artefakten.

Abnahme:

- Hauptplan und Detailplaene widersprechen sich nicht.

### 2. Domain: Kampf v2 vorbereiten

Deliverables:

- Kampfdefinition versionieren, z.B. `combat-v2-2026-06-08`.
- CombatReport um Rollen und Battle-Teilnehmer erweitern, ohne alte Reports unlesbar zu machen.
- Zielprioritaeten modellieren, mindestens stabile Reihenfolge nach Schiffstyp oder konfigurierbare Prioritaetslisten.
- Mehrtick-Kampf modellieren: Flotten koennen am Ziel fuer mehrere Ticks kaempfen, solange Stationierungsdauer und Schiffe uebrig sind.
- First-Strike-, EMP- und Hack-Hooks als einfache Regelstruktur vorbereiten.
- Domain-Tests fuer Verlustverteilung, Outcome und Berichtsdaten.

MVP-Annahme:

- Noch keine Zufallskomponente.
- Spezialeffekte werden nicht tief wie im Altcode simuliert; Phase 4 braucht tragfaehige Typen/Traits und einfache deterministische Hooks.

Abnahme:

- Bestehender MVP-Kampf bleibt reproduzierbar.
- Neue Kampfberichte enthalten genug Daten fuer UI und spaetere Sharing-/Journal-Systeme.

### 3. Domain: Alter Schiffskatalog als Phase-4-Basis

Quelle:

- Alte Schiffsdaten aus `old/aquata_db.sql`, Tabelle `ships`.
- Deutsche Namen aus `old/php/include_lang_de.php`.

Deliverables:

- Combat-Ship-Katalog von vier MVP-Schiffen auf die alten 12 Kampfschiffe erweitern.
- Namen, alte Klasse, alte Kosten und grobe Typ-Traits uebernehmen.
- Bestehende Ressourcenbegriffe nutzen: `lmcost` wird `aluminium`, `hmcost` wird `steel`; `energy` bleibt fuer Scans/Systeme.
- Kostenrelationen aus dem Altcode erhalten, aber nur so tief skalieren, wie es zur aktuellen MVP-Wirtschaft passt.
- `harvester` als bestehende wirtschaftliche MVP-Einheit erhalten, bis Sammler/Bots separat sauber modelliert werden.
- Domain-Tests fuer Build-Katalog, Kosten und Trait-Zuordnung.

Alter Katalog fuer Phase 4:

| Alt-ID | Name       | Klasse | Alte Kosten LM/HM | Trait       |
| ------ | ---------- | ------ | ----------------- | ----------- |
| 1      | Piranha    | `lt`   | 1.5 / 0           | firstStrike |
| 8      | Qualle     | `lt`   | 0 / 1.5           | emp         |
| 2      | Hai        | `md`   | 2 / 1             | normal      |
| 4      | Hackboot   | `md`   | 2 / 0.75          | hack        |
| 3      | Taifun     | `fr`   | 6.75 / 2          | normal      |
| 5      | Tsunami    | `fr`   | 12 / 4            | normal      |
| 9      | Blizzard   | `fr`   | 2 / 8             | emp         |
| 11     | Hurricane  | `fr`   | 10 / 3            | firstStrike |
| 10     | Bermuda    | `hv`   | 14 / 12           | emp         |
| 12     | Kitty Hawk | `hv`   | 36 / 9            | firstStrike |
| 6      | Enterprise | `hv`   | 24 / 6            | normal      |
| 7      | Atlantis   | `hv`   | 70 / 16           | normal      |

Abnahme:

- Web und API zeigen die alten Schiffsnamen.
- Build/Fleet/Combat koennen mit allen 12 Kampfschiffen umgehen.
- Die alten Spezialtypen existieren als Traits, aber ohne vollstaendige Altformel.

### 4. Domain: Defense-Mission und Stationierung

Deliverables:

- Neue Fleet-Mission `defend`.
- Verteidigungsflotten reisen zu einer Zielstation.
- Angekommene Verteidigungsflotten werden beim Kampf dieser Station als Verteidiger beruecksichtigt.
- Flotten bekommen beim Start `stationTicks`: Angreifer 1 bis 3, Verteidiger 1 bis 6.
- Angekommene Flotten bleiben vor Ort, solange `stationTicksRemaining` groesser 0 ist.
- Ueberlebende stationierte Flotten kehren nach Ablauf der Stationierungsdauer automatisch zurueck.
- Flotten koennen fruehzeitig zurueckgerufen werden, solange sie unterwegs oder stationiert sind.
- Rueckruf setzt die Flotte auf Rueckreise; die Rueckreise nutzt die verbleibende oder neu berechnete Distanz zur Heimat.
- Domain-Tests fuer Angriff gegen Station plus Verteidigungsflotte.

MVP-Annahme:

- Defense ist vorerst bewusst einfach: keine Allianzrechte, keine koordinierten Plaene, keine komplexen Flotten-Slots.
- Rueckruf ist ein expliziter Command, kein Echtzeit-Abbruch ausserhalb des Tickmodells.

Abnahme:

- Ein zweiter Spieler kann eine Station verteidigen und im Kampfbericht als Verteidiger sichtbar sein.
- Stationierte und zurueckgerufene Flotten sind im Snapshot eindeutig unterscheidbar.

### 5. Domain: Scans und Energie

Deliverables:

- Scan-Typ `stationScan` als erste Scan-Art.
- Fixe Scan-Kosten in `energy`.
- ScanReport-Domainmodell mit Ziel, Ticknummer/Erstellzeit und Snapshot-Daten.
- Scan-Ergebnis fuer Phase 4 exakt: Position, Ressourcen, Schiffe und aktive eigene/feindliche sichtbare Zielinformationen, soweit aus dem Snapshot ableitbar.
- Domain-Tests fuer Energiekosten, fehlende Energie und Report-Inhalt.

MVP-Annahme:

- Keine Scanabwehr, keine Reichweiten-/Radarlogik, keine Wahrscheinlichkeiten.

Abnahme:

- Spieler kann Energie fuer einen Scan ausgeben und bekommt einen persistenten Bericht.

### 6. Datenbank und API erweitern

Deliverables:

- Drizzle-Migration fuer Scanberichte und erweiterte Fleet-Stationierung.
- Schema fuer `scan_reports`.
- Fleet-Persistenz erweitert um Mission, Status, Heimatziel, Zielstation, Stationierungsdauer und Rueckrufstatus.
- Commands:
  - `POST /scans`
  - `POST /fleets` erweitert um `mission: "attack" | "defend"` und `stationTicks`
  - `POST /fleets/:id/recall`
- Snapshot/Reports um Scanberichte und Defense-Flotten erweitern.
- Integrationstests fuer:
  - Scan zieht Energie ab und persistiert Bericht.
  - Defense-Fleet wird bei Kampf beruecksichtigt.
  - Kampfbericht enthaelt Defense-Beteiligung.
  - Rueckruf funktioniert unterwegs und stationiert.

Abnahme:

- API kann Phase-4-Flows transaktional ausfuehren.
- Alte Phase-3-Commands bleiben kompatibel.

### 7. Web: Scan- und Defense-UI

Deliverables:

- Scan-Ansicht oder Scan-Sektion in Flotten/Ziel-Detail.
- Scan-Command mit Energiekosten und klarer Fehlerdarstellung.
- Scanberichte als minimal lesbare Text-/Tabellenansicht.
- Flottenansicht erlaubt Mission `Angriff` oder `Verteidigung`.
- Flottenformular enthaelt Stationierungsdauer: Angriff 1 bis 3 Ticks, Verteidigung 1 bis 6 Ticks.
- Flottenliste bietet Rueckruf fuer eigene Flotten, wenn der Status es erlaubt.
- Dashboard zeigt relevante neue Hinweise: Energie, letzte Scanberichte, aktive Defense-/Attack-Flotten.
- Alle Ressourcen- und Kostenanzeigen nutzen die Reihenfolge Aluminium, Stahl, Energie und blenden Nullkosten aus.

Abnahme:

- Spieler kann im Web Ziel scannen, Bericht lesen, Angriff oder Verteidigung starten.
- Mobile-Layout bleibt ohne horizontales Scrollen.

### 8. E2E und Testdaten

Pflichtszenario:

1. Zwei User plus Dummy/aktive Runde erzeugen.
2. User A scannt ein Ziel.
3. Scanbericht erscheint.
4. User B sendet Defense-Fleet mit Stationierungsdauer zur Zielstation.
5. User A sendet Angriff mit Stationierungsdauer.
6. Dev-Ticks bis Ankunft.
7. Kampfbericht zeigt Angriff, Verteidigung und Verluste.
8. Eine eigene Flotte wird zurueckgerufen und wechselt auf Rueckreise.

Abnahme:

- Der bestehende Phase-3-MVP-Flow bleibt gruen.
- Neuer Phase-4-E2E-Flow prueft Scan und Defense im Browser.

## Nicht in Phase 4

- Vollstaendige Alt-Kampfkomplexitaet.
- Vollstaendige alte Zielmatrix, Trefferchancen, Schadensmatrix und Kommandoschiff-Boni.
- Tiefe EMP-/Hackboot-Simulation wie im Altcode.
- Kommandoschiff und Module.
- Allianzen und koordinierte Angriffsplaene.
- Handel.
- Startschutz, weisse Flagge und Inaktivitaetsregeln.
- Rankings/Toplisten.
- Account-Level und rundenuebergreifende Statistiken.
- Produktives Tick-Scheduling.

## Bestaetigte Entscheidungen

Diese Entscheidungen sind fuer Phase 4 gesetzt:

1. Fokus: Kampf v2 + Defense + Station-Scan.
2. Defense: Beim Start wird festgelegt, wie viele Ticks die Flotte vor Ort stationiert bleibt. Maximum 6 Ticks.
3. Angriff: Angreifer koennen 1 bis 3 Ticks vor Ort bleiben.
4. Rueckruf: Eigene Flotten koennen fruehzeitig zurueckgerufen werden, sowohl unterwegs als auch stationiert.
5. Scan: Station-Scans liefern in Phase 4 exakte Werte.
6. Scan-Kosten: Vorerst fixer Energy-Preis pro Scan.
7. Mehrtick-Kampf: Wird in Phase 4 aufgenommen.
8. Schiffskatalog: Schiffsnamen, Kosten und Typen werden aus `old` uebernommen; Spezialeffekte werden nicht zu tief nachgebaut.
9. Ressourcenanzeige: Immer Aluminium, Stahl, Energie; Ressourcen mit Wert 0 werden in Kostenlisten nicht angezeigt.

## Verifikation fuer Phase 4

Nach Domain-Aenderungen:

- `corepack pnpm --filter @aquata/domain test`
- `corepack pnpm --filter @aquata/domain typecheck`

Nach API-/DB-Aenderungen:

- `corepack pnpm --filter @aquata/db typecheck`
- `corepack pnpm --filter @aquata/api test`
- API-Integrationstests mit `TEST_DATABASE_URL`.

Nach Web-Aenderungen:

- `corepack pnpm --filter @aquata/web typecheck`
- `corepack pnpm --filter @aquata/web build`
- `corepack pnpm --filter @aquata/e2e test`

Vor Abschluss:

- `corepack pnpm format:check`
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm test`
- `corepack pnpm build`
- `corepack pnpm e2e`
