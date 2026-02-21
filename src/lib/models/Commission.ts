import mongoose from "mongoose";

const CommissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    bookingIdString: { type: String }, // Human readable ID
    amount: { type: Number, required: true },
    percentage: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "earned", "paid", "cancelled"],
      default: "pending",
    },
    paidAt: { type: Date },
    transactionId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Commission || mongoose.model("Commission", CommissionSchema);
