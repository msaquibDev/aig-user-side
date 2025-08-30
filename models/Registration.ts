// models/Registration.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";
import { IMealPreference } from "./MealPreference";
import { IRegistrationCategory } from "./RegistrationCategory";

/**
 * Interface for Registration document
 */
export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId;

  // References
  user: IUser["_id"];                        // User who registered
  mealPreference: IMealPreference["_id"];    // Meal preference reference
  registrationCategory: IRegistrationCategory["_id"]; // Registration category reference

  // Personal details
  prefix: string;
  fullName: string;
  gender: "Male" | "Female" | "Other";

  // Contact details
  mobile: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;

  // Professional details
  affiliation: string;
  designation: string;
  medicalCouncilRegistration: string;
  medicalCouncilState: string;

  // Event details
  eventId: mongoose.Types.ObjectId;
  eventName: string; //  store event name from admin
  isPaid: boolean;

  // Badge details
  badgeId?: string;
  badgeGenerated?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Registration Schema
 */
const RegistrationSchema = new Schema<IRegistration>(
  {
    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    // Personal info
    prefix: { type: String, required: [true, "Prefix is required"] },
    fullName: { type: String, required: [true, "Full name is required"] },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
      required: [true, "Gender is required"],
    },

    // Contact info
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    address: { type: String, required: [true, "Address is required"] },
    country: { type: String, required: [true, "Country is required"] },
    state: { type: String, required: [true, "State is required"] },
    city: { type: String, required: [true, "City is required"] },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^[0-9]{6}$/, "Pincode must be 6 digits"],
    },

    // Professional info
    affiliation: {
      type: String,
      required: [true, "Affiliation is required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    medicalCouncilRegistration: {
      type: String,
      required: [true, "Medical Council Registration number is required"],
    },
    medicalCouncilState: {
      type: String,
      required: [true, "Medical Council State is required"],
    },

    // Event info
    registrationCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegistrationCategory",
      required: [true, "Registration Category is required"],
    },
    mealPreference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPreference",
      required: [true, "Meal Preference is required"],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Event ID is required"],
    },
    eventName: {
      type: String,
      required: [true, "Event name is required"],
    },
    isPaid: { type: Boolean, default: false },

    // Badge info
    badgeId: { type: String },
    badgeGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * Registration Model
 */
const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
