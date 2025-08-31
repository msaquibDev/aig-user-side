// app/api/user/registration/[eventId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import User from "@/models/User";

export async function POST(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    if (!params.eventId) {
      return NextResponse.json({ error: "Event ID required in URL" }, { status: 400 });
    }

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
      mealPreference: body.mealPreference,
      gender: user.gender || body.gender,
      registrationCategory: body.registrationCategory,
      eventId: params.eventId,
      isPaid: false,
      regNumGenerated: false,
    });

    return NextResponse.json(
      { message: "Registration created (unpaid). Proceed to payment.", registration: newRegistration },
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
