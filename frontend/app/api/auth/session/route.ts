import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "next-auth.session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, user } = body;

    if (!token || !user) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Store session data in httpOnly cookie
    const sessionData = JSON.stringify({ token, user });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (!sessionCookie) {
      return NextResponse.json({ user: null, token: null });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    return NextResponse.json(sessionData);
  } catch {
    return NextResponse.json({ user: null, token: null });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
