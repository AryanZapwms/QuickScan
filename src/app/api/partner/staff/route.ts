import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
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

    // Fetch all users with this labId except the current user (if needed, or all)
    const staff = await User.find({ 
      labId,
      _id: { $ne: session.user.id } 
    }).select("-password");

    return NextResponse.json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "lab-admin") {
      return NextResponse.json({ error: "Only admins can invite staff" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    const labId = user.labId;

    const body = await request.json();
    const { name, email, phone, role } = body;

    // In a real app, we'd send an email. For now, we create the user with a default password.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = await User.create({
        name,
        email,
        phone,
        role: "partner-staff", // Hardcoded for this endpoint
        labId,
        isVerified: true,
        // Password should be set by the user later via a link
    });

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
