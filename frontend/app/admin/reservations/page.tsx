"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useReservationContext } from "@/contexts/ReservationContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminReservationsManagePage() {
  const { data: session, status } = useSession();
  const { reservations, loading, fetchReservations } = useReservationContext();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !hasFetched) {
      fetchReservations();
      setHasFetched(true);
    }
  }, [status, hasFetched, fetchReservations]);

  return (
    <ProtectedRoute requiredRole="admin">
      {status === "loading" ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            📋 Admin Reservation Management
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading reservations...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">
                {reservations.length} reservation(s) found
              </p>
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
