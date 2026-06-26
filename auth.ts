import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/db";
import { authConfig } from "./auth.config";

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
