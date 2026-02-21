import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
  },
  profilePicture: { type: String },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "admin", "lab-admin", "super-admin", "sales-executive", "partner-staff"], // Expanded roles
    default: "user",
  },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  referralCode: { type: String, unique: true, sparse: true },
  commissionRate: { type: Number, default: 0 }, // For Sales Executives
  labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab" }, // For Lab Partners
  emailVerified: { type: Date },
  accounts: [],
  sessions: [],
  verificationTokens: [],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Forcing the model to re-register to pick up new enum values in development
delete mongoose.models.User;
const User = mongoose.model("User", UserSchema);
export default User;