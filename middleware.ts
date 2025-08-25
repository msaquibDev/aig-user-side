// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin") || "";

  // ✅ Allow OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  // ✅ Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/public")
  ) {
    return NextResponse.next();
  }

  // ✅ Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      console.warn("🚨 No token found, redirecting to /login", {
        pathname,
        origin,
      });

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ✅ Default: continue
  const res = NextResponse.next();
  applyCorsHeaders(res, origin);
  return res;
}

// ---- Helpers ----
function corsHeaders(origin: string) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://aig-user-side.vercel.app",
  ];

  // Also allow any Vercel preview domains
  const isPreview =
    origin.endsWith(".vercel.app") && origin.includes("aig-user-side");

  const finalOrigin =
    allowedOrigins.includes(origin) || isPreview ? origin : "";

  return {
    ...(finalOrigin && { "Access-Control-Allow-Origin": finalOrigin }),
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

function applyCorsHeaders(res: NextResponse, origin: string) {
  const headers = corsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    if (value) res.headers.set(key, value);
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/registration/:path*",
    "/abstract/:path*",
    "/travel/:path*",
    "/accommodation/:path*",
    "/presentation/:path*",
  ],
};
