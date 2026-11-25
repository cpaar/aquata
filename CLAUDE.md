# Aquata

## Server-Regeln

Dieses Repo liegt auf dem Root-Server nodedev.de. Dort laufen andere produktive Dienste
(nginx, Docker/Dokku-Apps samt Datenbanken, darunter die produktive Aquata-App und aquata-db,
sowie ein Minecraft-Server). Diese dürfen nicht beeinträchtigt werden.

- Nur innerhalb dieses Repos (~/aquata und seiner Worktrees) arbeiten. Keine Dateien außerhalb ändern.
- Dev-Server nur auf den vereinbarten Ports 3101, 3102 und 3103 starten, und nur auf 127.0.0.1
  binden (der Server hat keine Firewall; 0.0.0.0 wäre öffentlich erreichbar).
  Zugriff von außen per SSH-Tunnel, z. B. `ssh -L 3101:localhost:3101 claude@nodedev.de`.
- Keine systemweiten Installationen (kein apt, kein sudo, keine globalen npm/pip-Pakete).
  Abhängigkeiten nur projektlokal installieren.
- Keine Dienste, Container oder Prozesse anderer User stoppen, starten oder ändern.
  Nicht auf Docker/Dokku, nginx oder die produktiven Datenbanken zugreifen.
- Ressourcen sind begrenzt (2 GB RAM, 2 CPU-Kerne, 512 Prozesse). Speicherhungrige Builds
  nicht parallel laufen lassen.
