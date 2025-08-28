import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration, { RegistrationCategory } from "@/models/Registration";
import User from "@/models/User";
import { getServerSession } from "next-auth"; // assuming next-auth is used
import { authOptions } from "@/utils/authOptions";

/**
 * GET - Fetch user info + available registration categories
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    //  Get logged-in user (using session)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id).select(
      "prefix fullname email mobile affiliation designation medicalCouncilState medicalCouncilRegistration gender country city state pincode mealPreference"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    //  Build categories list from enum
    const categories = Object.entries(RegistrationCategory).map(
      ([key, value]) => ({
        name: key,
        amount: value,
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        user,
        categories,
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST - Save registration form
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate category
    if (!body.registrationCategory) {
      return NextResponse.json(
        { success: false, message: "Registration Category is required" },
        { status: 400 }
      );
    }

    //  Auto-attach logged-in user id
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const registration = new Registration({
      ...body,
      user: session.user.id,
    });

    await registration.save(); // auto-sets registrationAmount via hook

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
