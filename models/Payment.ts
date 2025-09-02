// models/Payment.ts
import mongoose, { Schema, Document, Model, models } from "mongoose";
import { IRegistration } from "./Registration";

/**
 * IPayment Interface
 * ------------------
 * Represents a payment transaction linked to a specific registration.
 * Stores Razorpay transaction details, status, and metadata.
 */
export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;

  // References
  registration: IRegistration["_id"];
  user: mongoose.Types.ObjectId;

  // Transaction Details
  amount: number;
  currency: string;
  status: "initiated" | "success" | "failed";
  paymentProvider: string;

  // Razorpay Fields
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment Schema
 * --------------
 * Stores transaction details for event registrations.
 * Supports Razorpay fields and ensures payment tracking.
 */
const PaymentSchema: Schema<IPayment> = new Schema(
  {
    // References
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: [true, "Registration reference is required for payment"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required for payment"],
    },

    // Transaction Details
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: {
        values: ["INR", "USD", "EUR"],
        message: "Currency must be one of INR, USD, or EUR",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["initiated", "success", "failed"],
        message: "Status must be initiated, success, or failed",
      },
      default: "initiated",
    },
    paymentProvider: {
      type: String,
      required: [true, "Payment provider is required (e.g., Razorpay)"],
    },

    // Razorpay Fields
    razorpayOrderId: {
      type: String,
      required: [true, "Razorpay Order ID is required"],
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Create or reuse the Payment model
const Payment: Model<IPayment> =
  models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
