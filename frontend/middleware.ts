import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get auth data from cookies (we'll need to store token in cookies too)
  // For now, we'll check on client side

  // Public routes accessible to everyone
  const publicRoutes = ["/", "/books"];

  // Auth routes (login/register) - should redirect to /books if already logged in
  const authRoutes = ["/login", "/register"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Auth routes will be handled on client side (we'll add checks in the page components)
  if (authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes will be handled by ProtectedRoute component on client side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
