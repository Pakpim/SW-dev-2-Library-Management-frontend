"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo and Books Link */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-blue-100 transition"
          >
            📚 LibManager
          </Link>
          <Link
            href="/books"
            className="hover:text-blue-100 transition font-medium"
          >
            Books
          </Link>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* User Info */}
              <div>
                <p className="font-medium">{user && user?.name}</p>
                <p className="text-blue-100 capitalize text-xs">
                  {user && user?.role}
                </p>
              </div>

              {/* Role-based Links */}
              {user.role === "member" && (
                <Link
                  href="/my-reservations"
                  className="hover:text-blue-100 transition font-medium"
                >
                  My Reservations
                </Link>
              )}

              {user.role === "admin" && (
                <>
                  <Link
                    href="/admin/books-manage"
                    className="hover:text-blue-100 transition font-medium"
                  >
                    Manage Books
                  </Link>
                  <Link
                    href="/admin/reservations"
                    className="hover:text-blue-100 transition font-medium"
                  >
                    Manage Reservations
                  </Link>
                </>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* No Auth - Login Link Only */}
              <Link
                href="/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition font-medium"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
