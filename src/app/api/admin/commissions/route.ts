import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Commission from "@/lib/models/Commission";
import User from "@/lib/models/User";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Fetch commissions and populate user details
    const commissions = await Commission.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: commissions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { commissionId, status } = body;

    if (status === "paid") {
      await Commission.findByIdAndUpdate(commissionId, {
        status: "paid",
        paidAt: new Date()
      });
    } else {
      await Commission.findByIdAndUpdate(commissionId, { status });
    }

    return NextResponse.json({
        success: true,
        message: "Commission status updated"
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
