import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/lib/models/User";
import { auth } from "@/auth";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = await props.params;
    const body = await request.json();
    
    const executive = await User.findOneAndUpdate(
      { _id: params.id, role: "sales-executive" },
      { $set: body },
      { new: true }
    ).select("-password");

    if (!executive) {
      return NextResponse.json({ error: "Executive not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: executive,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = await props.params;
    
    const result = await User.deleteOne({ _id: params.id, role: "sales-executive" });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Executive not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Executive deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
