"use client";

import { useState } from "react";
import { Book } from "@/lib/book";

interface ReservationDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (borrowDate: string, pickupDate: string) => void;
  initialData?: {
    borrowDate: string;
    pickupDate: string;
  };
  isEditing?: boolean;
}

export default function ReservationDialog({
  book,
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: ReservationDialogProps) {
  const today = new Date().toISOString().split("T")[0];
  const [borrowDate, setBorrowDate] = useState(
    initialData
      ? new Date(initialData.borrowDate).toISOString().split("T")[0]
      : today
  );
  const [pickupDate, setPickupDate] = useState(
    initialData
      ? new Date(initialData.pickupDate).toISOString().split("T")[0]
      : today
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate dates
    const borrow = new Date(borrowDate);
    const pickup = new Date(pickupDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (borrow < now) {
      setError("Reservation date cannot be before today");
      return;
    }

    if (pickup < now) {
      setError("Pickup date cannot be before today");
      return;
    }

    if (pickup < borrow) {
      setError("Pickup date must not be earlier than reservation date");
      return;
    }

    onSubmit(borrowDate, pickupDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isEditing ? "Edit Reservation" : "Reserve Book"}
        </h2>

        {/* Book Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600">Author: {book.author}</p>
          <p className="text-sm text-gray-600">ISBN: {book.ISBN}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Borrow Date */}
          <div>
            <label
              htmlFor="borrowDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reservation Date
            </label>
            <input
              type="date"
              id="borrowDate"
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              min={today}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pickup Date */}
          <div>
            <label
              htmlFor="pickupDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pickup Date
            </label>
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={today}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md">
            <p className="font-medium mb-1">Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>This is a reservation request</li>
              <li>Admin approval required</li>
              <li>Maximum 3 active reservations allowed</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              {isEditing ? "Update" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
