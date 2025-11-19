"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useReservationContext } from "@/contexts/ReservationContext";
import { useEffect } from "react";

export default function AdminReservationsManagePage() {
  const {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  } = useReservationContext();

  useEffect(() => {
    fetchReservations();
    console.log("reservation", reservations);
  }, []);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📋 Admin Reservation Management
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">
            Manage all book reservations from users here.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
