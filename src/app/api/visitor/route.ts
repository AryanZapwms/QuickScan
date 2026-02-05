import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import VisitingUser from "@/lib/models/VisitingUser";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, interestedService } = body;

    // Validate fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, Email, and Phone are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists (optional: update timestamp or ignore)
    // For now, we'll just create a new entry so we see repeated interest
    const newVisitor = await VisitingUser.create({
      name,
      email,
      phone,
      interestedService: interestedService || "General Visit",
    });

    return NextResponse.json(
      { message: "Details saved successfully", data: newVisitor },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Visitor Capture Error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error.message,
        details: error.toString() 
      },
      { status: 500 }
    );
  }
}
