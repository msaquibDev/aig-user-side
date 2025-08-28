import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RegistrationCategory from "@/models/RegistrationCategory";

//  POST: Create a new registration category
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { categoryName, amount } = body;

    if (!categoryName || !amount) {
      return NextResponse.json(
        { success: false, message: "Category Name and Amount are required" },
        { status: 400 }
      );
    }

    const newCategory = new RegistrationCategory({ categoryName, amount });
    await newCategory.save();

    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST Error:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

//  GET: Fetch all registration categories
export async function GET() {
  try {
    await connectDB();
    const categories = await RegistrationCategory.find();

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET Error:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
