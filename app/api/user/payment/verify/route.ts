// app/api/user/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Registration from "@/models/Registration";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { razorpay_order_id, razorpay_payment_id, registrationId } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !registrationId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Verify payment with Razorpay
    const authHeader =
      "Basic " + Buffer.from(process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET).toString("base64");

    const response = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });
    if (!response.ok) {
      return NextResponse.json({ success: false, message: "Failed to verify payment with Razorpay" }, { status: 400 });
    }

    const paymentData = await response.json();
    if (paymentData.order_id !== razorpay_order_id) {
      return NextResponse.json({ success: false, message: "Order ID mismatch" }, { status: 400 });
    }

    // Update payment record
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
      return NextResponse.json({ success: false, message: "Payment record not found" }, { status: 404 });
    }

    // If payment success → update registration
    if (updatedPayment.status === "success") {
      const registration = await Registration.findById(registrationId);
      if (!registration) {
        return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
      }

      // ✅ Fetch eventCode from admin repo
      const eventRes = await axios.get(`${process.env.ADMIN_API_BASE_URL}/events/${registration.eventId}`);
      const eventCode = eventRes.data?.eventCode;
      if (!eventCode) {
        return NextResponse.json({ success: false, message: "Event code not found from Admin" }, { status: 400 });
      }

      // Generate regNum
      const count = await Registration.countDocuments({ eventId: registration.eventId, regNumGenerated: true });
      const regNum = `${eventCode}-${count + 1}`;

      registration.isPaid = true;
      registration.regNum = regNum;
      registration.regNumGenerated = true;
      await registration.save();
    }

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (err: any) {
    console.error("Verify Error:", err);
    return NextResponse.json({ success: false, message: err.message || "Something went wrong" }, { status: 500 });
  }
}
