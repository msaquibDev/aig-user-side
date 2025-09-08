// app/api/user/payment/[paymentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    await connectDB();

    const { paymentId } = params;
    if (!paymentId) {
      return NextResponse.json(
        { success: false, message: "Payment ID is required" },
        { status: 400 }
      );
    }

    // 🔹 Find payment record
    const payment = await Payment.findById(paymentId)
      .populate("registration", "fullName eventId eventCode")
      .populate("user", "name email");

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    // 🔹 Optional: Fetch Razorpay payment details (live data)
    let razorpayDetails = {};
    if (payment.razorpayPaymentId) {
      const authHeader =
        "Basic " +
        Buffer.from(
          process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET
        ).toString("base64");

      const res = await fetch(
        `https://api.razorpay.com/v1/payments/${payment.razorpayPaymentId}`,
        { headers: { Authorization: authHeader } }
      );

      if (res.ok) {
        razorpayDetails = await res.json();
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        _id: payment._id,
        user: payment.user,
        registration: payment.registration,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentProvider: payment.paymentProvider,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        razorpaySignature: payment.razorpaySignature,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        razorpayDetails, // live Razorpay API response if available
      },
    });
  } catch (err: any) {
    console.error("Payment Details Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
