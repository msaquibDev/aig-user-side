// app/api/user/registration/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import type { NextRequest } from "next/server";

//  POST /api/user/registration → create new registration
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const newRegistration = await Registration.create({
      user: token.id, // logged-in user
      prefix: body.prefix,
      fullName: body.fullName,
      mobile: body.mobile,
      email: body.email,
      affiliation: body.affiliation,
      designation: body.designation,
      medicalCouncilRegistration: body.medicalCouncilRegistration,
      medicalCouncilState: body.medicalCouncilState,
      address: body.address,
      country: body.country,
      state: body.state,
      city: body.city,
      pincode: body.pincode,
      mealPreference: body.mealPreference, // ObjectId
      gender: body.gender,
      registrationCategory: body.registrationCategory, // ObjectId
      eventId: body.eventId, // only ObjectId of event
      isPaid: body.isPaid ?? false,
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

//  GET /api/user/registration → get all registrations of logged-in user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const registrations = await Registration.find({ user: token.id })
      .populate("mealPreference")
      .populate("registrationCategory")
      .populate("eventId"); // populate Event model for details

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error: any) {
    console.error("GET /registration error:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations", details: error.message },
      { status: 500 }
    );
  }
}
