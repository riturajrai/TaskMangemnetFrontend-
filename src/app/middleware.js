// middleware.js (project root)
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const publicRoutes = ["/login", "/register", "/", "/about"];

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // Get the httpOnly cookie (server can read it)
  const userCookie = req.cookies.get("connect.sid") || req.cookies.get("token");

  if (isProtected && !userCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && userCookie && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};