# Aquata – Spielkonzept

Stand: 25.11.2026 · Zwischenstand aus dem Konzept-Interview mit Chris. Das lebende Dokument liegt als Claude Doc unter https://claude.ai/artifact/YU9B4yxU1pruvKgxadQ8rY; diese Datei ist ein Schnappschuss davon.

## Vision & Zielgruppe

Aquata verbindet drei Dinge: Progression vom Nichts zu großen Flotten, eine Community, in der man sich über das Spiel und Privates austauscht, und Gruppendynamik von der Allianzgründung bis zum Allianzkrieg.

**Zielgruppe:** ab 14 Jahren, nach oben offen.

**Spielrhythmus:**

- Ein paar Mal am Tag kurz reinschauen muss reichen, um gut mitzuhalten. Aktivität wird belohnt, aber nicht erzwungen.
- Mit mehr Zeit: Ziel suchen, sich mit Mitspielern verabreden, Angriff sofort starten oder für später vorbereiten und dann koordiniert auslösen.
- Danach wieder reinschauen und reagieren: Gegenangriff, Verteidigung schickt Hilfe, Scannen.

**Schutz vor Frust:**

- Man soll normal schlafen können. Zwei Stunden offline dürfen nicht die komplette Vernichtung bedeuten.
- Verlieren soll spürbar sein, aber man startet nie wieder komplett bei null.
- Mittel dafür: Müll-Mechanik (ein Teil der Verluste kommt als Müll zurück, daraus lässt sich ein Teil der Flotte wieder aufbauen), Angriffsgrenzen und ähnliche Schutzmechaniken.

**Runden:** 4 bis 6 Monate, damit man sich richtig etwas aufbauen, es genießen und große Schlachten schlagen kann. Späteinsteiger sollen gut ins Spiel finden, aber nicht direkt auf Platz 1 kommen. Eine angefangene Runde dient zum Lernen und Leutekennenlernen, die nächste zum Durchstarten.

## Grundsatzentscheidungen

Diese Punkte hat Chris bereits festgelegt; das Interview baut darauf auf.

- **Plattform:** zuerst Browserspiel, möglichst als PWA installierbar; native App eventuell später.
- **Neubau:** komplett neu entwickelt. Das alte Aquata dient nur als Ideenquelle, Code wird nicht übernommen.
- **Setting:** Unterwasserwelt, komplexes und sehr strategisches Spiel.
- **Runden:** Runden-Resets bleiben, damit das Spiel frisch bleibt.
- **Accounts:** bleiben über Runden hinweg bestehen. Sonst wird vorerst nichts rundenübergreifend mitgenommen, auch keine Achievements.
- **Kampf:** die Kampftiefe ist der Kern des Spiels und bleibt. Unnötig komplizierte Systeme dürfen vereinfacht oder verständlicher gemacht werden.
- **Community:** die große, gut eingebundene Community war die zweite große Stärke und soll wieder zentral sein.

## Zeitmodell

Wirtschaft läuft in Echtzeit, gekämpft wird nur zu festen Kampfticks: jede volle Stunde, rund um die Uhr. So bleiben Angriffsrunden und Koordination erhalten.

**Kampfticks:**

- 1 Kampftick pro Stunde, 24 Stunden am Tag.
- Alle Flotten, die zum selben Tick am selben Ziel sind, kämpfen gemeinsam.
- Ein Angriff dauert mehrere Kampfticks (bisher maximal 3). Nach jedem Tick kann man neu entscheiden: weiterkämpfen, Flotte zurückziehen oder nachschicken.
- Verworfene Alternative: 30-Minuten-Ticks mit z. B. 5 statt 3 Kampfticks, dafür schwächere einzelne Ticks. Erstmal nicht.

**Sichtbarkeit von Angriffen:**

- Das Ziel wird gewarnt, sobald die Flotte in sein Sonar fliegt, spätestens aber 3 Stunden vor Ankunft (Mindestwarnzeit = kürzeste Flugzeit einer Verteidigerflotte, wie im alten Spiel). Fernangriffe werden so erst spät bemerkt.
- Andere Spieler sehen fremde Angriffe nur mit Intel (Scans o. ä.).
- Die eigene Allianz erfährt automatisch davon, aber mit Verzögerung. Ist man online, kann man selbst sofort Bescheid geben.
- Notfalloption für den Angegriffenen: Flotte wegschicken und so retten. Dann hat der Angreifer aber freie Bahn auf die Sammler.

