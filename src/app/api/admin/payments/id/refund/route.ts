import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Booking from "@/lib/models/Booking";
import Commission from "@/lib/models/Commission";
import { auth } from "@/auth";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = await props.params;
    const { id } = params;

    // Find the booking/payment
    // In this app, many things use the MongoDB _id but others use the 'id' field.
    // We'll search for both to be safe or use findById if id is the ObjectId.
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (booking.paymentStatus !== "paid") {
      return NextResponse.json({ error: "Only paid bookings can be refunded" }, { status: 400 });
    }

    // Process refund logic (connect to Razorpay/PayU here in production)
    // For now, we update the status
    booking.paymentStatus = "refunded";
    booking.status = "cancelled";
    await booking.save();

    // Cancel associated commissions if any
    await Commission.updateMany(
      { bookingId: booking._id },
      { status: "cancelled" }
    );

    return NextResponse.json({
      success: true,
      message: "Refund processed successfully and commissions cancelled",
    });
  } catch (error: any) {
    console.error("Refund error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
