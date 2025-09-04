// app/api/user/registration/[eventId]/[registrationId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import User from "@/models/User";

/**
 * @route   GET /api/user/registration/:eventId/:registrationId
 * @desc    Get a single registration by eventId + registrationId
 * @access  Authenticated users only
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ eventId: string; registrationId: string }> }
) {
  
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

    const { eventId, registrationId } = await context.params;

    if (!eventId || !registrationId) {
      return NextResponse.json(
        { error: "Both eventId and registrationId are required in URL" },
        { status: 400 }
      );
    }

    const registration = await Registration.findOne({
      _id: registrationId,
      user: user._id,
      eventId: eventId,
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ registration }, { status: 200 });
  } catch (error: any) {
    console.error("GET /registration/:eventId/:registrationId error:", error);
    return NextResponse.json(
      { error: "Failed to fetch registration", details: error.message },
      { status: 500 }
    );
  }
}
