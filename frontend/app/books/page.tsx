"use client";

import { useBookContext } from "@/contexts/BookContext";
import { useReservationContext } from "@/contexts/ReservationContext";
import { Book } from "@/lib/book";
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "member" | "admin";
    };
  }
}

interface User {
  id: string;
  name: string;
  role: "member" | "admin";
}

export default function BooksPage() {
  const { data: session } = useSession();

  // const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");
  const [reservingBookId, setReservingBookId] = useState<string | null>(null);
  const [reservationCount, setReservationCount] = useState(0);
  const {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  } = useReservationContext();
  const { books, fetchBooks } = useBookContext();

  useEffect(() => {
    fetchReservations();
    setReservationCount(reservations.length);
    setIsLoading(false);
  }, []);

  // Fetch user from localStorage
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name ?? "customer",
        role: session.user.role as "member" | "admin",
      });
    }
  }, [session]);

  // Fetch books from backend
  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books when search/filter terms change
  useEffect(() => {
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
  }, [books, searchTerm, authorFilter, publisherFilter]);

  // const fetchBooks = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch("http://localhost:5000/api/v1/books", {
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch books");
  //     }

  //     const data = await response.json();
  //     setBooks(data.data || data || []);
  //     setError("");
  //   } catch (err) {
  //     setError("Failed to load books. Please try again later.");
  //     console.error("Error fetching books:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleReserveBook = async (bookId: string) => {
    const today = new Date();
    const borrowDate = today.toDateString();
    createReservation({
      book: bookId,
      borrowDate: borrowDate,
      pickupDate: borrowDate,
    });
    setReservationCount(reservationCount + 1);
    return;
    if (!user) {
      alert("Please login to reserve books");
      return;
    }

    try {
      setReservingBookId(bookId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/v1/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ book: bookId }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to reserve book");
        return;
      }

      alert("Book reserved successfully!");
      fetchBooks();
    } catch (err) {
      alert("An error occurred while reserving the book");
      console.error("Reservation error:", err);
    } finally {
      setReservingBookId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        📖 Available Books
      </h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

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
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
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
                    }>
                    {book.availableAmount}
                  </span>
                </p>
                <p>
                  test {user?.id ?? "no"} {user?.role}
                </p>
                {/* Reserve Button (for members only) */}
                {user && user.role === "member" && (
                  <button
                    onClick={() => handleReserveBook(book._id)}
                    disabled={
                      book.availableAmount === 0 ||
                      reservations.filter((r) => {
                        r.book === book;
                      }).length > 0 ||
                      reservationCount >= 3
                    }
                    className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                    {reservingBookId === book._id ? "Reserving..." : "Reserve"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
