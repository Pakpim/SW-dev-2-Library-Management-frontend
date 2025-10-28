import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: "member" | "admin";
    token: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "member" | "admin";
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "member" | "admin";
    accessToken?: string;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authConfig: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          // Call backend login endpoint
          const response = await fetch(
            "http://localhost:5000/api/v1/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Invalid credentials");
          }

          const data = await response.json();

          // Return user object with token
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            token: data.token,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ token, user }: { token: JWT; user: any }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: { session: any; token: JWT }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "member" | "admin") || "member";
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
