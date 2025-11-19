"use client";

import { useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ReservationCard from "@/components/ReservationCard";
import { useReservationContext } from "@/contexts/ReservationContext";
import { ReservationInfo } from "@/lib/reservation";

export default function MyReservationsPage() {
  const {
    reservations,
    loading,
    fetchReservations,
    deleteReservation,
    updateReservation,
  } = useReservationContext();

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleEdit = async (
    id: string,
    borrowDate: string,
    pickupDate: string
  ) => {
    try {
      await updateReservation(id, { borrowDate, pickupDate });
      await fetchReservations();
    } catch (error) {
      alert("Failed to update reservation");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReservation(id);
      await fetchReservations();
    } catch (error) {
      alert("Failed to delete reservation");
      console.error(error);
    }
  };

  const activeReservations = reservations.filter(
    (r: ReservationInfo) => r.status === "pending" || r.status === "approved"
  );

  return (
    <ProtectedRoute requiredRole="member">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📚 My Reservations
          </h1>
          <div className="text-sm text-gray-600">
            Active: {activeReservations.length} / 3
          </div>
        </div>

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
            {reservations.map((reservation: ReservationInfo) => (
              <ReservationCard
                key={reservation._id}
                reservation={reservation}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
