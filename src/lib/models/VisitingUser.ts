import mongoose from "mongoose";

const VisitingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      trim: true,
    },
    interestedService: {
      type: String,
      default: "General Visit",
    },
    isContacted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overwrite on HMR
const VisitingUser =
  mongoose.models.VisitingUser || mongoose.model("VisitingUser", VisitingUserSchema);

export default VisitingUser;
