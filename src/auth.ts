import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { UserRole } from "@/generated/prisma/client";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  "dev-only-auth-secret-change-this-before-production";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/masuk",
  },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } satisfies AuthUser;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as AuthUser).role;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role =
          token.role === "ADMIN" || token.role === "STUDENT"
            ? token.role
            : "STUDENT";
        session.user.name = token.name ?? session.user.name ?? "";
        session.user.email = token.email ?? session.user.email ?? "";
      }

      return session;
    },
  },
});
