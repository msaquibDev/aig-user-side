// models/Announcements.ts
import mongoose, { Document, Schema, Model } from "mongoose";

// 1️⃣ Interface for TypeScript type safety
export interface IAnnouncement extends Document {
  title: string;
  description: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Schema definition
const AnnouncementSchema: Schema<IAnnouncement> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Announcement description is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt & updatedAt
  }
);

// 3️⃣ Model export
const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
