import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Booking from "@/lib/models/Booking";
import User from "@/lib/models/User";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !["lab-admin", "partner-staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    const labId = user.labId;

    if (!labId) {
      return NextResponse.json({ error: "Lab not assigned" }, { status: 400 });
    }

    // Mocking invoice generation based on monthly completed bookings
    // In a real system, you'd have an Invoice model. 
    // Here we aggregate by month.
    const billingSummary = await Booking.aggregate([
      { $match: { labId, status: "completed" } },
      { 
        $group: { 
          _id: { 
            month: { $month: "$createdAt" }, 
            year: { $year: "$createdAt" } 
          }, 
          totalAmount: { $sum: "$totalAmount" },
          count: { $sum: 1 },
          lastBookingDate: { $max: "$createdAt" }
        } 
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const invoices = billingSummary.map((item: any) => ({
      id: `INV-${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      period: `${new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long' })} ${item._id.year}`,
      status: "Settled", // Simplified
      amount: item.totalAmount,
      date: new Date(item.lastBookingDate).toISOString().split('T')[0]
    }));

    const totalSettled = billingSummary.reduce((sum, item) => sum + item.totalAmount, 0);

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        stats: {
          totalSettled,
          unsettledAmount: 0 // In real app, calculate pending payouts
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
