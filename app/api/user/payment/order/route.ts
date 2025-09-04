// app/api/user/payment/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import RegistrationCategory from "@/models/RegistrationCategory";
import Payment from "@/models/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { razorpay } from "@/lib/razorpay";
import mongoose from "mongoose";
import axios from "axios";


/**
 * POST /api/user/payment/order
 * Create a Razorpay order for a registration
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 🔹 Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔹 Extract registrationId from request
    const { registrationId } = await req.json();
    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: "registrationId is required" },
        { status: 400 }
      );
    }

    // 🔹 Fetch registration
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    // 🔹 Use categoryName stored in Registration
    const categoryName = registration.registrationCategory;

    // 🔹 Fetch amount from RegistrationCategory collection
    const category = await RegistrationCategory.findOne({ categoryName });
    if (!category) {
      return NextResponse.json(
        { success: false, message: `Category not found: ${categoryName}` },
        { status: 404 }
      );
    }

    const amount = category.amount;
    if (!amount) {
      return NextResponse.json(
        { success: false, message: "Amount not set for category" },
        { status: 400 }
      );
    }

    // 🔹 Razorpay order options
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${registration._id.toString()}`,
      notes: {
        registrationId: registration._id.toString(),
        fullName: registration.fullName,
        registrationCategory: categoryName, //  same as in Registration table
      },
    };

    // 🔹 Create Razorpay order
    const order = await razorpay.orders.create(options);

    // 🔹 Save payment record
    const payment = await Payment.create({
      registration: registration._id,
      user: new mongoose.Types.ObjectId(session.user.id),
      amount,
      currency: "INR",
      status: "initiated",
      paymentProvider: "razorpay",
      razorpayOrderId: order.id,
    });
    
    // 🔹 Fetch event details from Admin repo
    let eventData: { eventName?: string; eventImage?: string } = {};
    try {
      const eventUrl = new URL(
        `/api/events/${registration.eventId}`,
        process.env.ADMIN_API_BASE_URL
      );
      const eventRes = await axios.get(eventUrl.toString());
      eventData = {
        eventName: eventRes.data?.data?.eventName,
        eventImage: eventRes.data?.data?.eventImage,
      };
    } catch (err) {
      console.error("Failed to fetch event details from Admin API:", err);
    }


    return NextResponse.json({
      success: true,
      order,
      registrationId: registration._id.toString(),
      paymentId: payment._id.toString(),
      event: {
        eventId: registration.eventId.toString(),
        ...eventData, //  eventName + eventImage if available
      },
    });
  } catch (err: any) {
    console.error("Order Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
