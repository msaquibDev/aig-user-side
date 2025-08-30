// models/Registration.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";
import { IMealPreference } from "./MealPreference";
import { IRegistrationCategory } from "./RegistrationCategory";

/**
 * Registration Interface
 */
export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId; 
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
  mealPreference: IMealPreference["_id"]; // store ObjectId
  gender: "Male" | "Female" | "Other";
  registrationCategory: IRegistrationCategory["_id"]; // store ObjectId
  eventId: mongoose.Types.ObjectId; // store Event ObjectId only
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

    // Reference Meal Preference model
    mealPreference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPreference",
      required: [true, "Meal Preference is required"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },

    // Reference Registration Category model
    registrationCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegistrationCategory",
      required: [true, "Registration Category is required"],
    },

    // Reference Event model (only ObjectId stored)
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // we just reference it by model name, no need to import from other repo
      required: [true, "Event reference is required"],
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * Prevent model overwrite in Next.js
 */
const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
