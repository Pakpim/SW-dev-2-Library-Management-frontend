"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminBooksManagePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📕 Admin Book Management
        </h1>
      </div>
    </ProtectedRoute>
  );
}
