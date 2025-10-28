// hooks/useAuth.ts
"use client";

import { useState } from "react";
import { User, authAPI } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authAPI.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authAPI.isAuthenticated()
  );

  return {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
  };
}
