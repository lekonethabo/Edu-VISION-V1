"use server";

import { prisma } from "../../lib/db";
import bcrypt from "bcryptjs";

export type LoginResult = {
  success: boolean;
  error?: string;
  user?: {
    regID: string;
    role: string;
    schoolId?: string | null;
    firstLogin: boolean;
    isActive: boolean;
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

    if (!user.isActive) {
      return { success: false, error: "This account has been deactivated. Contact EMIS support." };
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
        role: user.role,
        schoolId: user.schoolId ?? null,
        firstLogin: user.firstLogin,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "A connection error occurred. Please try again." };
  }
}
