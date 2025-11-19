// lib/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "member" | "admin";
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const authAPI = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Important for cookies
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
  },

  async register(
    name: string,
    email: string,
    tel: string,
    password: string,
    role: string
  ): Promise<AuthResponse> {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, tel, password, role }),
      credentials: "include", // Important for cookies
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    return data;
  },

  // Save auth data via API route (stores in httpOnly cookie)
  async saveSession(token: string, user: User) {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, user }),
    });
  },

  // Get user from API route (reads from httpOnly cookie)
  async getSession(): Promise<{ user: User | null; token: string | null }> {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return { user: null, token: null };
      }

      const data = await response.json();
      return data;
    } catch {
      return { user: null, token: null };
    }
  },

  // Logout via API route (clears httpOnly cookie)
  async logout() {
    await fetch("/api/auth/session", {
      method: "DELETE",
    });
  },

  getAuthHeader(token: string) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
