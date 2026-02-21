import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import TimeSlot from "@/lib/models/TimeSlot";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !["lab-admin", "partner-staff"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user || !user.labId) {
      return NextResponse.json({ error: "Lab not assigned to this account" }, { status: 400 });
    }
    const labId = user.labId;

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const query: any = { labId };
    if (date) query.date = new Date(date);

    const slots = await TimeSlot.find(query).sort({ startTime: 1 });

    return NextResponse.json({ success: true, data: slots });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !["lab-admin", "partner-staff"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user || !user.labId) return NextResponse.json({ error: "Lab not assigned" }, { status: 400 });
    const labId = user.labId;

    const body = await request.json();
    const { date, slots } = body; 

    for (const slot of slots) {
      await TimeSlot.findOneAndUpdate(
        { labId, date: new Date(date), time: slot.time },
        { ...slot, labId, date: new Date(date) },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: "Slots updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
