import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import sendEmail from '@/utils/sendEmail';

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'No user found' }, { status: 404 });

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;
  await sendEmail({ to: email, subject: 'Reset Password', text: `Reset your password: ${resetUrl}` });

  return NextResponse.json({ message: 'Reset email sent' });
}