**Allianz-Angriffsplanung:** ein Werkzeug, um Angriffe zu verabreden, vorzubereiten und dann koordiniert zu starten.

**Havoc (Endphase):** Am Ende jeder Runde gibt es eine Chaos-Phase (bisher die letzten 14 Tage, Ticks im Minutentakt). Man probiert Dinge aus und schlägt riesige Schlachten. Rundensieger und Bestenlisten werden **vor** Beginn von Havoc festgehalten, Havoc zählt nicht für die Wertung.

## Wirtschaft & Aufbau

Jeder Spieler hat genau eine Station, die er ausbaut. Rohstoffe kommen von Ressourcen-Nodes auf der Karte, zu denen Sammler pendeln. Dadurch wird die Platzierung der Station zur taktischen Entscheidung.

**Rohstoffe:**

- Alu, Stahl, Plutonium (wie bisher).
- Plutonium ist Treibstoff und lässt sich zusätzlich in Energie umwandeln.
- Energie wird für Scans und Scanabwehr gebraucht. Idee: ein Basis-Intel läuft dauerhaft, mehr Energie erhöht z. B. die Reichweite.

**Ressourcen-Nodes und Sammler:**

- Nodes sind auf der Karte verteilt, jeder Node liefert genau einen Rohstofftyp.
- Sammler pendeln: Hinreise, Abbauen, Rückreise, Entladen. Sie haben Kapazität und Geschwindigkeit.
- Es gibt nur einen Sammlertyp. Der Spieler legt per Prozent fest, wie viele Sammler welchen Rohstoff holen, und kann das jederzeit ändern.
- Weitere Wege gleicht man mit mehr Sammleranteil aus. So häuft man keine Rohstoffe an, die man nicht braucht.

**Wachstum:** Ausbau der Station, mehr Sammler, größere Flotte, Kommandoschiff.

**Freischaltungen:**

- Der Ausbau schaltet nach und nach Schiffe, Antriebe, Scans, Scanabwehr usw. frei und verbessert sie.
- Ob das über Gebäude, Upgrades oder Forschung läuft, ist offen. Hauptsache stimmig und verständlich.
- Jeder kann alles erreichen. Die Strategie liegt in der Reihenfolge, gerade am Anfang.

**Nodes, Platzierung, Sammler:**

- Nodes sind unbegrenzt und von mehreren Spielern teilbar.
- Sammler sind unterwegs nicht angreifbar. Wer erfolgreich eine Station angreift, erbeutet dort einen Teil der Sammler (wie bisher).
- Startplatz ist in einer Region frei wählbar. Ein späterer Umzug ist möglich, aber teuer.

**Aufholweg für Späteinsteiger:**

- Bauzeiten und Kosten sinken mit dem Rundenfortschritt.
- Anfängerschutz, solange man klein ist.
- Angriffsgrenzen nach Punkteabstand, damit Große nicht auf Kleine gehen.

Offen: konkrete Bauzeiten und Kosten.

## Flotten & Kampf

Die taktische Tiefe des alten Kampfsystems bleibt. Verständlicher wird es vor allem durch Struktur und Darstellung, nicht durch weniger Optionen.

**Schiffsraster (Vorschlag):**

- Mehrere Größenklassen (z. B. Jäger, Kreuzer, Schlachter, Schwere), pro Klasse bis zu drei Varianten: Normal, EMP, Erstschlag.
- Jede Klasse hat bevorzugte Ziele. Jede Variante folgt einer klaren Regel: EMP lähmt, Erstschlag schießt zuerst, Normal hat den meisten Schaden.
- Kampfphasen wie bisher: EMP, dann Erstschlag, dann normaler Kampf.
- Treffer- und Schadenstabellen bleiben als Feinabstimmung im Hintergrund. Spieler sehen sie als "stark gegen / schwach gegen" mit Symbolen, die genauen Werte sind einsehbar.

**Altes Schiffsraster (Analyse):**

