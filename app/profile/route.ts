import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user?.email });
  return NextResponse.json(user);
}
