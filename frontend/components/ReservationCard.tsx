"use client";

import { ReservationInfo } from "@/lib/reservation";
import { useState } from "react";

interface ReservationCardProps {
  reservation: ReservationInfo;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReservationCard({
  reservation,
  onEdit,
  onDelete,
}: ReservationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      setIsDeleting(true);
      onDelete(reservation._id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Book Cover */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={reservation.book.coverPicture}
          alt={reservation.book.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {reservation.book.title}
        </h3>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-700">User:</span>{" "}
            {reservation.user.name}
          </p>
          <p>
            <span className="font-medium text-gray-700">Start Date:</span>{" "}
            {new Date(reservation.borrowDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium text-gray-700">Pickup Date:</span>{" "}
            {new Date(reservation.pickupDate).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(reservation._id)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition">
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50">
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
