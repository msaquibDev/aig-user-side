import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    //  Only check registrationCategory (not amount)
    if (!body.registrationCategory) {
      return NextResponse.json(
        { success: false, message: "Registration Category is required" },
        { status: 400 }
      );
    }

    const registration = new Registration(body);
    await registration.save(); // hook will auto-fill registrationAmount

    return NextResponse.json(
      { success: true, data: registration },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
