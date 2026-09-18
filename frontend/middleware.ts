/**
 * Ascendia AI — Next.js Middleware
 *
 * Protects routes by checking for the session cookie.
 * Admin routes additionally require role=admin (checked via API).
 *
 * Route categories:
 *   PUBLIC:    /  /login  /signup  → no redirect
 *   PROTECTED: /dashboard /assessments /practice /submissions /settings → require session
 *   ADMIN:     /admin → require session + admin role
 */

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ascendia_session";

const PUBLIC_PATHS = ["/", "/login", "/signup"];
const PROTECTED_PREFIXES = ["/dashboard", "/assessments", "/practice", "/submissions", "/settings"];
const ADMIN_PREFIX = "/admin";

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname);
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith(ADMIN_PREFIX);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    /\.(ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  const hasSession = !!sessionCookie?.value;

  // Redirect authenticated users away from auth pages
  if (hasSession && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users from protected pages
  if (!hasSession && (isProtectedPath(pathname) || isAdminPath(pathname))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // For admin paths, verify admin role via /api/v1/auth/me
  // This is a lightweight check — the server enforces the real authorization
  if (hasSession && isAdminPath(pathname)) {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const meRes = await fetch(`${apiBase}/api/v1/auth/me`, {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
        signal: AbortSignal.timeout(3000),
      });
      if (meRes.ok) {
        const body = await meRes.json();
        if (!body?.data || body.data.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      // If the API is unreachable, redirect to dashboard gracefully
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images in /public
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
