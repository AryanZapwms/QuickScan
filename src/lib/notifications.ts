import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotificationPayload {
  to: string;
  name: string;
  subject: string;
  message: string;
  metadata?: any;
}

/**
 * Unified Notification Service
 * Handles Email, SMS, and WhatsApp alerts
 */
export const NotificationService = {
  /**
   * Send a booking confirmation
   */
  async sendBookingConfirmation(payload: {
    email: string;
    phone: string;
    patientName: string;
    bookingId: string;
    serviceName: string;
    appointmentDate: string;
    timeSlot: string;
  }) {
    console.log(`[Notification] Sending confirmation for ${payload.bookingId}`);

    // 1. Send Email via Resend
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "QuickScan <bookings@quickscan.medical>",
          to: payload.email,
          subject: `Booking Confirmed: ${payload.bookingId}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2>Booking Confirmed!</h2>
              <p>Hi ${payload.patientName}, your appointment for <strong>${payload.serviceName}</strong> is confirmed.</p>
              <div style="background: #f0f4ff; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p><strong>Booking ID:</strong> ${payload.bookingId}</p>
                <p><strong>Date:</strong> ${payload.appointmentDate}</p>
                <p><strong>Time:</strong> ${payload.timeSlot}</p>
              </div>
              <p>Thank you for choosing QuickScan.</p>
            </div>
          `,
        });
      }
    } catch (error) {
      console.error("Email notification failed:", error);
    }

    // 2. SMS / WhatsApp (Placeholder for Twilio/Interakt)
    // In a real app, you'd call Twilio API here
    console.log(`[SMS/WhatsApp] Confirmed to ${payload.phone}: ${payload.serviceName} on ${payload.appointmentDate}`);
  },

  /**
   * Send Report Ready notification
   */
  async sendReportReady(payload: {
    email: string;
    patientName: string;
    serviceName: string;
    reportUrl: string;
  }) {
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "QuickScan Reports <reports@quickscan.medical>",
          to: payload.email,
          subject: `${payload.serviceName} Report is Ready`,
          html: `
            <h3>Hi ${payload.patientName},</h3>
            <p>Your medical report for ${payload.serviceName} is now available.</p>
            <p><a href="${payload.reportUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View Report</a></p>
          `,
        });
      }
    } catch (error) {
      console.error("Report notification failed:", error);
    }
  }
};
