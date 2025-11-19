// components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "member" | "admin";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (loading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // Check if user has required role
    // Admin can access both member and admin routes
    if (
      requiredRole === "member" &&
      user.role !== "member" &&
      user.role !== "admin"
    ) {
      router.push("/books");
      return;
    }

    // Only admin can access admin routes
    if (requiredRole === "admin" && user.role !== "admin") {
      router.push("/books");
      return;
    }
  }, [isAuthenticated, user, requiredRole, router, loading]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  // Check role
  if (requiredRole === "admin" && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Access Denied - Admin Only</p>
      </div>
    );
  }

  if (
    requiredRole === "member" &&
    user.role !== "member" &&
    user.role !== "admin"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Access Denied - Members Only</p>
      </div>
    );
  }

  return <>{children}</>;
}
