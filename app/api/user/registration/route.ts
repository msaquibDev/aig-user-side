// app/api/user/registration/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import User from "@/models/User";
import type { NextRequest } from "next/server";

/**
 * POST /api/user/registration
 * Create a new registration
 * Prefill user data from logged-in User
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user data to prefill form
    const user = await User.findOne({ email: session.user.email }).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    // Ensure eventId and eventName are provided from admin side
    if (!body.eventId || !body.eventName) {
      return NextResponse.json(
        { error: "Event ID and Event Name are required" },
        { status: 400 }
      );
    }

    // Create registration using user data for prefill
    const newRegistration = await Registration.create({
      user: user._id,
      prefix: user.prefix,
      fullName: user.fullname,
      mobile: user.mobile,
      email: user.email,
      affiliation: user.affiliation,
      designation: user.designation || body.designation,
      medicalCouncilRegistration: user.medicalCouncilRegistration || body.medicalCouncilRegistration,
      medicalCouncilState: user.medicalCouncilState || body.medicalCouncilState,
      address: body.address,
      country: user.country,
      state: user.state || body.state,
      city: user.city || body.city,
      pincode: user.pincode || body.pincode,
      mealPreference: body.mealPreference, // ObjectId
      gender: user.gender || body.gender,
      registrationCategory: body.registrationCategory, // ObjectId
      eventId: body.eventId,
      eventName: body.eventName,
      isPaid: false, // default
    });

    return NextResponse.json(
      { message: "Registration created successfully", registration: newRegistration },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /registration error:", error);
    return NextResponse.json(
      { error: "Failed to create registration", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/registration
 * Get all registrations of logged-in user
 */
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

    const registrations = await Registration.find({ user: user._id })
      .populate("mealPreference")
      .populate("registrationCategory");

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error: any) {
    console.error("GET /registration error:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations", details: error.message },
      { status: 500 }
    );
  }
}
