import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("cvet_token")?.value;
  const user = token ? verifyToken(token) : null;

  // 1. Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. User Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Prevent logged-in users from seeing login page repeatedly
  if (pathname === "/login") {
    if (user) {
      if (user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/dashboard/:path*",
    "/dashboard",
    "/login",
  ],
};
