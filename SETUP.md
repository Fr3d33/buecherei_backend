# 🛠️ Setup Anleitung

Diese Anleitung hilft dir beim ersten Setup des Bücherei Backend Systems.

## ✅ Schritt-für-Schritt Setup

### 1. Repository klonen
```bash
git clone https://github.com/frederikkoch/buecherei_backend.git
cd buecherei_backend
```

### 2. Umgebungsvariablen konfigurieren
```bash
cp .env.example .env
```

Dann bearbeite die `.env` Datei:
```env
DB_URL="postgresql://username:password@localhost:5432/buecherei_db"
TOKEN_KEY="dein-eigener-32-zeichen-geheimer-schluessel"
EMAIL_USER="deine-email@domain.com"
EMAIL_PASS="dein-app-passwort"
```

**Wichtig**: 
- Generiere einen sicheren TOKEN_KEY mit: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Verwende niemals die Beispielwerte in der Produktion!

### 3. Dependencies installieren
```bash
npm install
```

### 4. Datenbank einrichten

#### Option A: Lokale PostgreSQL
```bash
# PostgreSQL installieren (Windows/chocolatey)
choco install postgresql

# Oder (macOS/homebrew)
brew install postgresql

# Datenbank erstellen
createdb buecherei_db
```

#### Option B: Docker PostgreSQL
```bash
docker run --name postgres-buecherei -e POSTGRES_PASSWORD=password -e POSTGRES_DB=buecherei_db -p 5432:5432 -d postgres:15
```

### 5. Prisma Setup
```bash
# Prisma Client generieren
npx prisma generate

# Datenbank migrieren
npx prisma migrate dev --name init

# Testdaten einfügen (optional)
npm run db:seed
```

### 6. Server starten
```bash
npm start
```

Die API ist verfügbar unter: `http://localhost:4001/book/backend`

## 🧪 Erste Tests

### Health Check
```bash
curl http://localhost:4001/book/backend/
```

### Benutzer registrieren
```bash
curl -X POST http://localhost:4001/book/backend/createUser \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:4001/book/backend/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 🔧 Entwicklungstools

### Datenbank verwalten
```bash
# Prisma Studio öffnen
npm run db:studio

# Migration erstellen
npm run db:migrate

# Seed-Daten neu laden
npm run db:seed
```

### Logs anzeigen
```bash
# Mit nodemon (automatisches reload)
npm run dev
```

## ⚠️ Häufige Probleme

### "Connection refused" Fehler
- Überprüfe, ob PostgreSQL läuft
- Überprüfe die DB_URL in der .env Datei
- Teste die Datenbankverbindung: `psql -h localhost -U username -d buecherei_db`

### JWT Token Fehler
- Überprüfe, ob TOKEN_KEY gesetzt ist
- TOKEN_KEY muss mindestens 32 Zeichen lang sein

### Port bereits belegt
- Ändere den PORT in der .env Datei
- Oder stoppe den Prozess: `npx kill-port 4001`

### Prisma Fehler
- Lösche `node_modules` und installiere neu: `rm -rf node_modules && npm install`
- Generiere Prisma Client neu: `npx prisma generate`

## 🚀 Produktionssetup

Für Produktionsumgebungen:

1. **Umgebungsvariablen sichern**
   - Verwende starke, einzigartige Passwörter
   - TOKEN_KEY sollte kryptografisch sicher sein
   - Setze NODE_ENV=production

2. **HTTPS einrichten**
   - Verwende einen Reverse Proxy (nginx)
   - SSL-Zertifikat installieren

3. **Monitoring einrichten**
   - Logs konfigurieren
   - Health Checks implementieren
   - Error Tracking (Sentry, etc.)

4. **Backup-Strategie**
   - Regelmäßige Datenbank-Backups
   - Uploads-Verzeichnis sichern

## 📞 Support

Bei Problemen:
1. Überprüfe die Logs
2. Schaue in die [Troubleshooting-Sektion](DEPLOYMENT.md#troubleshooting)
3. Erstelle ein [GitHub Issue](https://github.com/frederikkoch/buecherei_backend/issues)

---

**Tipp**: Für die erste Einrichtung empfiehlt sich die Verwendung der Seed-Daten, um das System mit Beispielinhalten zu testen.