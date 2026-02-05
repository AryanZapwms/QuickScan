// src/lib/email.ts (add this function)
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminInviteEmail(
  email: string, 
  name: string, 
  tempPassword: string,
  role: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "QuickScan Admin <admin@quickscan.medical>",
      to: email,
      subject: `Welcome to QuickScan Admin Portal - ${role} Role`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to QuickScan Admin Portal</h2>
          <p>Hello ${name},</p>
          <p>You have been added as a <strong>${role}</strong> to the QuickScan Medical Admin Portal.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p style="color: #d32f2f; font-size: 14px;">
              <strong>Important:</strong> Please change your password after first login.
            </p>
          </div>
          
          <p>
            <a href="${process.env.NEXTAUTH_URL}/auth/login" 
               style="background: #1976d2; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Login to Admin Portal
            </a>
          </p>
          
          <p>Best regards,<br>QuickScan Medical Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending admin invite email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send admin invite email:", error);
    throw error;
  }
}