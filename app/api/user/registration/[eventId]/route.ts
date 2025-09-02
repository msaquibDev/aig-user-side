// app/api/user/registration/[eventId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import User from "@/models/User";

/**
 * @route   POST /api/user/registration/[eventId]
 * @desc    Create a new event registration (unpaid initially)
 * @access  Authenticated users only
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    //  Connect to MongoDB
    await connectDB();

    //  Get user session from NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  Fetch user details from DB
    const user = await User.findOne({ email: session.user.email }).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //  Ensure eventId is passed
    if (!params.eventId) {
      return NextResponse.json(
        { error: "Event ID required in URL" },
        { status: 400 }
      );
    }

    //  Parse request body
    const body = await req.json();

    //  Create a new registration (unpaid state initially)
    const newRegistration = await Registration.create({
      user: user._id, // Link registration to user
      prefix: user.prefix,
      fullName: user.fullname,
      gender: user.gender || body.gender,

      // Contact info
      mobile: user.mobile,
      email: user.email,
      address: body.address,
      country: user.country,
      state: user.state || body.state,
      city: user.city || body.city,
      pincode: user.pincode || body.pincode,

      // Professional details
      affiliation: user.affiliation,
      designation: user.designation || body.designation,
      medicalCouncilRegistration:
        user.medicalCouncilRegistration || body.medicalCouncilRegistration,
      medicalCouncilState: user.medicalCouncilState || body.medicalCouncilState,

      // Preferences
      mealPreference: body.mealPreference,
      registrationCategory: body.registrationCategory,

      // Event info
      eventId: params.eventId,
      isPaid: false, // Payment pending
      regNumGenerated: false, // Will be generated later
    });

    //  Send success response
    return NextResponse.json(
      {
        message: "Registration created (unpaid). Proceed to payment.",
        registration: newRegistration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /registration error:", error);

    return NextResponse.json(
      {
        error: "Failed to create registration",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
