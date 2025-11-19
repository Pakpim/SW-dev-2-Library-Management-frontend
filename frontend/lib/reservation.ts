import { authAPI, User } from "./auth";
import { Book } from "./book";

export interface Reservation {
  book: string;
  borrowDate: string;
  createdAt: string;
  id: string;
  pickupDate: string;
  updatedAt: string;
  user: string;
  __v: number;
  _id: string;
}

export interface ReservationInfo {
  _id: string;
  book: Book;
  user: string;
  borrowDate: string;
  pickupDate: string;
}

const BACKEND_URL = "http://localhost:5000";

const reservationAPI = {
  async getAll(): Promise<Reservation[]> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");
    const res = await fetch(`${BACKEND_URL}/api/v1/reservations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const json = await res.json();
    return json.data; // backend returns { success, count, data: [...] }
  },

  async getById(id: string): Promise<Reservation> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");
    const res = await fetch(`${BACKEND_URL}/api/v1/reservations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const json = await res.json();
    return json.data;
  },

  async create(
    data: Omit<
      Reservation,
      "_id" | "id" | "createdAt" | "updatedAt" | "user" | "__v"
    >
  ): Promise<Reservation> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");
    const res = await fetch(`${BACKEND_URL}/api/v1/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Create reservation failed:", await res.text());
      throw new Error("Failed to create reservation");
    }

    const json = await res.json();
    return json.data;
  },

  async update(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");
    const res = await fetch(`${BACKEND_URL}/api/v1/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Update reservation failed:", await res.text());
      throw new Error("Failed to update reservation");
    }

    const json = await res.json();
    return json.data;
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BACKEND_URL}/api/v1/reservations/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Delete reservation failed:", await res.text());
      throw new Error("Failed to delete reservation");
    }
  },
};

export default reservationAPI;
