import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Booking from "@/lib/models/Booking";
import Commission from "@/lib/models/Commission";
import User from "@/lib/models/User";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "sales-executive") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    const referralCode = user.referralCode;

    // Get all bookings made with this referral code
    const bookings = await Booking.find({ referralCode })
      .sort({ createdAt: -1 })
      .select("patientName createdAt totalAmount status");

    // Get associated commissions to show specific earnings per patient
    const commissions = await Commission.find({ userId: user._id })
      .select("bookingId amount status");

    // Map them together
    const referralData = bookings.map(b => {
      const comm = commissions.find(c => c.bookingId.toString() === b._id.toString());
      return {
        _id: b._id,
        patientName: b.patientName,
        date: b.createdAt,
        status: b.status,
        revenue: b.totalAmount,
        commission: comm?.amount || 0,
        commStatus: comm?.status || "pending"
      };
    });

    return NextResponse.json({
      success: true,
      data: referralData
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
