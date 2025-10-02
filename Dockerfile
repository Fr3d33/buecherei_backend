# Verwende das offizielle Node.js Image als Basis
FROM node:18-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere package.json und package-lock.json (falls vorhanden)
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm ci --only=production

# Kopiere den Rest des Anwendungscodes
COPY . .

# Generiere Prisma Client
RUN npx prisma generate

# Erstelle einen Benutzer ohne Root-Berechtigung
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Ändere die Berechtigung der App-Dateien
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponiere den Port
EXPOSE 4001

# Starte die Anwendung
CMD ["npm", "run", "start:prod"]
