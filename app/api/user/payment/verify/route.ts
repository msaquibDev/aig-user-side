// app/api/user/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Registration from "@/models/Registration";

/**
 * POST /api/user/payment/verify
 * → Verify Razorpay payment and generate badge
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { razorpay_order_id, razorpay_payment_id, registrationId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !registrationId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Verify with Razorpay API
    const authHeader =
      "Basic " +
      Buffer.from(process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET).toString("base64");

    const response = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, message: "Failed to verify payment with Razorpay" }, { status: 400 });
    }

    const paymentData = await response.json();

    // Cross-check order_id matches
    if (paymentData.order_id !== razorpay_order_id) {
      return NextResponse.json({ success: false, message: "Order ID mismatch" }, { status: 400 });
    }

    // Update Payment record
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

    // If payment successful, mark registration as paid and generate badge
    if (updatedPayment.status === "success") {
      const registration = await Registration.findById(registrationId);

      if (!registration) {
        return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
      }

      // Generate badgeId: e.g., "AIGLC1", "AIGLC2"
      const eventShortcut = registration.eventName
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();

      // Count existing registrations for this event with badge generated
      const count = await Registration.countDocuments({
        eventId: registration.eventId,
        badgeGenerated: true,
      });

      const badgeId = `${eventShortcut}${count + 1}`;

      // Update registration
      registration.isPaid = true;
      registration.badgeId = badgeId;
      registration.badgeGenerated = true;
      await registration.save();
    }

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (err: any) {
    console.error("Verify Error:", err);
    return NextResponse.json({ success: false, message: err.message || "Something went wrong" }, { status: 500 });
  }
}

// app/api/user/payment/verify/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Payment from "@/models/Payment";
// import Registration from "@/models/Registration";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { razorpay_order_id, razorpay_payment_id, registrationId, simulate } = await req.json();

//     if (!registrationId) {
//       return NextResponse.json({ success: false, message: "registrationId is required" }, { status: 400 });
//     }

//     // Fetch payment record
//     const payment = await Payment.findOne({ registration: registrationId });
//     if (!payment) {
//       return NextResponse.json({ success: false, message: "Payment record not found" }, { status: 404 });
//     }

//     // If simulate = true → bypass Razorpay
//     if (simulate) {
//       payment.status = "success";
//       payment.transactionId = "SIMULATED123";
//       await payment.save();

//       const registration = await Registration.findById(registrationId);
//       if (!registration) return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });

//       // Generate badge
//       const eventShortcut = registration.eventName
//         .split(" ")
//         .map(word => word[0])
//         .join("")
//         .toUpperCase();

//       const count = await Registration.countDocuments({
//         eventId: registration.eventId,
//         badgeGenerated: true,
//       });

//       registration.isPaid = true;
//       registration.badgeId = `${eventShortcut}${count + 1}`;
//       registration.badgeGenerated = true;
//       await registration.save();

//       return NextResponse.json({ success: true, payment, registration });
//     }

//     // ---- Normal Razorpay verification code goes here if simulate = false ----
//     return NextResponse.json({ success: false, message: "Live Razorpay verification not implemented in simulate mode" });

//   } catch (err: any) {
//     console.error("Verify Error:", err);
//     return NextResponse.json({ success: false, message: err.message || "Something went wrong" }, { status: 500 });
//   }
// }
