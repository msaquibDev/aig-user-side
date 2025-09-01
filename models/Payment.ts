// models/Payment.ts
import mongoose, { Schema, Document, models, Model } from "mongoose";
import { IRegistration } from "./Registration";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  registration: IRegistration["_id"];
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "initiated" | "success" | "failed";
  paymentProvider: string;

  // Razorpay fields
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    registration: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["initiated", "success", "failed"], default: "initiated" },
    paymentProvider: { type: String, required: true },

    // Razorpay fields
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> =
  models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
