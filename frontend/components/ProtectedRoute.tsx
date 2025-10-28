// components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "member" | "admin";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // Check if user has required role
    if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
      router.push("/books");
    }
  }, [isAuthenticated, user, requiredRole, router]);

  // Show loading state
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Check role
  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Access Denied</p>
      </div>
    );
  }

  return <>{children}</>;
}
