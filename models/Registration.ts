// models/Registration.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";
import { IMealPreference } from "./MealPreference";
import { IRegistrationCategory } from "./RegistrationCategory";

/**
 * IRegistration Interface
 * -----------------------
 * Represents a single registration entry in the system.
 * Links a user with registration details, meal preferences,
 * category, event, and payment status.
 */
export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId;

  // References
  user: IUser["_id"];
  mealPreference: IMealPreference["_id"];
  registrationCategory: IRegistrationCategory["_id"];

  // Personal Information
  prefix: string;
  fullName: string;
  gender: "Male" | "Female" | "Other";

  // Contact Information
  mobile: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;

  // Professional Details
  affiliation: string;
  designation: string;
  medicalCouncilRegistration: string;
  medicalCouncilState: string;

  // Event & Payment
  eventId: mongoose.Types.ObjectId; // Event reference
  isPaid: boolean;

  // Registration Number Tracking
  regNum?: string;
  regNumGenerated?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Registration Schema
 * -------------------
 * Stores detailed information for event registrations.
 * Includes references to User, MealPreference, RegistrationCategory,
 * and the Event itself. Tracks payment and registration status.
 */
const RegistrationSchema = new Schema<IRegistration>(
  {
    /** ------------------------
     * References
     * ------------------------ */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for registration"],
    },
    registrationCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegistrationCategory",
      required: [true, "Registration category is required"],
    },
    mealPreference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPreference",
      required: [true, "Meal preference is required"],
    },

    /** ------------------------
     * Personal Information
     * ------------------------ */
    prefix: {
      type: String,
      required: [true, "Prefix (e.g., Dr., Mr., Ms.) is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
      required: [true, "Gender is required"],
    },

    /** ------------------------
     * Contact Information
     * ------------------------ */
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
    },

    /** ------------------------
     * Professional Information
     * ------------------------ */
    affiliation: {
      type: String,
      required: [true, "Affiliation (organization/hospital) is required"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    medicalCouncilRegistration: {
      type: String,
      required: [true, "Medical Council Registration Number is required"],
      trim: true,
    },
    medicalCouncilState: {
      type: String,
      required: [true, "Medical Council State is required"],
      trim: true,
    },

    /** ------------------------
     * Event & Payment
     * ------------------------ */
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Event ID is required"],
      ref: "Event", // optional if you have an Event model
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    /** ------------------------
     * System Fields
     * ------------------------ */
    regNum: {
      type: String,
      trim: true,
    },
    regNumGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto add createdAt & updatedAt
  }
);

// Create or reuse the Registration model
const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
