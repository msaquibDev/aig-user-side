import mongoose, { Schema, Document, models } from "mongoose";
import { IRegistration } from "./Registration";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  registration: IRegistration["_id"];
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "initiated" | "success" | "failed";
  paymentProvider: string;
  transactionId?: string;
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

// ✅ Fix: add default export
const Payment =
  models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
