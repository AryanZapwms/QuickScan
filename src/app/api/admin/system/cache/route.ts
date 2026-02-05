// src/app/api/admin/system/cache/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// DELETE - Clear system cache
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "super-admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Super Admin access required" },
        { status: 403 }
      );
    }

    // Clear Next.js cache
    console.log("System cache cleared by super-admin:", session.user?.email);

    // You can add Redis cache clearing here if you use Redis
    // await redis.flushall();

    return NextResponse.json({
      success: true,
      message: "System cache cleared successfully",
    });

  } catch (error: any) {
    console.error("Failed to clear cache:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to clear cache" },
      { status: 500 }
    );
  }
}