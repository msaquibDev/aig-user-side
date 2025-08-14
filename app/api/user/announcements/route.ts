// app/api/user/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Announcement from "@/models/Announcements";
import mongoose from "mongoose";

// 📌 GET: Fetch all announcements
export async function GET() {
  try {
    await connectDB();

   const count = await Announcement.countDocuments();
   const dbName = mongoose.connection.name;

   // Log to Vercel server logs
   console.log("Connected to DB:", dbName);
   console.log("Total announcements:", count);

    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: announcements },
      { status: 200 }
    );
    return NextResponse.json(
      { success: true, data: announcements },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Announcements Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// 📌 POST: Create a new announcement
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, description, author } = await req.json();

    // Basic validation
    if (!title || !description || !author) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newAnnouncement = await Announcement.create({
      title,
      description,
      author,
    });

    return NextResponse.json(
      { success: true, data: newAnnouncement },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Announcement Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
