# Security Policy

## Supported Versions

Wir unterstützen die folgenden Versionen mit Sicherheitsupdates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

Wenn du eine Sicherheitslücke findest, bitte:

1. **NICHT** ein öffentliches Issue erstellen
2. Sende eine E-Mail an: [frederikkoch@proton.me](mailto:frederikkoch@proton.me)
3. Beschreibe die Schwachstelle detailliert
4. Füge Schritte zur Reproduktion hinzu

### Was erwartet dich:

- Bestätigung des Empfangs innerhalb von 48 Stunden
- Regelmäßige Updates zum Status
- Anerkennung deines Beitrags (falls gewünscht)

## Sicherheitsmaßnahmen

Dieses Projekt implementiert:

- ✅ Passwort-Hashing mit bcrypt
- ✅ JWT-Token-Authentifizierung
- ✅ Input-Validierung
- ✅ CORS-Konfiguration
- ✅ Umgebungsvariablen für sensible Daten

## Empfohlene Produktionseinstellungen

Für Produktionsumgebungen empfehlen wir:

- HTTPS verwenden
- Rate Limiting implementieren
- Logging und Monitoring einrichten
- Regelmäßige Dependency-Updates
- Sichere Datenbank-Konfiguration
