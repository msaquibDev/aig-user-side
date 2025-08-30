// app/api/user/payment/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import RegistrationCategory from "@/models/RegistrationCategory";
import Payment from "@/models/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions"; // adjust path if needed
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: "registrationId is required" },
        { status: 400 }
      );
    }

    // Find registration and populate category
    const registration = await Registration.findById(registrationId).populate({
      path: "registrationCategory",
      model: RegistrationCategory,
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    const category: any = registration.registrationCategory;
    if (!category || typeof category.amount !== "number") {
      return NextResponse.json(
        { success: false, message: "Invalid registration amount" },
        { status: 400 }
      );
    }

    // Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Order options
    const options = {
      amount: category.amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${registration._id.toString()}`,
      notes: {
        registrationId: registration._id.toString(),
        category: category.categoryName,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create a Payment record with status "initiated"
    const payment = await Payment.create({
      registration: new mongoose.Types.ObjectId(registrationId),
      user: new mongoose.Types.ObjectId(session.user.id),
      amount: category.amount,
      currency: "INR",
      status: "initiated",
      paymentProvider: "razorpay",
      transactionId: order.id, // Razorpay order id as transaction ref
    });

    return NextResponse.json({
      success: true,
      order,
      registrationId: registration._id.toString(),
      paymentId: payment._id.toString(),
    });
  } catch (err: any) {
    console.error("Order Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
