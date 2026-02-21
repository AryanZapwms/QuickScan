import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Booking from "@/lib/models/Booking";
import User from "@/lib/models/User";
import Lab from "@/lib/models/Lab";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (!session || !role || !["lab-admin", "partner-staff"].includes(role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).populate("labId");
    
    if (!user || !user.labId) {
      return NextResponse.json({ error: "Lab not assigned to this account" }, { status: 400 });
    }

    const labId = (user.labId as any)._id;
    const labName = (user.labId as any).name;

    // Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysBookingsCount = await Booking.countDocuments({
      labId,
      appointmentDate: { $gte: today, $lt: tomorrow }
    });

    // Pending reports (count bookings with status confirmed but no reportUrl)
    const pendingReports = await Booking.countDocuments({
      labId,
      status: { $in: ["confirmed", "sample-collected", "processing"] },
      reportUrl: { $exists: false }
    });

    // Total completed
    const totalCompleted = await Booking.countDocuments({
      labId,
      status: "completed"
    });

    // Monthly revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyRevenue = await Booking.aggregate([
      { $match: { labId, status: "completed", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Today's schedule list
    const schedule = await Booking.find({
      labId,
      appointmentDate: { $gte: today, $lt: tomorrow }
    }).sort({ timeSlot: 1 });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          todaysBookings: todaysBookingsCount,
          pendingReports,
          totalCompleted,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          labName
        },
        schedule
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
