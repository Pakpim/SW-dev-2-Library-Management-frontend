"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ReservationCard from "@/components/ReservationCard";
import { useReservationContext } from "@/contexts/ReservationContext";
import { Reservation, ReservationInfo } from "@/lib/reservation";

export default function MyReservationsPage() {
  const {
    reservations,
    loading,
    fetchReservations,
    deleteReservation,
    updateReservation,
  } = useReservationContext();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
    console.log("reserv???", reservations);
  }, []);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
  };

  return (
    <ProtectedRoute requiredRole="member">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📚 My Reservations
        </h1>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">No reservations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* {reservations.map((reservation: ReservationInfo) => (
              <ReservationCard
                key={reservation._id}
                reservation={reservation}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))} */}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
