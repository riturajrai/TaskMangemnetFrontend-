import { NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile", "/settings"];

// Middleware function
export function middleware(request) {
  const token = request.cookies.get("token")?.value || null;

  // Check if the requested path is a protected route
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      // Redirect to login if no token, preserving the intended URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optionally verify token with backend (uncomment if needed)
    /*
    try {
      const response = await fetch(`${process.env.API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    */
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};