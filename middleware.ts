export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/app/profile', '/api/user/profile'],
};