| Klasse | Normal | EMP | Erstschlag | Spezial |
| --- | --- | --- | --- | --- |
| Klein (Jäger) | Piranha: eine Kanone, stark gegen Kleine und Mittlere, schießt vor allen anderen | Qualle: lähmt v. a. kleine Schiffe | (Piranha übernimmt das) | – |
| Mittel (Korvette) | Hai: Schutz der eigenen Hackboote, jägt fremde, gut gegen Fregatten | – | – | Hackboot: kann als einziges Schiff Sammler stehlen, kämpft nicht |
| Fregatte | Taifun: Allrounder, zielt zuerst auf Jäger und Korvetten | Blizzard: lähmt alle Klassen | Hurricane: wie Taifun, schießt vor den anderen | Tsunami: schwerer Brecher mit den stärksten Kanonen, gegen die Größten |
| Schwer | Enterprise: Schlachtschiff, auf Fregatten spezialisiert | Bermuda: lähmt sogar die Atlantis | Kitty Hawk: wie Enterprise, schießt vor den anderen | Atlantis: 105 Kanonen, riesiges Schild, größtes Zerstörungspotenzial |

Dazu gab es pro Schiff eine Trefferchance und einen Schadensfaktor gegen jedes der 12 Schiffe sowie eine feste Zielreihenfolge. Versteckte Sonderregel: Tsunami, Enterprise, Atlantis, Bermuda und Kitty Hawk hatten dreifache HP, nahmen aber doppelten Schaden. Solche Regeln müssen im neuen Spiel sichtbar sein.

**Entschieden (Detailrunde Schiffe):**

- Das alte Raster (4 Klassen, Varianten Normal, EMP, Erstschlag, Spezial) ist das Gerüst. Es wird neu gebalanct, Lücken bleiben bewusst bestehen.
- Feste Zielreihenfolge pro Schiff. Die ersten Ziele sind direkt sichtbar, die volle Liste steht in den Details.
- Namen: Meerestiere, die auf Deutsch und Englisch funktionieren (siehe Tabelle).

**Schiffsnamen (Stand 25.11.2026):**

| Klasse | Normal | EMP | Erstschlag | Spezial |
| --- | --- | --- | --- | --- |
| Klein | Piranha (früher Piranha) | Squid (früher Qualle) | (Piranha) | – |
| Mittel | Mako (früher Hai) | – | – | Oktopus / EN Octopus, stiehlt Sammler (früher Hackboot) |
| Fregatte | Barracuda (früher Taifun) | Manta (früher Blizzard) | Marlin (früher Hurricane) | Narwal / EN Narwhal, Brecher (früher Tsunami) |
| Schwer | Orca (früher Enterprise) | Volta (früher Bermuda) | Kraken (früher Kitty Hawk) | Leviathan, Titan (früher Atlantis) |

**Verständlichkeit:**

- Kampfberichte zeigen Phase für Phase, was passiert ist und warum.
- Kampfsimulator im Spiel: Man spielt Angriffe mit Werten aus Intel durch, allein oder im Team, und lernt so, was funktioniert, ohne echte Verluste.

**Station:** keine stationäre Verteidigung. Verteidigt wird nur mit Flotten, eigenen und verbündeten.

**Beute reist mit der Flotte:** Erbeutete Sammler, Rohstoffe und Müll werden nicht mehr nach Hause teleportiert, sondern von der Flotte heimtransportiert. Wird die Flotte vernichtet, fliegt eine fast leere Flotte mit dem Müll der eigenen Verluste heim. Auch ein zerstörtes KS muss erst nach Hause gebracht werden. Wichtig: Das muss im Spiel klar sichtbar sein (Flottenübersicht, Kampfbericht, Rückflugstatus).

- Rückkehrende Flotten können unterwegs nicht abgefangen werden. Man kann aber den Heimatort so angreifen, dass man im selben Tick ankommt wie die Rückkehrer. Dann kann der Spieler sie nicht mehr in Sicherheit bringen.
- Sammler-Beute ist begrenzt: Jedes Hackboot kann insgesamt einen Sammler erbeuten, nicht mehr einen pro Tick. 100 Hackboote holen also höchstens 100 Sammler pro Angriff, die dann erst heimgebracht werden müssen.
- Rohstoff-Beute ist nicht begrenzt. Plutonium hat die Flotte ohnehin als Treibstoff dabei.

**Balancing-Grundregeln:**

