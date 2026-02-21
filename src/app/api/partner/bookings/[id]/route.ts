import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Booking from "@/lib/models/Booking";
import User from "@/lib/models/User";
import { auth } from "@/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (!session || !role || !["lab-admin", "partner-staff"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Verify this booking belongs to the user's lab
    const user = await User.findById(session.user.id);
    if (!user || !user.labId) {
      return NextResponse.json({ error: "Lab not assigned" }, { status: 400 });
    }

    const booking = await Booking.findOne({ _id: id, labId: user.labId });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found or access denied" }, { status: 404 });
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
