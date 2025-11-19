// contexts/ReservationContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import reservationAPI, {
  Reservation,
  ReservationInfo,
} from "@/lib/reservation";

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

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationAPI.getAll();
      setReservations(data);
    } catch (err) {
      console.error("Fetch reservations failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (
    data: Omit<
      Reservation,
      "_id" | "id" | "createdAt" | "updatedAt" | "user" | "__v"
    >
  ) => {
    const result = await reservationAPI.create(data);
    setReservations((prev) => [...prev, result]);
  };

  const updateReservation = async (id: string, data: Partial<Reservation>) => {
    const result = await reservationAPI.update(id, data);
    setReservations((prev) => prev.map((r) => (r._id === id ? result : r)));
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
      }}
    >
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
