import { authAPI } from "./auth";

export interface Book {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  publisher: string;
  availableAmount: number;
  coverPicture: string;
  createdAt: Date;
  updatedAt: Date;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const bookAPI = {
  async getAll(): Promise<Book[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/books`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch books");
    const json = await res.json();
    return json.data;
  },

  async getById(id: string): Promise<Book> {
    const res = await fetch(`${BACKEND_URL}/api/v1/books/${id}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch book");
    const json = await res.json();
    return json.data;
  },

  async create(
    book: Omit<Book, "_id" | "createdAt" | "updatedAt">
  ): Promise<Book> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");

    const res = await fetch(`${BACKEND_URL}/api/v1/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: JSON.stringify(book),
    });

    if (!res.ok) {
      console.error("Create book failed:", await res.text());
      throw new Error("Failed to create book");
    }
    const json = await res.json();
    return json.data;
  },

  async update(id: string, data: Partial<Book>): Promise<Book> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");
    const res = await fetch(`${BACKEND_URL}/api/v1/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update book");
    const json = await res.json();
    return json.data;
  },

  async delete(id: string): Promise<void> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");
    const res = await fetch(`${BACKEND_URL}/api/v1/books/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Delete book failed:", await res.text());
      throw new Error("Failed to delete book");
    }
  },
};
