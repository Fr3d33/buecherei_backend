# 📚 Bücherei Backend

Ein modernes Backend-System für die Verwaltung einer digitalen Bibliothek, entwickelt mit Node.js, Express und Prisma.

## 🚀 Features

- **Benutzerverwaltung**: Registrierung, Login und Authentifizierung mit JWT
- **Buchverwaltung**: CRUD-Operationen für Bücher mit Kategorisierung
- **Ausleihsystem**: Vollständiges Buch-Ausleih- und Rückgabesystem
- **Dateienimport**: JSON-Import für Bücher und Benutzer
- **Rollenbasierte Berechtigung**: Manager- und Benutzerrechte
- **Sichere API**: JWT-basierte Authentifizierung und Passwort-Hashing

## 🛠️ Technologie-Stack

- **Backend**: Node.js, Express.js
- **Datenbank**: PostgreSQL mit Prisma ORM
- **Authentifizierung**: JWT (JSON Web Tokens)
- **Sicherheit**: bcrypt für Passwort-Hashing
- **Datei-Upload**: Multer
- **E-Mail**: Nodemailer
- **Umgebungsvariablen**: dotenv

## 📋 Voraussetzungen

- Node.js (Version 14 oder höher)
- PostgreSQL Datenbank
- npm oder yarn

## 🚀 Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/frederikkoch/buecherei_backend.git
   cd buecherei_backend
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen einrichten**
   
   Erstelle eine `.env` Datei im Projektverzeichnis:
   ```env
   DB_URL="postgresql://username:password@localhost:5432/buecherei_db"
   TOKEN_KEY="generate-your-own-32-byte-secret-key-here"
   EMAIL_USER="admin@yourdomain.com"
   EMAIL_PASS="your-app-specific-password"
   ```

4. **Datenbank einrichten**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Server starten**
   ```bash
   npm start
   ```

   Der Server läuft standardmäßig auf `http://localhost:4001`

## 📖 API Dokumentation

### Authentifizierung

#### POST `/book/backend/login`
Benutzer anmelden
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/book/backend/createUser`
Neuen Benutzer registrieren
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Max Mustermann"
}
```

### Bücher

#### GET `/book/backend/getBooks`
Alle Bücher abrufen (Authentifizierung erforderlich)

#### POST `/book/backend/createBook`
Neues Buch erstellen (Manager-Berechtigung erforderlich)
```json
{
  "name": "Der große Gatsby",
  "description": "Ein klassischer Roman",
  "author": "F. Scott Fitzgerald",
  "categorie": 1
}
```

#### POST `/book/backend/updateBook`
Buch aktualisieren (Manager-Berechtigung erforderlich)

#### POST `/book/backend/deleteBook`
Buch löschen (Manager-Berechtigung erforderlich)

### Ausleihen

#### POST `/book/backend/loanBook`
Buch ausleihen
```json
{
  "bookId": 1,
  "returnDate": "2024-12-31"
}
```

#### POST `/book/backend/returnBook`
Buch zurückgeben
```json
{
  "bookId": 1
}
```

### Import

#### POST `/book/backend/importBook`
Bücher aus JSON-Datei importieren (Multipart-Form-Data)

#### POST `/book/backend/importUser`
Benutzer aus JSON-Datei importieren (Multipart-Form-Data)

## 🗃️ Datenbankschema

Das Projekt verwendet Prisma ORM mit folgenden Hauptmodellen:

- **User**: Benutzerdaten mit Authentifizierung
- **Book**: Buchinformationen mit Kategorien
- **Categorie**: Buchkategorien
- **Loan**: Ausleihvorgänge mit Zeitstempel

## 🛡️ Sicherheit

- Passwörter werden mit bcrypt gehashed
- JWT-Tokens für sichere API-Authentifizierung
- Rollenbasierte Zugriffskontrolle (Manager vs. reguläre Benutzer)
- CORS-Konfiguration für Cross-Origin-Requests

## 🧪 Development

### Scripts

- `npm start`: Server mit nodemon starten (Auto-Reload)
- `npx prisma studio`: Prisma Studio für Datenbankvisualisierung
- `npx prisma migrate dev`: Neue Datenbankmigration erstellen
- `npx prisma generate`: Prisma Client neu generieren

### Projektstruktur

```
buecherei_backend/
├── uploads/          # Hochgeladene Dateien
├── prisma/           # Datenbankschema und Migrationen
├── index.js          # Hauptserver-Datei
├── package.json      # Abhängigkeiten und Scripts
├── schema.prisma     # Prisma Datenbankschema
└── .env             # Umgebungsvariablen (nicht im Repo)
```

## 🤝 Beitragen

1. Fork das Projekt
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) Datei für Details.

## 👥 Autoren

- **Frederik Koch** - *Initial work* - [frederikkoch](https://github.com/frederikkoch)

## 🙏 Danksagungen

- Express.js Team für das großartige Framework
- Prisma Team für das moderne ORM
- Alle Contributors die das Projekt verbessern

---

**Hinweis**: Dies ist ein Lernprojekt. Für Produktionsumgebungen sollten zusätzliche Sicherheitsmaßnahmen implementiert werden.
