// contexts/ReservationContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import reservationAPI, {
  Reservation,
  ReservationInfo,
} from "@/lib/reservation";
import { useBookContext } from "./BookContext";
import { useSession } from "next-auth/react";
import { User } from "@/lib/auth";

interface ReservationContextProps {
  reservations: ReservationInfo[];
  loading: boolean;
  fetchReservations: () => Promise<void>;
  createReservation: (
    data: Omit<
      Reservation,
      "_id" | "id" | "createdAt" | "updatedAt" | "user" | "__v"
    >
  ) => Promise<void>;
  updateReservation: (id: string, data: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
}

const ReservationContext = createContext<ReservationContextProps | undefined>(
  undefined
);

export const ReservationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { books } = useBookContext();
  const [user, setUser] = useState<Omit<User, "email"> | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name ?? "customer",
        role: session.user.role as "member" | "admin",
      });
    }
  }, [session]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationAPI.getAll();
      console.log(
        "find book reserv",
        books.find((b) => b._id.toString() === books[4]._id.toString())
      );
      console.log("find reserv book", data[0].book);
      console.log("books", books);
      const mappedReservations = data.map((reservation: Reservation) => {
        const foundBook = books.find(
          (b) => b._id.toString() === reservation.book.toString()
        );
        return {
          _id: reservation._id,
          book: foundBook,
          user: reservation.user, // Use user from reservation, not session
          borrowDate: reservation.borrowDate,
          pickupDate: reservation.pickupDate,
        } as ReservationInfo;
      });
      setReservations(mappedReservations);
    } catch (err) {
      console.error("Fetch reservations failed:", err);
    } finally {
      setLoading(false);
      console.log("fetch reserv", reservations);
    }
  };

  const createReservation = async (
    data: Omit<
      Reservation,
      "_id" | "id" | "createdAt" | "updatedAt" | "user" | "__v"
    >
  ) => {
    const result = await reservationAPI.create(data);
    const mappedResult = {
      _id: result._id,
      book: books.filter((b) => {
        b._id = result.book;
      })[0],
      user: user?.name,
      borrowDate: result.borrowDate,
      pickupDate: result.pickupDate,
    } as ReservationInfo;
    setReservations((prev) => [...prev, mappedResult]);
  };

  const updateReservation = async (id: string, data: Partial<Reservation>) => {
    const result = await reservationAPI.update(id, data);
    const mappedResult = {
      _id: result._id,
      book: books.filter((b) => {
        b._id = result.book;
      })[0],
      user: user?.name,
      borrowDate: result.borrowDate,
      pickupDate: result.pickupDate,
    } as ReservationInfo;
    setReservations((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...mappedResult } : r))
    );
  };

  const deleteReservation = async (id: string) => {
    await reservationAPI.delete(id);
    setReservations((prev) => prev.filter((r) => r._id !== id));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        loading,
        fetchReservations,
        createReservation,
        updateReservation,
        deleteReservation,
      }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservationContext = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx)
    throw new Error("useReservationContext must be used within provider");
  return ctx;
};
