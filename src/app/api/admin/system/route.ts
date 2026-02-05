// src/app/api/admin/system/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/database";
// We'll handle SystemSetting differently since you may not have the model

// GET system settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    // Return default settings for now
    // You can implement database storage later
    const settings = {
      siteName: "QuickScan Medical",
      siteUrl: "https://quickscan.medical",
      supportEmail: "support@quickscan.medical",
      supportPhone: "+91 9876543210",
      maintenanceMode: false,
      allowRegistrations: true,
      bookingWindowDays: 30,
      maxBookingsPerDay: 50,
      invoicePrefix: "QS",
    };

    return NextResponse.json({
      success: true,
      data: settings,
    });

  } catch (error: any) {
    console.error("Failed to fetch system settings:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch system settings" },
      { status: 500 }
    );
  }
}

// UPDATE system settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "siteName", "siteUrl", "supportEmail", "supportPhone", 
      "bookingWindowDays", "maxBookingsPerDay", "invoicePrefix"
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // For now, just return success
    // In production, you would save these to a database
    console.log("System settings updated by super-admin:", session.user?.email, body);

    return NextResponse.json({
      success: true,
      message: "System settings updated successfully",
      data: body,
    });

  } catch (error: any) {
    console.error("Failed to update system settings:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update system settings" },
      { status: 500 }
    );
  }
}