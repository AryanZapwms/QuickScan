// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Initialize NextAuth with Edge-safe config
const { auth } = NextAuth(authConfig);

// Note: DB Connection removed from middleware because standard Mongoose cannot run on Edge Runtime.
// Maintenance mode check temporarily disabled/removed for stability.

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  console.log(`Middleware checking: ${pathname}`);

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    console.log("Admin route detected, checking auth...");

    if (!session) {
      console.log('No session, redirecting to login');
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    }

    // Check if user has admin, lab-admin, or super-admin role
    const userRole = session.user?.role as string;
    const allowedRoles = ["admin", "lab-admin", "super-admin"];
    
    if (!allowedRoles.includes(userRole)) {
      console.log(`User role ${userRole} not authorized for admin area`);
      const url = new URL("/", request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    console.log(`Admin access granted for role: ${userRole}`);
  }

  // Protect Booking Routes (Auth Wall)
  if (pathname.startsWith("/booking")) {
    if (!session) {
      console.log('Booking access attempt without session, redirecting to login');
      const url = new URL('/login', request.url); // Assuming public login is at /login
      url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      url.searchParams.set('reason', 'booking');
      return NextResponse.redirect(url);
    }
  }

  // Super admin only routes
  const superAdminRoutes = [
    "/admin/users",
    "/admin/admins", 
    "/admin/system",
    "/api/admin/users",
    "/api/admin/admins",
    "/api/admin/system"
  ];
  
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));
  
  if (isSuperAdminRoute) {
    if (!session || session.user?.role !== "super-admin") {
      console.log("Super admin required for this route");
      const url = new URL("/admin", request.url);
      url.searchParams.set("error", "super-admin-required");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/:path*", // Check all routes
  ],
};