// app/api/user/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Registration from "@/models/Registration";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, registrationId } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !registrationId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify with Razorpay API
    const authHeader =
      "Basic " +
      Buffer.from(
        process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET
      ).toString("base64");

    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        method: "GET",
        headers: { Authorization: authHeader },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to verify payment with Razorpay" },
        { status: 400 }
      );
    }

    const paymentData = await response.json();

    // Cross-check order_id matches
    if (paymentData.order_id !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: "Order ID mismatch" },
        { status: 400 }
      );
    }

    // Update existing Payment record
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      {
        $set: {
          status: paymentData.status === "captured" ? "success" : "failed",
          transactionId: razorpay_payment_id,
        },
      },
      { new: true }
    );

    if (!updatedPayment) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      );
    }

    // Mark Registration as paid if successful
    if (updatedPayment.status === "success") {
      await Registration.findByIdAndUpdate(
        new mongoose.Types.ObjectId(registrationId),
        { $set: { isPaid: true } }
      );
    }

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (err: any) {
    console.error("Verify Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
