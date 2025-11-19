"use client";

import { useBookContext } from "@/contexts/BookContext";
import { useReservationContext } from "@/contexts/ReservationContext";
import { Book } from "@/lib/book";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import ReservationDialog from "@/components/ReservationDialog";

export default function BooksPage() {
  const { user } = useAuth();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { reservations, fetchReservations, createReservation } =
    useReservationContext();
  const { books, fetchBooks } = useBookContext();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchReservations(), fetchBooks()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter books when search/filter terms change (using useMemo would be better)
  useEffect(() => {
    const filterBooks = () => {
      let filtered = books;

      // Search by title or ISBN
      if (searchTerm) {
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.ISBN.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by author
      if (authorFilter) {
        filtered = filtered.filter((book) =>
          book.author.toLowerCase().includes(authorFilter.toLowerCase())
        );
      }

      // Filter by publisher
      if (publisherFilter) {
        filtered = filtered.filter((book) =>
          book.publisher.toLowerCase().includes(publisherFilter.toLowerCase())
        );
      }

      setFilteredBooks(filtered);
    };

    filterBooks();
  }, [books, searchTerm, authorFilter, publisherFilter]);

  const handleReserveBook = async (bookId: string) => {
    const book = books.find((b) => b._id === bookId);
    if (!book) return;

    setSelectedBook(book);
    setReservationDialogOpen(true);
  };

  const handleReservationSubmit = async (
    borrowDate: string,
    pickupDate: string
  ) => {
    if (!selectedBook || !user) return;

    // Check if user has already reached limit (pending or approved only)
    const activeReservations = reservations.filter(
      (r) => r.status === "pending" || r.status === "approved"
    );

    if (activeReservations.length >= 3) {
      alert("You have reached the maximum of 3 active reservations");
      return;
    }

    try {
      await createReservation({
        book: selectedBook._id,
        borrowDate,
        pickupDate,
        status: "pending",
      });

      alert(
        "Reservation request submitted successfully! Awaiting admin approval."
      );
      await fetchReservations();
      await fetchBooks();
      setReservationDialogOpen(false);
      setSelectedBook(null);
    } catch (err) {
      alert("Failed to create reservation request");
      console.error("Reservation error:", err);
    }
  };

  // Check if user has an active reservation for a specific book
  const hasActiveReservationForBook = (bookId: string): boolean => {
    return reservations.some(
      (r) =>
        r.book?._id === bookId &&
        (r.status === "pending" || r.status === "approved")
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        📖 Available Books
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Title or ISBN
            </label>
            <input
              type="text"
              placeholder="Enter title or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Author Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Author
            </label>
            <input
              type="text"
              placeholder="Enter author name..."
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Publisher Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Publisher
            </label>
            <input
              type="text"
              placeholder="Enter publisher name..."
              value={publisherFilter}
              onChange={(e) => setPublisherFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Book Cover */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={book.coverPicture}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src =
                      "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22150%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22150%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                \{" "}
              </div>

              {/* Book Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Publisher:</span>{" "}
                  {book.publisher}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">ISBN:</span> {book.ISBN}
                </p>
                <p className="text-sm font-semibold">
                  Available:{" "}
                  <span
                    className={
                      book.availableAmount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {book.availableAmount}
                  </span>
                </p>

                {/* Reserve Button (for members only) */}
                {user &&
                  user.role === "member" &&
                  !hasActiveReservationForBook(book._id) && (
                    <button
                      onClick={() => handleReserveBook(book._id)}
                      disabled={
                        reservations.filter(
                          (r) =>
                            r.status === "pending" || r.status === "approved"
                        ).length >= 3
                      }
                      className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      Reserve
                    </button>
                  )}

                {/* Already Reserved Badge */}
                {user &&
                  user.role === "member" &&
                  hasActiveReservationForBook(book._id) && (
                    <div className="w-full mt-4 py-2 px-4 bg-green-100 text-green-700 font-medium rounded-md text-center">
                      Already Reserved
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Dialog */}
      {selectedBook && (
        <ReservationDialog
          book={selectedBook}
          isOpen={reservationDialogOpen}
          onClose={() => {
            setReservationDialogOpen(false);
            setSelectedBook(null);
          }}
          onSubmit={handleReservationSubmit}
        />
      )}
    </div>
  );
}
