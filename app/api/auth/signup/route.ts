import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  const { email, password, fullname, prefix, affiliation, country, mobile } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  const newUser = await User.create({ email, password, fullname, prefix, affiliation, country, mobile });
  return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
}
