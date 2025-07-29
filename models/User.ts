import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  prefix: string;
  fullname: string;
  affiliation: string;
  email: string;
  mobile: string;
  country: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const userSchema = new Schema<IUser>(
  {
    prefix: {
      type: String,
      required: [true, 'Prefix is required'], // e.g., Dr., Mr., Ms.
    },
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
    },
    affiliation: {
      type: String,
      required: [true, 'Affiliation is required'], // e.g., University, Hospital
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Prevent password from being returned by default
    },
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
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Compare entered password with hashed one
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Export model or use existing one
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
