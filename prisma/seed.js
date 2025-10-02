const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  console.log("📚 Creating categories...");
  const fiction = await prisma.categorie.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Belletristik",
    },
  });

  const nonFiction = await prisma.categorie.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Sachbuch",
    },
  });

  const classic = await prisma.categorie.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Klassiker",
    },
  });

  // Create admin user
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@buecherei.com" },
    update: {},
    create: {
      email: "admin@buecherei.com",
      name: "Administrator",
      passwd: hashedPassword,
      manager: true,
    },
  });

  // Create test user
  console.log("👤 Creating test user...");
  const testUserPassword = await bcrypt.hash("user123", 10);
  const testUser = await prisma.user.upsert({
    where: { email: "user@buecherei.com" },
    update: {},
    create: {
      email: "user@buecherei.com",
      name: "Test Benutzer",
      passwd: testUserPassword,
      manager: false,
    },
  });

  // Create sample books
  console.log("📖 Creating sample books...");
  const book1 = await prisma.book.upsert({
    where: { name: "Der große Gatsby" },
    update: {},
    create: {
      name: "Der große Gatsby",
      description:
        "Ein klassischer amerikanischer Roman über den amerikanischen Traum in den 1920er Jahren.",
      author: "F. Scott Fitzgerald",
      categories: {
        connect: [{ id: classic.id }, { id: fiction.id }],
      },
    },
  });

  const book2 = await prisma.book.upsert({
    where: { name: "1984" },
    update: {},
    create: {
      name: "1984",
      description: "Dystopischer Roman über Überwachung und Totalitarismus.",
      author: "George Orwell",
      categories: {
        connect: [{ id: classic.id }, { id: fiction.id }],
      },
    },
  });

  const book3 = await prisma.book.upsert({
    where: { name: "Eine kurze Geschichte der Zeit" },
    update: {},
    create: {
      name: "Eine kurze Geschichte der Zeit",
      description: "Populärwissenschaftliches Buch über Kosmologie und Physik.",
      author: "Stephen Hawking",
      categories: {
        connect: [{ id: nonFiction.id }],
      },
    },
  });

  console.log("✅ Seeding completed!");
  console.log("📊 Created:");
  console.log(`  - ${3} categories`);
  console.log(`  - ${2} users (admin@buecherei.com / user@buecherei.com)`);
  console.log(`  - ${3} books`);
  console.log("");
  console.log("🔑 Login credentials:");
  console.log("  Admin: admin@buecherei.com / admin123");
  console.log("  User:  user@buecherei.com / user123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
