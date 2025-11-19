"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useReservationContext } from "@/contexts/ReservationContext";
import { useEffect, useState } from "react";
import ReservationCard from "@/components/ReservationCard";
import { ReservationInfo } from "@/lib/reservation";

export default function AdminReservationsManagePage() {
  const {
    reservations,
    loading,
    fetchReservations,
    updateReservation,
    deleteReservation,
  } = useReservationContext();
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

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

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await updateReservation(id, { status });
      await fetchReservations();
      alert(`Reservation ${status} successfully`);
    } catch (error) {
      alert(`Failed to ${status} reservation`);
      console.error(error);
    }
  };

  const filteredReservations = reservations.filter((r: ReservationInfo) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const statusCounts = {
    pending: reservations.filter((r: ReservationInfo) => r.status === "pending")
      .length,
    approved: reservations.filter(
      (r: ReservationInfo) => r.status === "approved"
    ).length,
    rejected: reservations.filter(
      (r: ReservationInfo) => r.status === "rejected"
    ).length,
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📋 Admin Reservation Management
        </h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total</h3>
            <p className="text-3xl font-bold text-gray-900">
              {reservations.length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-yellow-700 mb-2">
              Pending
            </h3>
            <p className="text-3xl font-bold text-yellow-900">
              {statusCounts.pending}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-green-700 mb-2">
              Approved
            </h3>
            <p className="text-3xl font-bold text-green-900">
              {statusCounts.approved}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-red-700 mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-red-900">
              {statusCounts.rejected}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All ({reservations.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
          >
            Pending ({statusCounts.pending})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Approved ({statusCounts.approved})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Rejected ({statusCounts.rejected})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              No {filter !== "all" ? filter : ""} reservations found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReservations.map((reservation: ReservationInfo) => (
              <ReservationCard
                key={reservation._id}
                reservation={reservation}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
