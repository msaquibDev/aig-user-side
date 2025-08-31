// models/Registration.ts
import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./User";
import { IMealPreference } from "./MealPreference";
import { IRegistrationCategory } from "./RegistrationCategory";

export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId;

  user: IUser["_id"];
  mealPreference: IMealPreference["_id"];
  registrationCategory: IRegistrationCategory["_id"];

  prefix: string;
  fullName: string;
  gender: "Male" | "Female" | "Other";

  mobile: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;

  affiliation: string;
  designation: string;
  medicalCouncilRegistration: string;
  medicalCouncilState: string;

  eventId: mongoose.Types.ObjectId; // Only eventId
  isPaid: boolean;

  regNum?: string;
  regNumGenerated?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prefix: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },

    mobile: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },

    affiliation: { type: String, required: true },
    designation: { type: String, required: true },
    medicalCouncilRegistration: { type: String, required: true },
    medicalCouncilState: { type: String, required: true },

    registrationCategory: { type: mongoose.Schema.Types.ObjectId, ref: "RegistrationCategory", required: true },
    mealPreference: { type: mongoose.Schema.Types.ObjectId, ref: "MealPreference", required: true },

    eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
    isPaid: { type: Boolean, default: false },

    regNum: { type: String },
    regNumGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
