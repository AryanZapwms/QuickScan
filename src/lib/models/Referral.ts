import mongoose from "mongoose";

const ReferralSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerName: { type: String },
    usageCount: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Referral || mongoose.model("Referral", ReferralSchema);
