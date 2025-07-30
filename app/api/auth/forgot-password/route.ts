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
  const message = `
        <h3>Hello ${user.fullname},</h3>
        <p>You requested to reset your password.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 15 minutes.</p>
    `;

  await sendEmail(user.email, 'AIG Hospital Password Reset Request', message);

  return NextResponse.json({ message: 'Reset password email sent' });
}
