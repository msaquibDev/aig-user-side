// models/Payment.ts
import mongoose, { Schema, Document, models, Model } from "mongoose";
import { IRegistration } from "./Registration";

/**
 * Payment Interface
 */
export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  registration: IRegistration["_id"]; // Reference to registration
  user: mongoose.Types.ObjectId;      // Reference to user
  amount: number;                     // Payment amount
  currency: string;                   // Payment currency (default: INR)
  status: "initiated" | "success" | "failed"; // Payment status
  paymentProvider: string;            // e.g., "razorpay"

  // Razorpay fields
  razorpayOrderId: string;            // Razorpay order_id
  razorpayPaymentId?: string;         // Razorpay payment_id (only after success)
  razorpaySignature?: string;         // Razorpay signature (after success)

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment Schema
 */
const PaymentSchema: Schema<IPayment> = new Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: [true, "Registration reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["initiated", "success", "failed"],
      default: "initiated",
    },
    paymentProvider: {
      type: String,
      required: [true, "Payment provider is required"],
    },

    // Razorpay fields
    razorpayOrderId: {
      type: String,
      required: [true, "Razorpay order_id is required"],
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * Prevent model overwrite in Next.js hot-reload
 */
const Payment: Model<IPayment> =
  models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
