"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { BookProvider } from "@/contexts/BookContext";
import { ReservationProvider } from "@/contexts/ReservationContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SessionProvider>
        <BookProvider>
          <ReservationProvider>{children}</ReservationProvider>
        </BookProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
