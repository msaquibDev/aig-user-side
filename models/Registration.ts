// models/Registration.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";

/**
 * IRegistration Interface
 * -----------------------
 * Represents a single registration entry in the system.
 * Stores mealPreference and registrationCategory as strings (names),
 * instead of ObjectIds.
 */
export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId;

  // References
  user: IUser["_id"];

  // Instead of ObjectId, store names directly
  mealPreference: string;
  registrationCategory: string;

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
  eventName?: string;
  eventCode?: string;
  eventImage?: string;
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
 * mealPreference & registrationCategory are stored as strings.
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

    // Store names instead of ObjectIds
    registrationCategory: {
      type: String,
      required: [true, "Registration category is required"],
      trim: true,
    },
    mealPreference: {
      type: String,
      required: [true, "Meal preference is required"],
      trim: true,
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
    eventName: {
      type: String,
      trim: true,
    },
    eventCode: {
      type: String,
      trim: true,
    },
    eventImage: {
      type: String,
      trim: true,
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
