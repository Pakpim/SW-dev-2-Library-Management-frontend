import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes - no auth required
  const publicRoutes = ["/", "/books", "/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, we check on client side via useAuth hook
  // This middleware just passes through to client components

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
