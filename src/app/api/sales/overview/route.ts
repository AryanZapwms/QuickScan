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
    const userId = session.user.id;
    const user = await User.findById(userId);

    // Get total referrals (bookings with this user's referral code)
    const referralCode = user?.referralCode;
    const totalReferrals = await Booking.countDocuments({ referralCode });
    
    // Get active this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const activeThisMonth = await Booking.countDocuments({ 
      referralCode, 
      createdAt: { $gte: startOfMonth } 
    });

    // Get pending payouts
    const pendingCommissions = await Commission.aggregate([
      { $match: { userId: user?._id, status: { $ne: "paid" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Calculate level (mock logic based on total earnings)
    const totalEarnings = await Commission.aggregate([
      { $match: { userId: user?._id, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const earnings = totalEarnings[0]?.total || 0;
    let level = "Bronze (10%)";
    if (earnings > 50000) level = "Platinum (15%)";
    else if (earnings > 20000) level = "Gold (12%)";
    else if (earnings > 10000) level = "Silver (11%)";

    // Recent conversions
    const recentConversions = await Booking.find({ referralCode })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("patientName serviceName createdAt totalAmount status");

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalReferrals,
          activeThisMonth,
          pendingPayout: pendingCommissions[0]?.total || 0,
          level,
          referralCode
        },
        recentConversions
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
