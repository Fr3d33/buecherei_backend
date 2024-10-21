const vorPath = "/book/backend";
const port = 4001;
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const json = require("body-parser/lib/types/json");
const password_generator = require("generate-password");
require("dotenv").config();
const prisma = new PrismaClient();
const jsonParser = bodyParser.json();

let appinstance = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(
  cors({
    origin: "*",
  })
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_KEY, async (err, user) => {
    console.log(err);
    if (err) return res.send(user);
    dbuser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    req.user = user;
    req.user.dbuser = dbuser;
    next();
  });
}

app.get(`${vorPath}/`, function (request, response) {
  response.send("Hello World!");
});

app.listen(3001, function () {
  console.log("Started application on port %d", 4001);
});

app.post(`${vorPath}/login`, jsonParser, async (req, res) => {
  const request = req.body;
  const email = request.email;
  const password = request.password;

  const user = await prisma.user.findFirst({
    where: {
      email: {
        // ILIKE ermöglicht eine case-insensitive Suche in PostgreSQL
        contains: email,
        mode: "insensitive",
      },
    },
  });

  if (!user) {
    res.status(401).json({ message: "Benutzer nicht gefunden." });
  } else {
    const password_hashed = user.passwd;
    const password_correct = await bcrypt.compare(password, password_hashed);
    if (password_correct) {
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);
      res.status(200).json({ message: "Login erfolgreich.", token: token });
    } else {
      res.status(401).json({ message: "Passwort falsch." });
    }
  }
});

app.post(`${vorPath}/createUser`, jsonParser, async (req, res) => {
  const request = req.body;
  const email = request.email;
  const password = await bcrypt.hash(request.password, 10);
  const name = request.name;
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        passwd: password,
        name: name,
      },
    });
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ message: "User created", token: token });
  } catch (error) {
    if (error.code == "P2002") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
      console.log(error);
    }
  }
});

app.post(
  `${vorPath}/createBook`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    const request = req.body;
    const name = request.name;
    const description = request.description;
    const userId = Number(req.user.id);
    const categorie = Number(request.categorie);
    const author = request.author;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { manager: true },
      });
      if (!user || !user.manager) {
        return res.status(403).json({
          message: "Acces denied. You are not authorized to create a Book!",
        });
      }
      await prisma.book.create({
        data: {
          name: name,
          description: description,
          categories: {
            connect: { id: categorie },
          },
          author: author,
        },
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

app.get(
  `${vorPath}/getBooks`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    try {
      const books = await prisma.book.findMany({
        include: {
          categories: true,
        },
      });
      res.status(200).json({ books: books });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

app.post(
  `${vorPath}/updateBook`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    const request = req.body;
    const userId = req.user.id;
    const name = request.name;
    const description = request.description;
    const categorie = Number(request.categorie);
    const bookId = Number(request.bookId);
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { manager: true },
      });

      if (!user || !user.manager) {
        return res.status(403).json({
          message: "Acces denied. You are not authorized to update this Book!",
        });
      }
      const existingBook = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!existingBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      const books = await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          name: name || existingBook.name,
          description: description || existingBook.description,
          categories: categorie || existingBook.categories,
        },
      });
      res.status(200).json({ books: books });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

app.get(
  `${vorPath}/getSpecificBook`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    const request = req.body;
    const bookId = Number(request.bookId);
    try {
      const books = await prisma.book.findFirst({
        where: {
          id: bookId,
        },
      });
      res.status(200).json({ books: books });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

app.get(
  `${vorPath}/getBookByName`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    const request = req.body;
    const name = request.name;
    try {
      const books = await prisma.book.findFirst({
        where: {
          name: name,
        },
      });
      res.status(200).json({ books: books });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

app.post(
  `${vorPath}/deleteBook`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    const request = req.body;
    const name = request.name;
    const userId = Number(req.user.id);
    const bookId = Number(request.bookId);
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { manager: true },
      });
      if (!user || !user.manager) {
        return res.status(403).json({
          message: "Acces denied. You are not authorized to delete a Book!",
        });
      }
      await prisma.book.delete({
        where: {
          id: bookId,
        },
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

app.post(
  `${vorPath}/deleteUser`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    const request = req.body;
    const userId = Number(req.user.id);
    const targetUserId = Number(request.targetUserId);
    if (isNaN(targetUserId) || targetUserId <= 0) {
      return res.status(400).json({
        message: "Invalid user ID provided.",
      });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { manager: true },
      });
      if (!user || (!user.manager && userId !== targetUserId)) {
        return res.status(403).json({
          message: "Access denied. You are not authorized to delete this user!",
        });
      }
      await prisma.user.delete({
        where: {
          id: targetUserId,
        },
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

app.post(
  `${vorPath}/loanBook`,
  jsonParser,
  authenticateToken,
  async (req, res) => {
    const request = req.body;
    const userId = Number(req.user.id);
    try {
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);
