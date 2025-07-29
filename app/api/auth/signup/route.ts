// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { fullname, email, password, prefix, mobile, affiliation, country } = await req.json();

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    // Create user
    const user = new User({ fullname, email, password, prefix, mobile, affiliation, country });
    await user.save();

    // Send welcome email
    await sendEmail(
      email,
      'Welcome to AIG Hospital',
      `<h3>Hello ${fullname},</h3><p>Your registration was successful!</p>`
    );

    return NextResponse.json({ message: 'User Registered successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