- Ein Kampf erzeugt nie Rohstoffe. Angreifer und Verteidiger zusammen haben nach einem Kampf, inklusive Müll und Beute, immer weniger Rohstoffwert als vorher. Das gilt auch mit allen Müll-Boni.
- Flottenbeschleunigung ist schnell zu stark. Wenn es sie gibt, dann begrenzt, z. B. nur eine Flotte oder nur auf dem Rückflug. Details später.

**Angriffsgrenzen und Schutz (altes System, Analyse):**

| Punkte des Ziels im Vergleich zu meinen | Regel |
| --- | --- |
| unter 30 % | nicht angreifbar |
| 30 bis 40 % | nur mit einer Flotte bis 100 % der eigenen Punkte |
| 40 bis 50 % | nur mit einer Flotte, die höchstens 50 % mehr Punkte hat als das Ziel |
| ab 50 % | frei angreifbar |

- **Weiße Flagge:** Verlor ein Spieler stark an Punkten, hisste das System automatisch die weiße Flagge. Angriffe auf ihn wurden öffentlich und einen Tick langsamer.
- **Inaktivenschutz:** Wer 16 Tage nicht online war, kam für 8 Tage unter Angriffsschutz.
- In Havoc waren die Schutzregeln teilweise aufgehoben.

**Angriffsgrenzen und Schutz (entschieden):**

- Die alten Punktgrenzen (30 %, 40 %, 50 %) sind die Ausgangsbasis und werden neu gebalanct.
- Anfängerschutz in den ersten 5 bis 7 Tagen oder bis zu einer Punktgrenze, je nachdem, was zuerst eintritt. Wer selbst angreift, verliert den Schutz sofort.
- Die Weiße Flagge bleibt. Ein Angriff auf einen Spieler mit weißer Flagge wird spielweit öffentlich: Alle sehen die Angriffsflotte auf der Karte, aber nur mit wenigen Details. Wer mehr wissen will, muss scannen.
- Offen: zusätzliche Pause nach einem verlorenen Kampf.

## Kommandoschiff (KS)

Das KS ist das zentrale Element, das man über die Runde entwickelt, ähnlich einem Haupthelden. Jeder Spieler hat genau eins. Fliegt es mit, beeinflusst es den Kampf spürbar. Chris ist offen dafür, es komplett neu zu denken, wenn es dem Spiel hilft.

**Bisher:**

- Das KS sammelt Erfahrung in Kämpfen und steigt im Level.
- Je nach Typ hat es einen Fokus: selbst kämpfen, Werte der Flotte stärken (HP, Trefferchance, Schaden, EMP-Widerstand, Ausweichen) oder Wirtschaft und Intel (Produktion, Scans, Müll).
- Ab einem bestimmten Level gibt es Skillpunkte zum Spezialisieren. Man kann einen schwächeren Allrounder oder einen hochspezialisierten Typ bauen.
- Spezialisten ergänzen sich in der Allianz, haben allein aber Schwächen.

**Anforderungen:**

- Wichtig und tief genug, um über Monate interessant zu bleiben.
- Boni müssen spürbar sein, keine bedeutungslosen Prozentzahlen.
- Zusammenspiel mehrerer KS in der Allianz soll belohnt werden.

**Sterben (bisheriges System, bewährt):**

- Das KS kann nur außerhalb sterben, also bei Angriffen oder Verteidigung unterwegs, nie bei der Verteidigung der eigenen Station.
- Tot heißt: einige Stunden weg, danach gegen Rohstoffe wiederbelebbar.
- Jeder weitere Tod verlängert Ausfallzeit und Kosten (bisher Ausfall = (Tode + 1)² / 2 Ticks, Kosten = Restzeit × (Tode + 1) × Level × 5.000 Alu und Stahl). Das verhindert Selbstmordmissionen mit Glaskanonen.
- Bei einem Kampf, in dem das KS stirbt, gibt es keine Erfahrung.

**Analyse des alten KS:**

