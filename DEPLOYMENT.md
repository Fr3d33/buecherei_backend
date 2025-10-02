# 🚀 Deployment Guide

Dieser Guide erklärt, wie du das Bücherei Backend in verschiedenen Umgebungen deployen kannst.

## 📋 Voraussetzungen

- Node.js 16+ 
- PostgreSQL Datenbank
- Git

## 🐳 Docker Deployment (Empfohlen)

### Schnell-Start mit Docker Compose

1. **Repository klonen**
   ```bash
   git clone https://github.com/frederikkoch/buecherei_backend.git
   cd buecherei_backend
   ```

2. **Umgebungsvariablen anpassen**
   ```bash
   cp .env.example .env
   # Bearbeite .env mit deinen Werten
   ```

3. **Services starten**
   ```bash
   docker-compose up -d
   ```

4. **Datenbank migrieren und seeden**
   ```bash
   docker-compose exec api npx prisma migrate deploy
   docker-compose exec api npx prisma db seed
   ```

Die API ist dann verfügbar unter: `http://localhost:4001`

### Nur Backend Container

```bash
# Image bauen
docker build -t buecherei-backend .

# Container starten
docker run -p 4001:4001 \
  -e DB_URL="postgresql://user:pass@host:5432/buecherei_db" \
  -e TOKEN_KEY="your-32-byte-secret-key" \
  buecherei-backend
```

## 🌐 Manuelle Deployment

### 1. Server vorbereiten

```bash
# Node.js installieren (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL installieren
sudo apt-get install postgresql postgresql-contrib
```

### 2. Anwendung deployen

```bash
# Code klonen
git clone https://github.com/frederikkoch/buecherei_backend.git
cd buecherei_backend

# Dependencies installieren
npm ci --production

# Prisma Client generieren
npx prisma generate

# Database Setup
npx prisma migrate deploy
npx prisma db seed
```

### 3. Produktionsserver starten

```bash
# Mit PM2 (empfohlen)
npm install -g pm2
pm2 start index.js --name "buecherei-backend"
pm2 startup
pm2 save

# Oder direkt
npm run start:prod
```

## ☁️ Cloud Deployment

### Heroku

1. **Heroku App erstellen**
   ```bash
   heroku create buecherei-backend-app
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Umgebungsvariablen setzen**
   ```bash
   heroku config:set TOKEN_KEY="your-32-byte-secret-key"
   heroku config:set NODE_ENV="production"
   ```

3. **Deployen**
   ```bash
   git push heroku main
   heroku run npx prisma migrate deploy
   heroku run npx prisma db seed
   ```

### Railway

```bash
# Railway CLI installieren
npm install -g @railway/cli

# Projekt erstellen
railway login
railway init
railway add postgresql
railway deploy
```

### DigitalOcean App Platform

1. Repository mit DigitalOcean verbinden
2. Build Command: `npm ci && npx prisma generate`
3. Run Command: `npx prisma migrate deploy && npm run start:prod`
4. PostgreSQL Managed Database hinzufügen

## 🔒 Produktions-Sicherheit

### Umgebungsvariablen

Stelle sicher, dass folgende Variablen gesetzt sind:

```env
NODE_ENV=production
DB_URL="postgresql://user:password@host:port/database"
TOKEN_KEY="your-32-byte-secret-key-here"
ALLOWED_ORIGINS="https://yourdomain.com"
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL mit Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 📊 Monitoring

### Health Check Endpoint

Das System bietet einen Health Check unter:
```
GET /book/backend/health
```

### Logs

```bash
# Docker Logs
docker-compose logs -f api

# PM2 Logs
pm2 logs buecherei-backend

# System Logs
tail -f /var/log/your-app.log
```

## 🔄 Updates

```bash
# Code aktualisieren
git pull origin main

# Dependencies aktualisieren
npm ci --production

# Prisma Client neu generieren
npx prisma generate

# Migrationen ausführen
npx prisma migrate deploy

# Services neustarten
docker-compose restart api
# oder
pm2 restart buecherei-backend
```

## 🆘 Troubleshooting

### Häufige Probleme

1. **Datenbankverbindung fehlgeschlagen**
   - Überprüfe DB_URL Format
   - Teste Netzwerk-Konnektivität
   - Prüfe Firewall-Einstellungen

2. **JWT Fehler**
   - Überprüfe TOKEN_KEY
   - Stelle sicher, dass der Key lang genug ist

3. **File Upload Fehler**
   - Überprüfe Berechtigungen des uploads/ Verzeichnisses
   - Stelle sicher, dass genügend Speicherplatz vorhanden ist

### Support

Bei Problemen:
1. Überprüfe die Logs
2. Teste die API Endpoints manuell
3. Erstelle ein Issue auf GitHub

---

**Hinweis**: Für Produktionsumgebungen sollten zusätzliche Sicherheitsmaßnahmen wie Rate Limiting, Request Validation und regelmäßige Security Updates implementiert werden.