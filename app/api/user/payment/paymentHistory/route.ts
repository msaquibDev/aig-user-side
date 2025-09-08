import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

// ✅ Import Razorpay Node SDK
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email }).select(
      "_id"
    );
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Get user payments from DB
    const userPayments = await Payment.find({ user: user._id })
      .populate({ path: "registration", select: "fullName eventId eventCode" })
      .populate({ path: "user", select: "name email", model: "User" })
      .sort({ createdAt: -1 });

    // ✅ Fetch extra Razorpay details for each payment (if razorpayPaymentId exists)
    const paymentsWithDetails = await Promise.all(
      userPayments.map(async (p) => {
        if (p.razorpayPaymentId) {
          try {
            const razorpayPayment = await razorpay.payments.fetch(
              p.razorpayPaymentId
            );

            return {
              ...p.toObject(),
              razorpayDetails: razorpayPayment, // 🔹 includes method, bank, wallet, vpa etc.
            };
          } catch (error) {
            console.error(
              `Error fetching Razorpay details for ${p.razorpayPaymentId}:`,
              error
            );
            return p.toObject();
          }
        }
        return p.toObject();
      })
    );

    return NextResponse.json({ success: true, payments: paymentsWithDetails });
  } catch (err: any) {
    console.error("Fetch Payment History Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
