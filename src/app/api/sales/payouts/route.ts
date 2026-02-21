import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
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

    // Fetch earned and paid commissions for this user
    const commissions = await Commission.find({ userId })
      .sort({ createdAt: -1 });

    const totalEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
    const totalPaid = commissions
      .filter(c => c.status === "paid")
      .reduce((sum, c) => sum + c.amount, 0);
    
    const availableForPayout = totalEarned - totalPaid;

    // Grouping by status or simulating payout batches if we had a Payout model
    // For now, we return the ledger
    return NextResponse.json({
      success: true,
      data: {
        commissions,
        stats: {
          lifetimeEarnings: totalEarned,
          availableForPayout,
          lastPayoutDate: commissions.find(c => c.status === "paid")?.paidAt || null
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
