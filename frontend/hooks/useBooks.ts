"use client";

import { useState } from "react";
import { Book, bookAPI } from "@/lib/book";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookAPI.getAll();
      setBooks(data);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (book: Omit<Book, "_id">) => {
    const result = await bookAPI.create(book);
    setBooks([...books, result]);
  };

  const updateBook = async (id: string, data: Partial<Book>) => {
    const updated = await bookAPI.update(id, data);
    setBooks(books.map((b) => (b._id === id ? updated : b)));
  };

  const deleteBook = async (id: string) => {
    await bookAPI.delete(id);
    setBooks(books.filter((b) => b._id !== id));
  };

  return {
    books,
    loading,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  };
}