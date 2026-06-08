# Aquata Game Design Notes

Stand: 2026-06-08

Primaere Produktquelle bleibt `Aquata - Game Design Document.md`.

Dieses Dokument ist fuer umsetzungsnahe Notizen gedacht, die das grosse GDD fuer Agents schneller nutzbar machen. Es ersetzt das GDD nicht und soll nur konkrete, bestaetigte Designentscheidungen verdichten.

## Aktueller MVP-Fokus

- Tickbasiertes Unterwasser-Browsergame.
- Mobile-first Bedienung.
- 2D-Grid als Kartenmodell.
- 30-Minuten-Tick fuer normale Runden.
- Frueher Spielkern: Station, Ressourcen, Sammler, einfache Schiffe, Forschung, Flottenbewegung und einfacher Kampf.
- Dummy-Gegner fuer Tutorial, Tests und erstes Onboarding.

## Phase-1-Annahmen zur Bestaetigung

- Ressourcen bleiben fuer den MVP `aluminium`, `steel`, `energy`.
- Reisezeit wird im MVP per geradliniger Luftlinie im 2D-Grid und Stufen berechnet.
- Fuer Reisezeit-Bands wird die euklidische Distanz auf die naechste ganze Feld-Distanz aufgerundet.
- Startwerte fuer Reisezeit folgen dem GDD-Beispiel: 1-10 Felder = 4 Ticks, 11-20 = 5, 21-30 = 6, 31+ = 7.
- MVP-Schiffe starten klein: drei Kampfschiffe plus `harvester`.
- MVP-Kampf ist deterministisch und wird in einem Tick aufgeloest.
- Bauqueue ist FIFO und nutzt Bauzeiten in Ticks.
