// app/api/user/registration/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import Registration from "@/models/Registration";
import { authOptions } from "@/utils/authOptions";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fetch ALL paid registrations for this user
    const registrations = await Registration.find({
      user: user._id,
      isPaid: true,
    });

    return NextResponse.json(registrations, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/user/registration error:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations", details: error.message },
      { status: 500 }
    );
  }
}
