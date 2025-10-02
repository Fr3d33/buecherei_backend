# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-03

### Hinzugefügt
- 🎉 Erstes Release des Bücherei Backend Systems
- 👤 Benutzerregistrierung und -authentifizierung mit JWT
- 📚 Vollständige Buchverwaltung (CRUD-Operationen)
- 🏷️ Kategoriesystem für Bücher
- 📖 Ausleih- und Rückgabesystem für Bücher
- 👨‍💼 Rollenbasierte Berechtigung (Manager vs. normale Benutzer)
- 📁 JSON-Import für Bücher und Benutzer
- 🔒 Sichere Passwort-Verschlüsselung mit bcrypt
- 📧 E-Mail-Integration mit nodemailer
- 🌐 CORS-Unterstützung für Frontend-Integration
- 🗄️ PostgreSQL-Integration mit Prisma ORM

### Sicherheit
- JWT-Token-basierte Authentifizierung
- Passwort-Hashing mit bcrypt
- Umgebungsvariablen für sensible Daten
- Input-Validierung für API-Endpoints

### Technisch
- Node.js + Express.js Backend
- Prisma ORM für Datenbankoperationen
- Multer für Datei-Uploads
- Strukturierte API mit RESTful Endpoints
- Umfassende Fehlerbehandlung