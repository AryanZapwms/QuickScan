// src/lib/models/SystemSetting.ts
import mongoose from "mongoose";

const SystemSettingSchema = new mongoose.Schema({
  siteName: { 
    type: String, 
    required: true, 
    default: "QuickScan Medical" 
  },
  siteUrl: { 
    type: String, 
    required: true, 
    default: "https://quickscan.medical" 
  },
  supportEmail: { 
    type: String, 
    required: true, 
    default: "support@quickscan.medical" 
  },
  supportPhone: { 
    type: String, 
    required: true, 
    default: "+91 9876543210" 
  },
  maintenanceMode: { 
    type: Boolean, 
    default: false 
  },
  allowRegistrations: { 
    type: Boolean, 
    default: true 
  },
  bookingWindowDays: { 
    type: Number, 
    default: 30,
    min: 1,
    max: 365 
  },
  maxBookingsPerDay: { 
    type: Number, 
    default: 50,
    min: 1,
    max: 1000 
  },
  invoicePrefix: { 
    type: String, 
    default: "QS",
    maxlength: 5 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true,
});

// Ensure only one document exists
SystemSettingSchema.pre("save", async function() {
  const count = await mongoose.models.SystemSetting?.countDocuments();
  if (count > 0 && this.isNew) {
    throw new Error("Only one system settings document can exist");
  }
});

export default mongoose.models.SystemSetting || mongoose.model("SystemSetting", SystemSettingSchema);