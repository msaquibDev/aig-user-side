import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear session cookie (used by NextAuth)
    response.cookies.set('next-auth.session-token', '', {
      path: '/',
      expires: new Date(0),
    });

    // Also clear secure cookie for production (if used)
    response.cookies.set('__Secure-next-auth.session-token', '', {
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
