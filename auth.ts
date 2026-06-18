import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { authConfig } from "./auth.config";
import "dotenv/config";

// Parse the DATABASE_URL to pass connection options to PrismaMariaDb adapter
const dbUrl = new URL(process.env.DATABASE_URL || "");

const dbAdapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  connectTimeout: 10000, // Increase connection timeout to 10 seconds
  ssl: {
    rejectUnauthorized: false
  }
});

const prisma = new PrismaClient({ adapter: dbAdapter });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as any),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        regID: { label: "Registration ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.regID || !credentials?.password) {
          return null;
        }

        const regID = credentials.regID as string;
        const password = credentials.password as string;

        // Find the user in the database where regID matches the input
        const user = await prisma.user.findUnique({
          where: {
            regID: regID,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        // Use bcrypt.compare to verify credentials
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        // Return the user object if valid
        return {
          id: user.regID,
          name: user.regID,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