| Element | Bisher | Bewertung |
| --- | --- | --- |
| Grundtyp | Kampf, Zivil, Support; Wechsel kostet 33 % der Erfahrung (einmal gratis) | Gut: klare Identität, Wechsel mit echtem Preis |
| Waffenmodus | Normal, EMP oder Hack (Hack übernimmt gegnerische Schiffe) | Sehr gut, besonders Hack ist einzigartig |
| Zielprioritäten | Eigene Zielreihenfolge je Waffenmodus, mehrere Presets | Gut für Profis, braucht bessere Oberfläche |
| Primärpunkte | Kanonen, Feuerkraft, Trefferchance | Gut, aber drei Werte für fast dasselbe |
| Sekundärpunkte | Flottenboni: HP, Schaden, Treffer, Ausweichen | Gut, das ist der Kern des Supports |
| Tertiärpunkte | Drei Bündel: Offensiv (Erfahrung, Rohstoffraub, Kostensenkung, Tarnung), Defensiv (Erfahrung, Müll, Rohstoffschutz), Industrie (Training, Produktion, Detektion) | Resterampe: unzusammenhängende Werte, winzige Prozente (z. B. 0,02 % Produktion je Punkt) |
| Auren | Detektion, Tarnung, Produktion wirken auch auf Nachbarn am selben Ort | Gute Idee für Allianz-Synergie |
| Training | Zeitbasiertes Training gibt Prozente und etwas Erfahrung | Gut als Weg für Nicht-Kämpfer, aber unsichtbar |
| Level | Bis 500+, Punkte in Stufen (bis 30, 60, 200, 500) | Zu lang und zu unübersichtlich |
| Achievements, Skilltree | Universalpunkte und Boni aus Achievements | Entfällt (keine rundenübergreifenden Vorteile) |

**Vorschlag für das neue KS (zur Diskussion):**

1. **Rolle** zu Rundenbeginn wählen, z. B. Flaggschiff (kämpft selbst), Kommandeur (stärkt die Flotte), Späher, Logistiker. Wechsel kostet Erfahrung.
2. **Späher und Logistiker müssen im Kampf gefragt sein,** nicht nur Wirtschaftsboni liefern. Ideen: Der Späher zeigt der eigenen Seite vor jedem Kampftick die gegnerische Aufstellung, schwächt die gegnerische Erstschlagphase oder tarnt verbündete Flotten beim Anflug. Der Logistiker repariert zwischen zwei Kampfticks einen Teil der Verluste, erhöht den Müll für alle Beteiligten oder beschleunigt Flotten.
3. **Kein festes Level-Cap:** Erfahrung wird mit steigendem Level teurer (weiche Kurve). Frühe Level kommen schnell, späte bleiben bis in die Endphase erreichbar.
4. **Talentbaum pro Rolle** mit wenigen, großen Entscheidungen statt vieler Kleinstpunkte. Beispiel: "Erstschlag-Doktrin: deine Kreuzer schießen in der Erstschlagphase mit".
5. **Modul-Slots:** Ausrüstung, die man an der Station tauscht. Freigeschaltet teils durch Stationsausbau oder Forschung, teils durch KS-Level. Es gibt Kampfmodule für Einsätze (Waffenmodus Normal, EMP, Hack, Scanner, Tarnfeld) und Heimatmodule, die die eigene Station stärken. So lohnt es sich, zu Hause anders ausgerüstet zu sein als unterwegs.
6. **Allianz-Synergie:** Boni verschiedener Rollen im selben Kampf ergänzen sich, gleiche Rollen stapeln schwächer.
7. **Sterben** wie bisher (siehe oben).

**Entschieden (Detailrunde KS):**

- Das KS ist ein einzelnes großes Schiff mit eigenen Werten, die mit dem Level wachsen. Ein voll ausgebautes Flaggschiff entspricht etwa 5 bis 10 % einer typischen Flotte, die anderen Rollen kämpfen kaum selbst.
- Start mit vier Rollen: Flaggschiff, Kommandeur, Späher, Logistiker. Anpassung, falls eine Rolle fehlt oder zu schwach ist.
- Waffentypen (Normal, EMP, Hack) sind Module, nutzbar für jede Rolle.
- Erfahrung gibt es nur aus Kämpfen, Anwesenheit reicht (wie bisher).

**Altes Training (Analyse):** Man startete ein 6-Stunden-Training in einem von drei Bereichen (Kampf, Support, Zivil). Danach gab es +95 Erfahrung und +5,85 % auf alle Werte dieses Bereichs. Jeden Tick schmolz der Bonus wieder ab, und zwar umso stärker, je höher er war (Verlust = 0,0006 × Bonus² pro Tick). Bei durchgehendem Training pendelte sich das bei etwa 35 bis 45 % ein. Vorteil: Es holte Spieler regelmäßig ins Spiel, und der Bonus musste gepflegt werden. Nachteile: striktes 6-Stunden-Timing, Klick-Bots (im Code als "Trainbot" erkannt), und die Erfahrung daraus war nur in den ersten Tagen relevant.

