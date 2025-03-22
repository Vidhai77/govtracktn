import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Collector", "Department_Head", "Tender_Group"],
    },
    department: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    lastLogin: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    projectAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    projects: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Project",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
