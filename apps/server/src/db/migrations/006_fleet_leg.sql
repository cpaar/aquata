-- Aktueller Flugabschnitt einer Flotte (für die Karte): von, nach, Start- und Ankunftstick. Am Ziel: null.
alter table fleets add column leg jsonb;
