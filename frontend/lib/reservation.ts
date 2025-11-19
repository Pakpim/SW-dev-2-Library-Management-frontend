import { authAPI } from "./auth";
import { Book } from "./book";

export interface Reservation {
  book: string;
  borrowDate: string;
  createdAt: string;
  id: string;
  pickupDate: string;
  updatedAt: string;
  user: string;
  status: "pending" | "approved" | "rejected";
  __v: number;
  _id: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ReservationInfo {
  _id: string;
  book: Book;
  user: UserInfo;
  borrowDate: string;
  pickupDate: string;
  status: "pending" | "approved" | "rejected";
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const reservationAPI = {
  async getAll(): Promise<ReservationInfo[]> {
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

  async getById(id: string): Promise<ReservationInfo> {
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
  ): Promise<ReservationInfo> {
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
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create reservation");
    }

    const json = await res.json();
    return json.data;
  },

  async update(
    id: string,
    data: Partial<Reservation>
  ): Promise<ReservationInfo> {
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
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update reservation");
    }

    const json = await res.json();
    return json.data;
  },

  async delete(id: string): Promise<void> {
    const session = await authAPI.getSession();
    const token = session.token;

    if (!token) throw new Error("Authentication token not found");
    const res = await fetch(`${BACKEND_URL}/api/v1/reservations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete reservation");
    }
  },
};

export default reservationAPI;
