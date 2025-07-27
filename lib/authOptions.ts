import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from './mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email }).select('+password');
        if (!user || !(await bcrypt.compare(credentials!.password, user.password))) {
          throw new Error('Invalid email or password');
        }

        return {
          id: String(user._id),
          email: user.email,
          name: user.fullname,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as { id: string; email: string; name: string };
      return session;
    },
  },
};
