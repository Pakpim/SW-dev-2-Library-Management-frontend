import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // Public routes - accessible to everyone
  const publicRoutes = [
    "/",
    "/books",
    "/login",
    "/register",
    "/auth/login",
    "/auth/register",
  ];

  // Admin routes
  const adminRoutes = ["/admin"];

  // Member routes
  const memberRoutes = ["/my-reservations", "/user"];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // If route is public, allow access
  if (isPublicRoute) {
    // Redirect authenticated users away from login/register
    if (
      session &&
      (pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/auth/login" ||
        pathname === "/auth/register")
    ) {
      return NextResponse.redirect(new URL("/books", request.url));
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected route
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/books", request.url));
    }
    return NextResponse.next();
  }

  // Check member routes
  if (memberRoutes.some((route) => pathname.startsWith(route))) {
    if (session.user?.role !== "member") {
      return NextResponse.redirect(new URL("/books", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
