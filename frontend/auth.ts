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
          const backendUrl = "http://localhost:5000";
          const loginUrl = `${backendUrl}/api/v1/auth/login`;

          console.log("Attempting to authenticate with:", loginUrl);

          const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("Backend response status:", response.status);

          // Check if response is JSON
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Backend response is not JSON:", text);
            throw new Error(
              "Backend error: Server returned invalid response. Is the backend running on port 5000?"
            );
          }

          const data = await response.json();
          console.log("Backend response data:", data);

          if (!response.ok) {
            throw new Error(
              data.msg || data.error || data.message || "Invalid credentials"
            );
          }

          // Backend returns user object and token
          if (!data.user || !data.token) {
            console.error("Invalid backend response format:", data);
            throw new Error("Backend returned invalid data format");
          }

          // Return user object with token
          return {
            id: data.user.id || data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || "member",
            token: data.token,
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Authentication failed";
          console.error("Auth error:", message);
          throw new Error(message);
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
