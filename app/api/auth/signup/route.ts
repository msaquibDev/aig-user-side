import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email } = body;

    const userExists = await User.findOne({ email });
    if (userExists) return NextResponse.json({ error: 'Email Already Exist' }, { status: 400 });

    const newUser = new User(body);
    await newUser.save();

    return NextResponse.json({ message: 'User Registered successfully ' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
