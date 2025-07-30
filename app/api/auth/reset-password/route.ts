import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { token, password } = await req.json();
  await connectDB();

  const resetToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return NextResponse.json({ message: 'Password has been reset successfully' });
}
