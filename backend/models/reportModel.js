// models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    proofs: {
      type: [String],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  },
);

// 💥 THIS LINE MATTERS!!
export default mongoose.model("Report", reportSchema);

