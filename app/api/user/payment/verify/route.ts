import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Registration from "@/models/Registration";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      registrationId,
    } = await req.json();

    //  Call Razorpay API to verify payment
    const authHeader =
      "Basic " +
      Buffer.from(
        process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET
      ).toString("base64");

    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to verify payment with Razorpay" },
        { status: 400 }
      );
    }

    const paymentData = await response.json();

    //  Cross-check order_id matches
    if (paymentData.order_id !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: "Order ID mismatch" },
        { status: 400 }
      );
    }

    //  Save Payment in DB
    const payment = await Payment.create({
      registration: registrationId,
      amount: paymentData.amount / 100, // convert paise to INR
      currency: paymentData.currency,
      status: paymentData.status,
      paymentProvider: "razorpay",
      transactionId: razorpay_payment_id,
    });

    //  Mark Registration as paid
    await Registration.findByIdAndUpdate(registrationId, {
      $set: { isPaid: true },
    });

    return NextResponse.json({ success: true, payment });
  } catch (err: any) {
    console.error("Verify Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