**Neues Training (Richtung):**

- Einmal am Tag gibt es Trainingspunkte zum Abholen, bis zu 3 Tage werden gesammelt.
- Trainingspunkte verbessern nach und nach Module. Kein Abbau, keine Erfahrung aus Training.

**Module und Talente (entschieden):**

- Start mit 1 Waffenslot (Normal, EMP oder Hack) und 1 Systemslot (z. B. Scanner, Tarnfeld, Reparaturdrohnen, Panzerung). Mit dem Level kommen bis zu 2 weitere Systemslots dazu.
- Umrüsten nur an der eigenen Station, aber ohne Umrüstzeit.
- Talentbaum pro Rolle: etwa 3 Äste mit je 5 Stufen, auf einigen Stufen eine Wahl zwischen zwei Talenten. Zurücksetzen kostet Erfahrung. Größe hängt davon ab, ob wir genug gute Ideen finden.

**Ideen aus den alten Fertigkeiten für die Talentbäume:**

| Rolle | Alte Fertigkeit | Idee als Talent |
| --- | --- | --- |
| Flaggschiff | Fusion: je 3 KS mit dem Skill legen ihre Kampfwerte zusammen | Verbandsfeuer: mehrere Flaggschiffe im selben Kampf verstärken sich |
| Flaggschiff | Spezialisierung auf einen Schiffstyp (mehr HP, Schaden, Treffer) | Staffelführer: ein gewählter Schiffstyp der eigenen Flotte wird stärker |
| Kommandeur | Haltung wählen: Flotte vor dem Kampf offensiv oder defensiv ausrichten | Gefechtshaltung, vermutlich ein Kerntalent der Rolle |
| Kommandeur | Weniger Verluste: kampfunfähige Schiffe werden gerettet | Bergungsprotokoll |
| Kommandeur | Gegnerischer Erstschlag wird verzögert | Erstschlag-Abwehr |
| Kommandeur | Unterstützungsbonus, wenn 3 KS anwesend sind | Stabsarbeit: Bonus, wenn mehrere Rollen anwesend sind |
| Kommandeur | Geländekunde: mehr Schild, weniger Schaden | Heimvorteil bei Verteidigung |
| Späher | Angriffsmelder: Angriff bis zu 1 Stunde früher erkennen | Frühwarnung, auch für die Allianz |
| Späher | Irreführende Scans, versteckte Schiffe, KS verschleiern, KS-Werte unterschätzen | Täuschung: gegnerische Scans zeigen falsche oder unvollständige Werte |
| Späher | Täuschungen erkennen, Scans komplett blocken, erfolgreiche fremde Scans bemerken | Gegenaufklärung |
| Logistiker | Mehr Müll für verlorene und abgeschossene Schiffe | Bergungsflotte (innerhalb der Regel "kein Kampf erzeugt Rohstoffe") |
| Logistiker | Rückflug einen Tick schneller | Heimkehrroute (passt zur Idee "Beschleunigung nur auf dem Rückflug") |
| Logistiker | Halbfertige Schiffe aus der gegnerischen Fabrik stehlen | Sabotage |
| Logistiker | Ressourcenbunker, Schutz vor Sammlerklau | Heimatmodule oder defensive Talente |

Verworfen als Resterampe: Gratis-Schiffe ("Flotte sofort aufstocken"), weniger Punkte vortäuschen, Kostenrabatte für einzelne Schiffstypen, Bonusrohstoffe von "korrupten Beamten", detaillierte Kampfberichte als Skill (die bekommen jetzt alle).

## Intel

Intel bringt viel taktische Tiefe und soll eine eigene Spezialisierung ermöglichen: Spieler können sich auf Aufklärung konzentrieren und ihre Allianz mit Informationen versorgen. Gleichzeitig darf es nicht zu 100 Scanvarianten werden.

**Altes System (Analyse):**

