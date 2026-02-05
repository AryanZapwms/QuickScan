// src/app/api/admin/admins/[adminId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";

interface Params {
  params: Promise<{
    adminId: string;
  }>;
}

// DELETE admin (remove admin privileges or delete account)
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

    const { adminId } = await params;
    const admin = await User.findById(adminId);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (session.user?.id === admin._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Prevent deleting other super-admins
    if (admin.role === "super-admin") {
      return NextResponse.json(
        { success: false, message: "Cannot delete Super Admin accounts" },
        { status: 403 }
      );
    }

    // Option 1: Delete the user completely
    // await User.findByIdAndDelete(adminId);

    // Option 2: Demote to regular user (safer)
    admin.role = "user";
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Admin privileges removed successfully",
    });

  } catch (error: any) {
    console.error("Failed to remove admin:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to remove admin" },
      { status: 500 }
    );
  }
}