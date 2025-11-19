"use client";

import BookCreateDialog from "@/components/BookCreateDialog";
import BookEditDialog from "@/components/BookEditDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBookContext } from "@/contexts/BookContext";
import { Book } from "@/lib/book";
import { useEffect, useState } from "react";

export default function AdminBooksManagePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const { books, fetchBooks, createBook, updateBook, deleteBook, loading } =
    useBookContext();

  useEffect(() => {
    fetchBooks();
  }, []);

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

    setFilteredBooks(filtered);
  }, [books, searchTerm]);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📕 Admin Book Management
        </h1>
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
          </div>
          <BookCreateDialog createBook={createBook} books={books} />
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
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
              </div>

              {/* edit */}
              <div className="p-4 border-t border-gray-200 flex space-x-2">
                <BookEditDialog
                  books={books}
                  book={book}
                  updateBook={updateBook}
                />
                {/* <BookEditDialog
                  book={book}
                  books={books}
                  updateBook={updateBook}
                /> */}
                <button
                  className="flex-1 px-4 py-2 text-white rounded-md bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete "${book.title}"?`
                      )
                    ) {
                      deleteBook(book._id);
                    }
                  }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
