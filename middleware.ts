import { decryptToken } from "@/lib/encryptDecryptToken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("auth_session");
  const pathname = req.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/upgrade");

  if (!session || !session.value) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const userId = await decryptToken(session.value);

    if (!userId) throw new Error("Invalid session token");

    const user = userId.length === 20;

    if (!user) throw new Error("No user found");

    // If already logged in and visiting an auth route, redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth error:", err);
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.delete("auth_session");
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/upgrade/:path*", "/auth/:path*"],
};
