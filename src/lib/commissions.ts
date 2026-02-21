import Commission from "@/lib/models/Commission";
import User from "@/lib/models/User";
import Booking from "@/lib/models/Booking";
import Referral from "@/lib/models/Referral";

/**
 * Commission & Referral Logic Service
 */
export const CommissionService = {
  /**
   * Process commissions for a completed booking
   */
  async processBookingCompletion(bookingId: string) {
    try {
      const booking = await Booking.findById(bookingId).populate("userId");
      if (!booking || booking.status !== "completed") return;

      // Check if this booking came from a referral
      if (booking.referralCode) {
        const referral = await Referral.findOne({ code: booking.referralCode });
        if (referral) {
          const salesExec = await User.findById(referral.ownerId);
          if (salesExec) {
            const commissionRate = salesExec.commissionRate || 10; // Default 10%
            const commissionAmount = (booking.totalAmount * commissionRate) / 100;

            // Create Commission Record
            await Commission.create({
              userId: salesExec._id,
              bookingId: booking._id,
              bookingIdString: booking.bookingId,
              amount: commissionAmount,
              percentage: commissionRate,
              status: "earned",
            });

            // Update Referral Stats
            referral.usageCount += 1;
            referral.revenueGenerated += booking.totalAmount;
            await referral.save();

            console.log(`[Commission] Earned ₹${commissionAmount} by ${salesExec.name}`);
          }
        }
      }
    } catch (error) {
      console.error("Failed to process commission:", error);
    }
  },

  /**
   * Calculate pending payouts for a user
   */
  async getPendingPayout(userId: string) {
    const earned = await Commission.aggregate([
      { $match: { userId: userId, status: "earned" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    return earned[0]?.total || 0;
  }
};
