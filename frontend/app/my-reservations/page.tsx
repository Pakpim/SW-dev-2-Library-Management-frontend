"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MyReservationsPage() {
  return (
    <ProtectedRoute requiredRole="member">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📚 My Reservations
        </h1>
      </div>
    </ProtectedRoute>
  );
}