| Scan | Zeigte | Genutzt für |
| --- | --- | --- |
| Basisscan | Rohstoffe, Sammler, Schiffe grob nach Klassen | Frühe Phase, Rohstoffraub |
| Flottenscan | Flotten des Ziels mit Zusammensetzung und KS | Angriff und Verteidigung, sehr wichtig |
| Newsscan | Ereignisse des Ziels der letzten 24 h: Flottenbewegungen, Rückrufe, Kämpfe | Angriff und Verteidigung, sehr wichtig |
| KS-Scan | Alle Werte und Einstellungen des gegnerischen KS | Angriff und Verteidigung, sehr wichtig |
| Fabrikscan | Technologiestand und Schiffe in Bau | Schiffsrohlinge stehlen, große Bauaufträge vor dem eigenen Angriff erkennen |

- Scans kosteten Scan-Energie. Die hatte einen Speicher und wurde über Energiepakete aufgefüllt, die man aus Plutonium baute.
- Scanstärke = eigene Verhüller gegen Detektoren des Ziels. Je schlechter das Verhältnis, desto ungenauer der Scan: Zahlen kamen als Spanne, z. B. "1.200 bis 1.450".
- Newsscans (und mit Skill alle Scans) konnten geblockt werden. Die Chance hing vom selben Verhältnis ab. Bei einem Fehlschlag erfuhr das Ziel davon, und der Scanner verlor einen Verhüller und einen Teil der Kosten.
- Mit Skill bemerkte das Ziel auch erfolgreiche Scans. Ein anderer Skill ließ fremde Scans völlig falsche Zahlen zeigen.

**Vorschlag neu:**

1. **Energie:** Ein Reaktor wandelt Plutonium laufend in Energie um, ein Energiespeicher begrenzt den Vorrat. Beides wird ausgebaut.
2. **Sonar (dauerhaftes Basis-Intel, entschieden):** Flächenscans sind Sonar. Es deckt die Karte rund um die eigene Station auf und kostet laufend Energie. Reichweite und Detailstufe wachsen mit Ausbau, Forschung und KS. Detailstufen etwa: Karte und Nodes, dann Stationen, dann Flottenbewegungen, dann grobe Flottengröße. Fremde Flotten werden sichtbar, sobald sie in Sonar-Reichweite kommen. Wer von weit weg angreift, wird also später gesehen, zahlt dafür aber mit der Reisezeit.
3. **Gezielter Scan (entschieden):** braucht die Koordinaten der Zielstation, ist aber nicht an die Sonar-Reichweite gebunden. Vorschlag: ein Scan mit wählbaren Bereichen (Station, Flotten, Ereignisse, KS, Werft). Die Kosten richten sich nach den gewählten Bereichen, dazu Vorlagen wie "Angriffscheck" (Flotten, Ereignisse, KS). Flotten zeigt nur die Flotten dieses Spielers, Ereignisse zeigt, was beim Spieler los ist.
4. **Beobachtung:** Einen Spieler für X Stunden beobachten. Bei Bewegungen wird man benachrichtigt, wahlweise auch die Allianz. Kostet laufend Energie.
5. **Scan gegen Abwehr:** Scanstärke gegen Scanabwehr bestimmt Genauigkeit (Zahlenspannen) und Fehlschlagchance. Fehlgeschlagene Scans sieht das Ziel immer.
6. **Geteilte Scans** landen automatisch bei der Allianz.

**Warnung vor Angriffen (entschieden):**

- Die Warnung kommt, wenn die angreifende Flotte in das Sonar des Ziels fliegt.
- Mindestwarnzeit: spätestens 3 Stunden vor Ankunft, damit Verteidiger immer noch Hilfe schicken können.
- Das Sonar der Allianz zählt mit: Fliegt die Flotte durch das Sonar eines Verbündeten, sieht er sie, und die Allianz bekommt eine Meldung. Die Allianz ist ein Netz aus vielen Sonaren.

## Allianzen & Community

Die Allianz ist das Informations- und Koordinationszentrum. Zusammenspielen geht auch ohne Allianz, aber die Allianz muss echte Vorteile bieten. Die Community lebte vom Chat: Dort entstanden Freundschaften, dort wurden Kämpfe abgestimmt.

**Allianz (bisher und weiter wichtig):**

- Geteilte Scans aller Mitglieder.
- Benachrichtigung der Allianz über eingehende und zurückkehrende Flotten.
- Eigener Allianzchat.
- Größenlimit als Balancing, damit bei 200 Spielern nicht nur 2 Allianzen existieren. Startwert etwa 10 bis 15 Spieler, im Spiel einstellbar, weil die Spielerzahl anfangs klein ist und später wächst.
- Ränge und Ämter nur als Berechtigungen, nicht zentral.
- Vorerst nicht: Bündnisse und Kriegserklärungen zwischen Allianzen.

