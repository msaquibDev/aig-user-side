import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/authOptions'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import formidable, { Fields, Files, File } from 'formidable'
import cloudinary from '@/lib/cloudinary'
import fs from 'fs'

// Required for file uploads in App Router
export const dynamic = 'force-dynamic'

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper: Convert NextRequest → Node.js IncomingMessage-like object
async function requestToNodeRequest(req: NextRequest) {
  const reader = req.body?.getReader()
  const { Readable } = require('stream')

  const stream = new Readable({
    async read() {
      if (!reader) return this.push(null)
      const { done, value } = await reader.read()
      if (done) return this.push(null)
      this.push(Buffer.from(value))
    },
  })

  // Add headers, method, and url so formidable works
  stream.headers = Object.fromEntries(req.headers)
  stream.method = req.method
  stream.url = req.url

  return stream
}

// GET profile
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email }).select(
      '-password -resetPasswordToken -resetPasswordExpire'
    )

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}

// PUT profile (update)
export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Convert NextRequest to Node.js-compatible request
    const nodeReq = await requestToNodeRequest(req)

    // Parse multipart form data
    const { fields, files } = await new Promise<{
      fields: Fields
      files: Files
    }>((resolve, reject) => {
      const form = formidable({ multiples: false, keepExtensions: true })
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    // Convert all field values to strings (avoid CastError from arrays)
    const stringFields: Record<string, string> = {}
    for (const key in fields) {
      const value = fields[key]
      if (Array.isArray(value)) {
        stringFields[key] = value[0] ?? '' // take first value if array
      } else {
        stringFields[key] = value ?? ''
      }
    }

    let profilePictureUrl = stringFields.profilePicture || ''

    // Upload to Cloudinary if new file is provided
    if (files.profilePicture) {
      const fileData = Array.isArray(files.profilePicture)
        ? (files.profilePicture[0] as File)
        : (files.profilePicture as File)

      if (fileData.filepath) {
        const uploadRes = await cloudinary.uploader.upload(fileData.filepath, {
          folder: 'profile_pictures',
          resource_type: 'image',
        })

        profilePictureUrl = uploadRes.secure_url
        fs.unlinkSync(fileData.filepath) // remove temp file
      }
    }

    // Update user document
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { ...stringFields, profilePicture: profilePictureUrl },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire')

    return NextResponse.json(
      { message: 'Profile updated', user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
