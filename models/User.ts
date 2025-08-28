// models/User.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Interface
 */
export interface IUser extends Document {
  prefix: string;
  fullname: string;
  designation?: string;
  affiliation: string;
  medicalCouncilState?: string;
  medicalCouncilRegistration?: string;
  email: string;
  mobile: string;
  gender?: string;
  country: string;
  city?: string;
  state?: string;
  pincode?: string;
  mealPreference?: string;
  profilePicture?: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

/**
 * User Schema
 */
const userSchema = new Schema<IUser>(
  {
    // 🔹 Required Fields
    prefix: {
      type: String,
      required: [true, "Prefix is required"],
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
    },
    affiliation: {
      type: String,
      required: [true, "Affiliation is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    // 🔹 Optional Fields
    designation: {
      type: String,
    },
    medicalCouncilState: {
      type: String,
    },
    medicalCouncilRegistration: {
      type: String,
    },
    gender: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    mealPreference: {
      type: String,
    },
    profilePicture: {
      type: String,
    },

    // 🔒 Password Reset
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save Middleware - Hash password
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compare Password Method
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Export User Model
 */
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;



