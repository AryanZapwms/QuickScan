import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Lab from "@/lib/models/Lab";
import User from "@/lib/models/User";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (!session || !role || !["lab-admin", "partner-staff"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    const labId = user?.labId;

    if (!labId) {
      return NextResponse.json({ error: "Lab not assigned" }, { status: 400 });
    }

    const lab = await Lab.findById(labId);

    return NextResponse.json({
      success: true,
      data: lab,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (!session || role !== "lab-admin") {
      return NextResponse.json({ error: "Only lab admins can update settings" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    const labId = user?.labId;

    if (!labId) {
      return NextResponse.json({ error: "Lab not assigned" }, { status: 400 });
    }

    const body = await request.json();
    const updatedLab = await Lab.findByIdAndUpdate(labId, body, { new: true });

    return NextResponse.json({
      success: true,
      data: updatedLab,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}