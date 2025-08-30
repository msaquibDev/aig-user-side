// models/RegistrationCategory.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistrationCategory extends Document {
  _id: mongoose.Types.ObjectId; 
  categoryName: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationCategorySchema: Schema<IRegistrationCategory> = new Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category Name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
  },
  { timestamps: true }
);

const RegistrationCategory: Model<IRegistrationCategory> =
  mongoose.models.RegistrationCategory ||
  mongoose.model<IRegistrationCategory>(
    "RegistrationCategory",
    RegistrationCategorySchema
  );

export default RegistrationCategory;
