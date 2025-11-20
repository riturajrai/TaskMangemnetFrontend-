// middleware.js → BEST & SIMPLE FIX

import { NextResponse } from "next/server";

export default function middleware(req) {
  // DEVELOPMENT MEIN MIDDLEWARE KO SKIP KAR DO
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const token = req.cookies.get("token");

  if (isProtected && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};