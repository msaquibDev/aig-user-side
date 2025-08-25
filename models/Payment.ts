// models/Payment.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import { IRegistration } from "./Registration";

export interface IPayment extends Document {
  registration: IRegistration["_id"]; // reference to Registration
  amount: number;
  currency: string;
  status: "initiated" | "success" | "failed";
  paymentProvider: string; // e.g., "razorpay", "stripe"
  transactionId?: string; // from gateway
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["initiated", "success", "failed"],
      default: "initiated",
    },
    paymentProvider: { type: String, required: true },
    transactionId: { type: String },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
