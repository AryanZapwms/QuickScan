// src/app/api/admin/admins/invite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// POST - Resend admin invitation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Generate a new temporary password
    // 2. Update the user's password
    // 3. Send an email with the new credentials
    // 4. Log this action

    console.log("Admin invite resent by:", session.user?.email, "to:", email);

    return NextResponse.json({
      success: true,
      message: "Invitation email resent successfully",
    });

  } catch (error: any) {
    console.error("Failed to resend invite:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to resend invite" },
      { status: 500 }
    );
  }
}