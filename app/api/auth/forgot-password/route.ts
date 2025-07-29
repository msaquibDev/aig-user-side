import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: Request) {
  const { email } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const token = crypto.randomBytes(20).toString('hex');
  const resetToken = crypto.createHash('sha256').update(token).digest('hex');

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await sendEmail(user.email, 'Password Reset', `<p>Reset your password: <a href="${resetUrl}">Click here</a></p>`);

  return NextResponse.json({ message: 'Reset email sent' });
}