**Analyse der alten Siedlungen:**

Siedlungen waren eine zweite Gruppenebene neben der Allianz: kleine Nachbarschaften (zuletzt bis zu 4 Stationen, 24 Siedlungen pro Ozean). Die neue Karte wird ein 2D-Raster, Siedlungen entfallen. Diese Funktionen gab es:

| Funktion | Bisher | Entscheidung |
| --- | --- | --- |
| Ämter per Wahl | Kommandant, General, Kommunikations- und Finanzminister, gewählt von den Bewohnern | Nur als Allianz-Berechtigungen, ohne Wahlsystem |
| General verfügt über Flotten | Der General durfte Flotten anderer Mitglieder einsetzen | Offen: Flottenfreigabe an einen Angriffsleiter |
| Siedlungskasse | 5 % des Einkommens flossen in ein Depot, der Finanzminister verteilte es | Entfällt |
| Siedlungsforum, Nachrichten an alle | Eigenes Forum und Rundmail der Siedlung | Geht in Allianzchat und Allianzforum auf |
| Siedlungsweite Boni | KS-Auren wirkten auf Nachbarn; Scans der Siedlung wurden gebündelt | Offen: Auren für andere evtl. nur noch im Kampf, außerhalb ganz weg |
| Nachbarschaft | Flüge in nahe Siedlungen waren schneller und billiger | Ergibt sich im Raster über die Entfernung |
| Rauswurf per Abstimmung | Mehrheit konnte eine Station verschieben | Entfällt |
| Most Wanted, Kopfgeld | Meistgesuchte Siedlung markiert, Scans geteilt | Entfällt vorerst, ebenso Kopfgeld |
| Kampfpunkte | Eigene Wertung für Kämpfe | Entfällt, außer wir brauchen sie für etwas |
| Neulingsozean | Geschützter Startbereich mit Ausbilder | Entfällt, ersetzt durch Anfängerschutz |
| Bestenliste | Top 10 der Siedlungen | Allianz-Bestenliste |

**Kommunikation (Vorschlag):**

- Alles Wichtige im Spiel, wie früher: globaler Chat, Allianzchat, Direktnachrichten, ein schlichtes Forum, Hilfe und Wiki.
- Als PWA mit Push-Benachrichtigungen aufs Handy (z. B. "du wirst angegriffen", Nachricht von der Allianz).
- Discord nur optional, z. B. Allianz-Benachrichtigungen per Webhook. Die Community soll sich im Spiel treffen.

**Events:** Havoc war immer ein echtes Event, für das sich Leute verabredet haben und nachts wach geblieben sind. Das soll bewusst gefördert werden.

## Offene Fragen & nächste Themen

Erste Interviewrunde und Detailrunden zu Kommandoschiff, Schiffsraster, Intel und Angriffsgrenzen sind abgeschlossen (Stand 25.11.2026). Offen sind noch:

- [x] Kommandoschiff: Rollen, Module, Training, Talent-Ideen (grob)
- [x] Schiffsraster: Struktur, Zielreihenfolge, Namen
- [x] Intel: Energie, Sonar, gezielte Scans, Warnregeln
- [x] Angriffsgrenzen und Anfängerschutz (Grundregeln)
- [ ] Stationsausbau: Gebäude oder Forschung, Freischaltreihenfolge, Bauzeiten und Kosten
- [ ] Müll-Mechanik: Anteil der Verluste, Wiederaufbau, Regel "kein Kampf erzeugt Rohstoffe"
- [ ] Karte: Größe des 2D-Rasters, Verteilung der Nodes, Startregionen, Reisezeiten
- [ ] Angriffsplanung: wie das Werkzeug genau aussieht
- [ ] Rangliste: wonach wird gewertet, wer ist Rundensieger
- [ ] Havoc: Dauer, Ticktakt, Sonderregeln
- [ ] Allianz: Flottenfreigabe an einen Angriffsleiter? Auren nur im Kampf oder ganz weg?
- [ ] Pause nach einem verlorenen Kampf
- [ ] Flottenbeschleunigung: ob und wie begrenzt
- [ ] Talentbäume und Modulliste im Detail
