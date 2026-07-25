import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  budgetRange: "under-1k" | "1k-5k" | "5k-10k" | "10k-plus";
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    budgetRange: {
      type: String,
      required: true,
      enum: ["under-1k", "1k-5k", "5k-10k", "10k-plus"],
    },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

leadSchema.index({ name: "text", email: "text" });

export default mongoose.model<ILead>("Lead", leadSchema);
