// app/api/user/payment/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Payment from "@/models/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";

/**
 * POST /api/user/payment/order
 * → Create a Razorpay order for a registration
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { registrationId } = await req.json();
    if (!registrationId) {
      return NextResponse.json({ success: false, message: "registrationId is required" }, { status: 400 });
    }

    // Fetch registration
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
    }

    // Example: Amount based on registration category (you can adjust)
    const amount = 5000; // You may fetch dynamically from RegistrationCategory if needed

    // Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Razorpay order options
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${registration._id.toString()}`,
      notes: {
        registrationId: registration._id.toString(),
        fullName: registration.fullName,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create payment record in DB
    const payment = await Payment.create({
      registration: registration._id,
      user: new mongoose.Types.ObjectId(session.user.id),
      amount,
      currency: "INR",
      status: "initiated",
      paymentProvider: "razorpay",
      transactionId: order.id, // Razorpay order ID
    });

    return NextResponse.json({
      success: true,
      order,
      registrationId: registration._id.toString(),
      paymentId: payment._id.toString(),
    });
  } catch (err: any) {
    console.error("Order Error:", err);
    return NextResponse.json({ success: false, message: err.message || "Something went wrong" }, { status: 500 });
  }
}
