// NextAuth API route — v4 pattern
// This route exists for compatibility but primary auth is handled
// via server actions in app/auth/actions.ts.
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        regID: { label: "Registration ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Auth is handled by server actions — this is a placeholder
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
