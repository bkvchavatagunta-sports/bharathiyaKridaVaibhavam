import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Committee Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Use environment variables for the secure admin credentials
        const adminEmail = process.env.ADMIN_EMAIL || "admin@bkv.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "bkv@123";

        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return { id: "1", name: "BKV Admin", email: adminEmail, role: "ADMIN" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
});

export { handler as GET, handler as POST };
