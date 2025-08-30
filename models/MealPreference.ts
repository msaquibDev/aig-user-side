import mongoose, { Schema, Document, models } from "mongoose";

//  TypeScript interface
export interface IMealPreference extends Document {
  mealName: string;
  createdAt: Date;
  updatedAt: Date;
}

//  Mongoose schema
const MealPreferenceSchema: Schema = new Schema(
  {
    mealName: {
      type: String,
      required: [true, "Meal Preference is required"],
      trim: true,
      unique: true, // avoid duplicate meal preferences
    },
  },
  { timestamps: true }
);

//  Prevent model overwrite in Next.js hot reload
const MealPreference =
  models.MealPreference ||
  mongoose.model<IMealPreference>("MealPreference", MealPreferenceSchema);

export default MealPreference;
