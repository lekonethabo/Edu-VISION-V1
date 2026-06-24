const { PrismaClient } = require("./generated/prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
require('dotenv').config();

async function testAdapter() {
  console.log("Testing with PrismaMariaDb adapter...");
  const dbUrl = new URL(process.env.DATABASE_URL || "");

  const dbAdapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1),
    connectTimeout: 10000,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const prisma = new PrismaClient({ adapter: dbAdapter });

  try {
    const users = await prisma.user.findMany();
    console.log("Success! Users:", users);
  } catch (error) {
    console.error("Adapter connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdapter();
