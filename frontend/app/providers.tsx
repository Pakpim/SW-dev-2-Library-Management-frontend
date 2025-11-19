"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { BookProvider } from "@/contexts/BookContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider><BookProvider>{children}</BookProvider></AuthProvider>;
}
