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

## Phase-4-Ergebnis

Am Ende von Phase 4 soll es moeglich sein:

- Mehr als einen menschlichen Spieler sinnvoll als Ziel oder Verteidiger zu nutzen.
- Eine Flotte nicht nur als Angriff, sondern auch zur Verteidigung einzusetzen.
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
- Optionaler First-Strike-Hook als Regelstruktur, auch wenn erst ein Schiff ihn nutzt.
- Domain-Tests fuer Verlustverteilung, Outcome und Berichtsdaten.

MVP-Annahme:

- Noch kein Mehrtick-Kampf.
- Noch keine Zufallskomponente.
- EMP/Hackboot werden erst eingefuehrt, wenn die Schiffsliste erweitert wird.

Abnahme:

- Bestehender MVP-Kampf bleibt reproduzierbar.
- Neue Kampfberichte enthalten genug Daten fuer UI und spaetere Sharing-/Journal-Systeme.

### 3. Domain: Defense-Mission

Deliverables:

- Neue Fleet-Mission `defend`.
- Verteidigungsflotten reisen zu einer Zielstation.
- Angekommene Verteidigungsflotten werden beim Kampf dieser Station als Verteidiger beruecksichtigt.
- Ueberlebende Verteidiger bleiben in einer klar definierten Phase-4-Form erhalten.
- Domain-Tests fuer Angriff gegen Station plus Verteidigungsflotte.

MVP-Annahme:

- Defense ist vorerst bewusst einfach: keine Allianzrechte, keine koordinierten Plaene, keine komplexen Flotten-Slots.

Abnahme:

- Ein zweiter Spieler kann eine Station verteidigen und im Kampfbericht als Verteidiger sichtbar sein.

### 4. Domain: Scans und Energie

Deliverables:

- Scan-Typ `stationScan` als erste Scan-Art.
- Scan-Kosten in `energy`.
- ScanReport-Domainmodell mit Ziel, Ticknummer/Erstellzeit und Snapshot-Daten.
- Scan-Ergebnis fuer Phase 4 minimal: Position, Ressourcen, Schiffe und aktive eigene/feindliche sichtbare Zielinformationen, soweit aus dem Snapshot ableitbar.
- Domain-Tests fuer Energiekosten, fehlende Energie und Report-Inhalt.

MVP-Annahme:

- Scan ist deterministisch und liefert vorerst exakte Daten.
- Keine Scanabwehr, keine Reichweiten-/Radarlogik, keine Wahrscheinlichkeiten.

Abnahme:

- Spieler kann Energie fuer einen Scan ausgeben und bekommt einen persistenten Bericht.

### 5. Datenbank und API erweitern

Deliverables:

- Drizzle-Migration fuer Scanberichte und ggf. Defense-Fleet-Status.
- Schema fuer `scan_reports`.
- Commands:
  - `POST /scans`
  - `POST /fleets` erweitert um `mission: "attack" | "defend"` oder separater Defense-Endpunkt.
- Snapshot/Reports um Scanberichte und Defense-Flotten erweitern.
- Integrationstests fuer:
  - Scan zieht Energie ab und persistiert Bericht.
  - Defense-Fleet wird bei Kampf beruecksichtigt.
  - Kampfbericht enthaelt Defense-Beteiligung.

Abnahme:

- API kann Phase-4-Flows transaktional ausfuehren.
- Alte Phase-3-Commands bleiben kompatibel.

### 6. Web: Scan- und Defense-UI

Deliverables:

- Scan-Ansicht oder Scan-Sektion in Flotten/Ziel-Detail.
- Scan-Command mit Energiekosten und klarer Fehlerdarstellung.
- Scanberichte als minimal lesbare Text-/Tabellenansicht.
- Flottenansicht erlaubt Mission `Angriff` oder `Verteidigung`.
- Dashboard zeigt relevante neue Hinweise: Energie, letzte Scanberichte, aktive Defense-/Attack-Flotten.

Abnahme:

- Spieler kann im Web Ziel scannen, Bericht lesen, Angriff oder Verteidigung starten.
- Mobile-Layout bleibt ohne horizontales Scrollen.

### 7. E2E und Testdaten

Pflichtszenario:

1. Zwei User plus Dummy/aktive Runde erzeugen.
2. User A scannt ein Ziel.
3. Scanbericht erscheint.
4. User B sendet Defense-Fleet zur Zielstation oder Testfixture stellt Defense bereit.
5. User A sendet Angriff.
6. Dev-Ticks bis Ankunft.
7. Kampfbericht zeigt Angriff, Verteidigung und Verluste.

Abnahme:

- Der bestehende Phase-3-MVP-Flow bleibt gruen.
- Neuer Phase-4-E2E-Flow prueft Scan und Defense im Browser.

## Nicht in Phase 4

- Vollstaendige Alt-Kampfkomplexitaet.
- Mehrtick-Kampf, falls nicht ausdruecklich beschlossen.
- EMP/Hackboot als fertige Spezialschiffe.
- Kommandoschiff und Module.
- Allianzen und koordinierte Angriffsplaene.
- Handel.
- Startschutz, weisse Flagge und Inaktivitaetsregeln.
- Rankings/Toplisten.
- Account-Level und rundenuebergreifende Statistiken.
- Produktives Tick-Scheduling.

## Offene Entscheidungen

Diese Entscheidungen sollte Chris vor der Umsetzung bestaetigen:

1. Phase-4-Fokus: Kampf v2 + Defense + Station-Scan als erste Spieltiefe-Iteration?
2. Defense-Verhalten: Sollen Verteidigungsflotten nach Ankunft bei der Zielstation stationiert bleiben, bis sie kaempfen oder manuell zurueckgerufen werden?
3. Scan-Genauigkeit: Soll der erste Station-Scan exakte Werte liefern, oder lieber grobe/gestufte Werte?
4. Scan-Kosten: Reicht ein fixer Energy-Preis pro Scan fuer Phase 4?
5. Mehrtick-Kampf: Weiter bewusst aus Phase 4 heraushalten?
6. Spezialschiffe: EMP/Hack/First Strike nur als vorbereitete Regelstruktur, aber noch nicht als neue spielbare Schiffe?

Empfehlung:

- Ja zu Kampf v2 + Defense + Station-Scan.
- Defense-Flotten bei Zielstation stationieren und spaeter manuell rueckrufbar machen; wenn Rueckruf zu gross wird, Phase 4 mit automatischer Rueckkehr nach dem ersten Kampf vereinfachen.
- Station-Scan in Phase 4 exakt halten, damit Domain/API/UI/E2E einfach und klar bleiben.
- Fixer Energy-Preis pro Scan.
- Kein Mehrtick-Kampf in Phase 4.
- Spezialschiffe nur vorbereiten, aber noch nicht voll spielbar machen.

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
