import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { token: string } }) {
  await connectDB();
  const resetToken = crypto.createHash('sha256').update(params.token).digest('hex');
  const { password } = await req.json();

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return NextResponse.json({ message: 'Password reset successful' });
}
