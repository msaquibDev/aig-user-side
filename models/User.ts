import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  prefix: string;
  fullname: string;
  affiliation: string;
  email: string;
  mobile: string;
  country: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    prefix: { type: String, required: true, trim: true },
    fullname: { type: String, required: true, trim: true },
    affiliation: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please enter a valid mobile number'],
    },
    country: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Password hash middleware
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Reset password token generator
userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  return resetToken;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
