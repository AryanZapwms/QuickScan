import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// GET all sales executives
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Fetch users with role sales-executive
    const executives = await User.find({ role: "sales-executive" })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: executives,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create a new sales executive
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, email, password, phone, commissionRate } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Generate referral code (simple version)
    const referralCode = name.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newExecutive = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "sales-executive",
      commissionRate: commissionRate || 10,
      referralCode,
      isVerified: true
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newExecutive._id,
        name: newExecutive.name,
        email: newExecutive.email,
        referralCode: newExecutive.referralCode
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
