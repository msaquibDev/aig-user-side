// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes without login
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/public") // add your public APIs here
  ) {
    return NextResponse.next();
  }

  // ✅ Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Redirect to login if no session
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url); // redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  }

  // ✅ Default: continue request
  const response = NextResponse.next();

  // ---- OPTIONAL: add your CORS handling ----
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://aig-user-side.vercel.app"
  );
  response.headers.append(
    "Access-Control-Allow-Origin",
    "http://localhost:3000"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"], // protect these paths
};
