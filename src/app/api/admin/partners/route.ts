import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import Lab from "@/lib/models/Lab";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Fetch users with lab-admin or partner-staff role
    const partners = await User.find({ 
      role: { $in: ["lab-admin", "partner-staff"] } 
    }).populate("labId", "name city");

    return NextResponse.json({
      success: true,
      data: partners,
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
    const { name, email, phone, password, labId, role } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "lab-admin",
      labId,
      isVerified: true
    });

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
