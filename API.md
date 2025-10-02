# 🔌 API Dokumentation

## Base URL
```
http://localhost:4001/book/backend
```

## Authentifizierung

Die meisten Endpoints benötigen einen JWT Token im Authorization Header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### POST `/login`
Benutzer anmelden und JWT Token erhalten.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login erfolgreich.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401):**
```json
{
  "message": "Benutzer nicht gefunden."
}
```

### POST `/createUser`
Neuen Benutzer registrieren.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "Max Mustermann"
}
```

**Response (200):**
```json
{
  "message": "User created",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📚 Book Management Endpoints

### GET `/getBooks`
🔒 **Authentifizierung erforderlich**

Alle Bücher mit Kategorien abrufen.

**Response (200):**
```json
{
  "books": [
    {
      "id": 1,
      "name": "Der große Gatsby",
      "description": "Ein klassischer amerikanischer Roman",
      "author": "F. Scott Fitzgerald",
      "categories": [
        {
          "id": 1,
          "name": "Klassiker"
        }
      ]
    }
  ]
}
```

### POST `/createBook`
🔒 **Authentifizierung + Manager-Berechtigung erforderlich**

Neues Buch erstellen.

**Request Body:**
```json
{
  "name": "1984",
  "description": "Dystopischer Roman von George Orwell",
  "author": "George Orwell",
  "categorie": 1
}
```

### POST `/updateBook`
🔒 **Authentifizierung + Manager-Berechtigung erforderlich**

Bestehende Buchinformationen aktualisieren.

**Request Body:**
```json
{
  "bookId": 1,
  "name": "Neuer Titel",
  "description": "Neue Beschreibung",
  "categorie": 2
}
```

### GET `/getSpecificBook`
🔒 **Authentifizierung erforderlich**

Spezifisches Buch anhand der ID abrufen.

**Request Body:**
```json
{
  "bookId": 1
}
```

### GET `/getBookByName`
🔒 **Authentifizierung erforderlich**

Buch anhand des Namens suchen.

**Request Body:**
```json
{
  "name": "Der große Gatsby"
}
```

### POST `/deleteBook`
🔒 **Authentifizierung + Manager-Berechtigung erforderlich**

Buch löschen.

**Request Body:**
```json
{
  "bookId": 1,
  "name": "Der große Gatsby"
}
```

---

## 📖 Loan Management Endpoints

### POST `/loanBook`
🔒 **Authentifizierung erforderlich**

Buch ausleihen.

**Request Body:**
```json
{
  "bookId": 1,
  "returnDate": "2024-12-31T23:59:59.000Z"
}
```

**Response (200):**
```json
{
  "message": "Book successfully checked out. Enjoy your reading!",
  "loan": {
    "id": 1,
    "userId": 1,
    "bookId": 1,
    "loanDate": "2024-10-03T10:00:00.000Z",
    "returnDate": "2024-12-31T23:59:59.000Z"
  }
}
```

### POST `/returnBook`
🔒 **Authentifizierung erforderlich**

Buch zurückgeben.

**Request Body:**
```json
{
  "bookId": 1
}
```

**Response (200):**
```json
{
  "message": "Book successfully returned.",
  "loan": {
    "id": 1,
    "userId": 1,
    "bookId": 1
  }
}
```

---

## 👥 User Management Endpoints

### POST `/deleteUser`
🔒 **Authentifizierung erforderlich**

Benutzer löschen (Manager kann alle löschen, Benutzer nur sich selbst).

**Request Body:**
```json
{
  "targetUserId": 5
}
```

---

## 📁 Import Endpoints

### POST `/importBook`
🔒 **Authentifizierung erforderlich**

Bücher aus JSON-Datei importieren.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: JSON-Datei mit Bücher-Array

**JSON Format:**
```json
[
  {
    "name": "Buchname",
    "description": "Beschreibung",
    "author": "Autor",
    "categories": [
      { "id": 1 }
    ]
  }
]
```

### POST `/importUser`
🔒 **Authentifizierung erforderlich**

Benutzer aus JSON-Datei importieren.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: JSON-Datei mit Benutzer-Array

**JSON Format:**
```json
[
  {
    "name": "Max Mustermann",
    "email": "max@example.com",
    "passwd": "$2b$10$hashedPassword",
    "manager": false
  }
]
```

---

## ❌ Error Codes

| Code | Beschreibung |
|------|-------------|
| 200 | Erfolgreich |
| 400 | Bad Request - Ungültige Anfrage |
| 401 | Unauthorized - Authentifizierung fehlgeschlagen |
| 403 | Forbidden - Keine Berechtigung |
| 404 | Not Found - Ressource nicht gefunden |
| 500 | Internal Server Error - Serverfehler |

## 📝 Hinweise

- Alle Datumsangaben sind im ISO 8601 Format
- Manager-Berechtigungen sind erforderlich für CRUD-Operationen an Büchern
- JWT Tokens haben eine begrenzte Gültigkeit
- Passwörter werden automatisch gehasht bei der Registrierung
