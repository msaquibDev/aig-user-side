import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";

/**
 * Registration Category Enum with Fees
 */
export enum RegistrationCategory {
  "Member" = 15170,
  "Trade Delegates" = 14000,
  "Technologist/Students" = 200000,
  "Non-Member" = 28563,
}

/**
 * Registration Interface
 */
export interface IRegistration extends Document {
  user: IUser["_id"];
  prefix: string;
  fullName: string;
  mobile: string;
  email: string;
  affiliation: string;
  designation: string;
  medicalCouncilRegistration: string;
  medicalCouncilState: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  mealPreference: "Veg" | "Non-Veg" | "Jain";
  gender: "Male" | "Female" | "Other";
  registrationCategory: keyof typeof RegistrationCategory;
  registrationAmount: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Registration Schema
 */
const RegistrationSchema = new Schema<IRegistration>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    prefix: { type: String, required: [true, "Prefix is required"] },
    fullName: { type: String, required: [true, "Full name is required"] },
    mobile: { type: String, required: [true, "Mobile number is required"] },
    email: { type: String, required: [true, "Email is required"] },
    affiliation: { type: String, required: [true, "Affiliation is required"] },
    designation: { type: String, required: [true, "Designation is required"] },
    medicalCouncilRegistration: {
      type: String,
      required: [true, "Medical Council Registration is required"],
    },
    medicalCouncilState: {
      type: String,
      required: [true, "Medical Council State is required"],
    },
    address: { type: String, required: [true, "Primary Address is required"] },
    country: { type: String, required: [true, "Country is required"] },
    state: { type: String, required: [true, "State is required"] },
    city: { type: String, required: [true, "City is required"] },
    pincode: { type: String, required: [true, "Pincode is required"] },
    mealPreference: {
      type: String,
      required: [true, "Meal Preference is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    registrationCategory: {
      type: String,
      enum: Object.keys(RegistrationCategory),
      required: [true, "Registration Category is required"],
    },
    registrationAmount: {
      type: Number,
      default: 0, // not required; will be auto-set in hook
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * Auto-fill registration amount before validation
 */
RegistrationSchema.pre("validate", function (next) {
  // @ts-ignore
  if (this.registrationCategory) {
    // @ts-ignore
    this.registrationAmount = RegistrationCategory[this.registrationCategory];
  }
  next();
});

/**
 * Prevent model overwrite in Next.js
 */
const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
