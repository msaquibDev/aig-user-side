// middleware.js
import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // Set CORS headers
  response.headers.append(
    'Access-Control-Allow-Origin',
    'https://aig-user-side.vercel.app'
  )
  response.headers.append(
    'Access-Control-Allow-Origin',
    'http://localhost:3000'
  )
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  ) // Add other headers as needed
  response.headers.set('Access-Control-Allow-Credentials', 'true') // If using credentials

  // Handle preflight requests (OPTIONS)
}

export const config = {
  matcher: '/api/:path*', // Apply middleware to all API routes
}
