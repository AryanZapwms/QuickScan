// src/app/api/admin/admins/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
// Remove the email import for now since we don't have the function
// import { sendAdminInviteEmail } from "@/lib/email";

// GET all admin users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const admins = await User.find({
      role: { $in: ["admin", "lab-admin", "super-admin"] },
    })
      .select("-password")
      .sort({ role: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: admins,
    });

  } catch (error: any) {
    console.error("Failed to fetch admins:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// CREATE new admin
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { name, email, phone, role } = body;

    // Validate required fields
    if (!name || !email || !phone || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User with this email already exists",
          existingUser: {
            id: existingUser._id,
            name: existingUser.name,
            role: existingUser.role,
          }
        },
        { status: 409 }
      );
    }

    // Generate random password
    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create new admin user
    const newAdmin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isVerified: true,
    });

    // Send invitation email (optional - you can implement this later)
    // try {
    //   await sendAdminInviteEmail(email, name, tempPassword, role);
    // } catch (emailError) {
    //   console.error("Failed to send invitation email:", emailError);
    //   // Continue even if email fails
    // }

    return NextResponse.json({
      success: true,
      message: "Admin created successfully.",
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });

  } catch (error: any) {
    console.error("Failed to create admin:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create admin" },
      { status: 500 }
    );
  }
}