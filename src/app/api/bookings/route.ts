// app/api/bookings/route.ts - UPDATED WITH PROPER AUTH
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import Booking from "@/lib/models/Booking";
import Service from "@/lib/models/Service";
import Lab from "@/lib/models/Lab";
import mongoose from "mongoose";
import { auth } from "@/app/api/auth/[...nextauth]/route"; // Import the auth function

export async function POST(request: NextRequest) {
  try {
    console.log("📦 Booking API called - POST");

    // 🔥 GET ACTUAL AUTHENTICATED USER using NextAuth
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      console.log("❌ No authenticated user found");
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized - Please log in to book an appointment" 
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log("👤 Authenticated user ID:", userId);

    await connectDB();
    console.log("✅ Database connected");

    const body = await request.json();
    console.log("📝 Request body received");

    // Validate required fields
    const requiredFields = [
      "serviceId",
      "patientName",
      "patientEmail",
      "patientPhone",
      "appointmentDate",
      "timeSlot",
      "labId",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Get service from database
    let service;
    if (mongoose.Types.ObjectId.isValid(body.serviceId)) {
      service = await Service.findById(body.serviceId);
    } else {
      service = await Service.findOne({ slug: body.serviceId });
    }

    // If service not found in DB, create a mock one
    if (!service) {
      console.log("⚠️ Service not found in DB, creating mock service");
      const priceMap: Record<string, number> = {
        "mri-scan": 2500,
        "ct-scan": 2250,
        "health-checkup": 3500,
        "x-ray": 500,
        "blood-test": 899,
      };

      service = {
        _id: new mongoose.Types.ObjectId(),
        name: body.serviceId
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        slug: body.serviceId,
        price: priceMap[body.serviceId] || 2500,
        discountedPrice: priceMap[body.serviceId] || 2500,
        originalPrice: priceMap[body.serviceId]
          ? priceMap[body.serviceId] * 1.4
          : 3500,
        category:
          body.serviceId.replace("-scan", "").replace("-", " ") || "diagnostic",
      };
    }

    console.log("✅ Service:", service.name);

    // Get lab from database
    let lab;
    if (mongoose.Types.ObjectId.isValid(body.labId)) {
      lab = await Lab.findById(body.labId);
    }

    if (!lab) {
      lab = {
        _id: new mongoose.Types.ObjectId(body.labId),
        name: "QuickScan Diagnostic Center",
        address: "123 Medical Street, Mumbai",
        city: "Mumbai",
        phone: "022-12345678",
      };
      console.log("⚠️ Using mock lab data");
    }

    console.log("✅ Lab:", lab.name);
console.log("🧪 SERVICE CATEGORY:", service.category);


    // 🚫 MRI / CT cannot be home service
const restrictedServices = ["mri", "ct"];

if (
  restrictedServices.includes(service.category) &&
  body.appointmentType === "home-service"
) {
  return NextResponse.json(
    {
      success: false,
      message: "Home service is not allowed for MRI / CT scans",
    },
    { status: 400 }
  );
}



    // Calculate amounts
    const baseAmount = service.discountedPrice || service.price || 2500;
    const homeServiceCharge = body.appointmentType === "home-service" ? 200 : 0;
    const discount = body.couponCode ? 100 : 0;
    const taxAmount = (baseAmount + homeServiceCharge - discount) * 0.18;
    const totalAmount = baseAmount + homeServiceCharge + taxAmount - discount;

    // Generate booking ID
    const bookingId = `QS${Date.now()}${Math.floor(Math.random() * 1000)}`;

    console.log("💰 Calculated: Base ₹", baseAmount, "Total ₹", totalAmount);

    // 🔥 CRITICAL: Use actual user ID from session
    // Convert string ID to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Prepare booking data
    const bookingData: any = {
      bookingId,
      userId: userObjectId, // ACTUAL USER ID as ObjectId
      patientName: body.patientName.trim(),
      patientAge: body.patientAge ? parseInt(body.patientAge) : null,
      patientGender: body.patientGender || null,
      patientEmail: body.patientEmail.trim(),
      patientPhone: body.patientPhone.trim(),
      serviceId: service._id,
      serviceName: service.name,
      serviceType: service.category || "mri",
      labId: mongoose.Types.ObjectId.isValid(body.labId)
        ? new mongoose.Types.ObjectId(body.labId)
        : new mongoose.Types.ObjectId(),
      labName: lab.name,
      labAddress: lab.address,
      labCity: lab.city,
      appointmentDate: new Date(body.appointmentDate),
      timeSlot: body.timeSlot,
      appointmentType: body.appointmentType || "lab-visit",
      homeServiceAddress: body.homeServiceAddress || null,
      homeServicePincode: body.homeServicePincode || null,
    medicalInfo: {
  symptoms: body.symptoms || null,
  previousReports: body.previousReports || null,
  doctorReferral: body.doctorReferral || false,
  doctorName: body.doctorName || null,
},

      specialInstructions: body.specialInstructions || null,
      baseAmount,
      homeServiceCharge,
      discount,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      paymentMethod: body.paymentMethod || "cash",
      paymentStatus: body.paymentMethod === "cash" ? "pending" : "pending",
      status: "pending",
      notes: body.notes || null,
      couponCode: body.couponCode || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("📋 Booking data ready, saving...");

    // Create and save booking
    const booking = new Booking(bookingData);
    await booking.save();

    console.log("🎉 Booking saved successfully! ID:", booking.bookingId);

    // 📧 Send confirmation email (non-blocking) - Keep your existing code
    async function sendBookingConfirmationEmail(
      booking: any,
      service: any,
      lab: any
    ) {
      try {
        const formatDate = (date: Date) => {
          return date.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        };

        const emailPayload = {
          to: booking.patientEmail,
          subject: `QuickScan Medical - Appointment Confirmed (${booking.bookingId})`,
          template: "booking-confirmation",
          data: {
            patientName: booking.patientName,
            bookingId: booking.bookingId,
            serviceName: service.name,
            appointmentDate: formatDate(booking.appointmentDate),
            timeSlot: booking.timeSlot,
            labName: lab.name,
            labAddress: `${lab.address}, ${lab.city}`,
            labPhone: lab.phone || "1800-123-4567",
            amount: booking.totalAmount,
            paymentStatus: booking.paymentStatus,
            instructions: [
              "Please arrive 15 minutes before your scheduled time",
              "Bring a valid photo ID proof (Aadhar, Driving License, etc.)",
              "Carry any previous medical reports",
              "Fast for 8-10 hours if required for your test",
              "Bring doctor's prescription if applicable",
            ],
          },
        };

        const response = await fetch(
          `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/email/send`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
          }
        );

        const result = await response.json();

        if (result.success) {
          console.log(`✅ Email sent to ${booking.patientEmail}`);
        } else {
          console.warn("⚠️ Email API returned error:", result.message);
        }
      } catch (error: any) {
        console.error("⚠️ Email sending failed:", error.message);
      }
    }

    sendBookingConfirmationEmail(booking, service, lab).catch((error) => {
      console.error("⚠️ Email sending failed:", error.message);
    });

    return NextResponse.json(
      {
        success: true,
        bookingId: booking.bookingId,
        message: "Booking created successfully",
        data: {
          bookingId: booking.bookingId,
          totalAmount: booking.totalAmount,
          paymentRequired: booking.paymentMethod === "online",
          paymentLink:
            booking.paymentMethod === "online"
              ? `/api/payment/create?bookingId=${booking.bookingId}`
              : null,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Booking creation failed:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Booking creation failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("📦 GET Bookings API called");

    // 🔥 GET ACTUAL AUTHENTICATED USER using NextAuth
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      console.log("❌ No authenticated user found for GET request");
      return NextResponse.json(
        { 
          success: false, 
          message: "Unauthorized - Please log in to view your appointments" 
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log("👤 Authenticated user ID:", userId);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // 🔥 CRITICAL FIX: Convert string ID to ObjectId and filter by actual user
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Fetch bookings for ONLY this user
    const bookings = await Booking.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);

    return NextResponse.json({
      success: true,
      data: bookings,
      count: bookings.length,
      user: {
        id: userId,
        name: session.user.name,
        email: session.user.email,
      }
    });
  } catch (error: any) {
    console.error("❌ Error fetching bookings:", error.message);
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings",
        error: error.message,
      },
      { status: 500 }
    );
  }
}