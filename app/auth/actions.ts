"use server";

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Parse DATABASE_URL for the MariaDB adapter
const dbUrl = new URL(process.env.DATABASE_URL || "");

const dbAdapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  connectTimeout: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({ adapter: dbAdapter });

export type LoginResult = {
  success: boolean;
  error?: string;
  user?: {
    regID: string;
  };
};

export async function loginAction(
  regID: string,
  password: string
): Promise<LoginResult> {
  try {
    if (!regID || !password) {
      return { success: false, error: "Registration number and password are required." };
    }

    // Find user by registration number
    const user = await prisma.user.findUnique({
      where: { regID },
    });

    if (!user || !user.password) {
      return { success: false, error: "Invalid registration number or password." };
    }

    // Verify password using bcrypt
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { success: false, error: "Invalid registration number or password." };
    }

    return {
      success: true,
      user: {
        regID: user.regID,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "A connection error occurred. Please try again." };
  }
}
