// src/app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";

interface Params {
  params: Promise<{
    userId: string;
  }>;
}

// GET single user
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const { userId } = await params;
    const user = await User.findById(userId).select("-password").lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// UPDATE user
export async function PUT(request: NextRequest, { params }: Params) {
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
    const { role, isVerified, ...otherUpdates } = body;

    const { userId } = await params;
    // Prevent super-admin from modifying themselves
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if trying to modify another super-admin
    if (user.role === "super-admin" && session.user?.id !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Cannot modify other Super Admins" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (Object.keys(otherUpdates).length > 0) {
      Object.assign(updateData, otherUpdates);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error: any) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const { userId } = await params;
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (session.user?.id === user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Prevent deleting other super-admins
    if (user.role === "super-admin") {
      return NextResponse.json(
        { success: false, message: "Cannot delete Super Admin accounts" },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}