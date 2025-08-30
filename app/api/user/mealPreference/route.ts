import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MealPreference from "@/models/MealPreference";

//  POST: Create Meal Preference
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.mealName) {
      return NextResponse.json(
        { success: false, message: "Meal Preference is required" },
        { status: 400 }
      );
    }

    const meal = new MealPreference({
      mealName: body.mealName,
    });

    await meal.save();

    return NextResponse.json(
      { success: true, data: meal },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating meal preference:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

//  GET: Fetch all Meal Preferences
export async function GET() {
  try {
    await connectDB();
    const meals = await MealPreference.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: meals },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching meal preferences:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
