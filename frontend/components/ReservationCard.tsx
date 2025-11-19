"use client";

import { ReservationInfo } from "@/lib/reservation";
import { useState } from "react";
import ReservationDialog from "./ReservationDialog";
import { useAuth } from "@/contexts/AuthContext";

interface ReservationCardProps {
  reservation: ReservationInfo;
  onEdit: (id: string, borrowDate: string, pickupDate: string) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: "approved" | "rejected") => void;
}

export default function ReservationCard({
  reservation,
  onEdit,
  onDelete,
  onStatusChange,
}: ReservationCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      setIsDeleting(true);
      await onDelete(reservation._id);
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = (borrowDate: string, pickupDate: string) => {
    onEdit(reservation._id, borrowDate, pickupDate);
    setEditDialogOpen(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        {/* Book Cover */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={reservation.book.coverPicture}
            alt={reservation.book.title}
            className="w-full h-full object-cover"
          />
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadgeColor(
                reservation.status
              )}`}
            >
              {reservation.status}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {reservation.book.title}
          </h3>

          <div className="space-y-2 mb-4 text-sm text-gray-600">
            {isAdmin && (
              <p>
                <span className="font-medium text-gray-700">User ID:</span>{" "}
                {reservation.user}
              </p>
            )}
            <p>
              <span className="font-medium text-gray-700">
                Reservation Date:
              </span>{" "}
              {new Date(reservation.borrowDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium text-gray-700">Pickup Date:</span>{" "}
              {new Date(reservation.pickupDate).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="flex gap-2">
              {(!isAdmin || reservation.status === "pending") && (
                <button
                  onClick={() => setEditDialogOpen(true)}
                  disabled={reservation.status !== "pending"}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>

            {/* Admin Status Change Buttons */}
            {isAdmin && reservation.status === "pending" && onStatusChange && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onStatusChange(reservation._id, "approved")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => onStatusChange(reservation._id, "rejected")}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition text-sm"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {editDialogOpen && (
        <ReservationDialog
          book={reservation.book}
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={{
            borrowDate: reservation.borrowDate,
            pickupDate: reservation.pickupDate,
          }}
          isEditing={true}
        />
      )}
    </>
  );
}
