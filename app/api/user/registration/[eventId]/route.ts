// app/api/user/registration/[eventId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import User from "@/models/User";
import MealPreference from "@/models/MealPreference";
import RegistrationCategory from "@/models/RegistrationCategory";
import axios from "axios";

/**
 * @route   POST /api/user/registration/[eventId]
 * @desc    Create a new event registration (unpaid initially)
 * @access  Authenticated users only
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
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

    const { eventId } = await context.params;
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID required in URL" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // 🔹 Validate mealPreference
    let mealName = null;
    if (body.mealPreference) {
      const meal = await MealPreference.findOne({
        mealName: body.mealPreference,
      });
      if (!meal) {
        return NextResponse.json(
          { error: `Invalid mealPreference name: ${body.mealPreference}` },
          { status: 400 }
        );
      }
      mealName = meal.mealName; //  store name only
    }

    // 🔹 Validate registrationCategory
    let categoryName = null;
    if (body.registrationCategory) {
      const category = await RegistrationCategory.findOne({
        categoryName: body.registrationCategory,
      });
      if (!category) {
        return NextResponse.json(
          {
            error: `Invalid registrationCategory name: ${body.registrationCategory}`,
          },
          { status: 400 }
        );
      }
      categoryName = category.categoryName; // store name only
    }

    // 🔹 Fetch event details from Admin repo API (using eventId)
    let eventData: {
      eventName?: string;
      eventCode?: string;
      eventImage?: string;
    } = {};
    try {
      const eventUrl = new URL(
        `/api/events/${eventId}`,
        process.env.ADMIN_API_BASE_URL // must be defined in your env
      );
      const eventRes = await axios.get(eventUrl.toString());

      eventData = {
        eventName: eventRes.data?.data?.eventName,
        eventCode: eventRes.data?.data?.eventCode,
        eventImage: eventRes.data?.data?.eventImage,
      };
    } catch (err) {
      console.error("Failed to fetch event details from Admin API:", err);
    }

    // 🔹 Create new registration (store strings instead of ObjectId)
    const newRegistration = await Registration.create({
      user: user._id,
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

      // Preferences (store as string names)
      mealPreference: mealName,
      registrationCategory: categoryName,

      // Event info (store id + name + code + image)
      eventId,
      eventName: eventData.eventName,
      eventCode: eventData.eventCode,
      eventImage: eventData.eventImage,
      isPaid: false,
      regNumGenerated: false,
    });

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
      { error: "Failed to create registration", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * @route   GET /api/user/registration/[eventId]
 * @desc    Get the logged-in user’s registrations for a specific event
 * @access  Authenticated users only
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
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

    const { eventId } = await context.params;
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID required in URL" },
        { status: 400 }
      );
    }

    // Fetch registrations (no populate needed since we store strings)
    const registrations = await Registration.find({
      user: user._id,
      eventId,
      isPaid: true,
    });

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error: any) {
    console.error("GET /registration error:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations", details: error.message },
      { status: 500 }
    );
  }
}
