import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from '@/lib/mongodb'
import Registration from "@/models/Registration";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { registrationId } = await req.json();

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: registration.registrationAmount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${registration._id}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("Order Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
