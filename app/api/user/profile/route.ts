import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import * as formidable from 'formidable';
import type { Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Required for file uploads

// Disable Next.js body parsing for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET /api/user/profile
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select('-password -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data including file (profilePicture)
    const formData = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      const form = formidable.default({
        multiples: false,
        uploadDir: path.join(process.cwd(), '/public/uploads'),
        keepExtensions: true,
      });

      form.parse(req as any, (err: any, fields: Fields, files: Files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });


    const { fields, files } = formData;

    const profilePicturePath = files.profilePicture
      ? `/uploads/${path.basename(files.profilePicture[0].filepath)}`
      : fields.profilePicture || '';

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...fields,
        profilePicture: profilePicturePath,
      },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire');

    return NextResponse.json({ message: 'Profile updated', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
