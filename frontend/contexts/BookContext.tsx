"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Book, bookAPI } from "@/lib/book";

interface BookContextType {
  books: Book[];
  fetchBooks: () => Promise<void>;
  createBook: (book: Omit<Book, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateBook: (id: string, data: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  loading: boolean;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
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

  const createBook = async (book: Omit<Book, "_id" | "createdAt" | "updatedAt">) => {
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

  return (
    <BookContext.Provider
      value={{ books, fetchBooks, createBook, updateBook, deleteBook, loading }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBookContext() {
  const context = useContext(BookContext);
  if (!context)
    throw new Error("useBookContext must be used inside BookProvider");
  return context;
}
