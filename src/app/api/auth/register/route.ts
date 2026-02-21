import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    console.log("📝 REGISTRATION ATTEMPT:", {
      email: body.email,
      name: body.name,
      passwordLength: body.password?.length,
    });

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create user
    const user = new User({
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      isVerified: false,
      role: "user",
      createdAt: new Date(),
    });

    await user.save();
    console.log("✅ User created:", user.email);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔥 Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}