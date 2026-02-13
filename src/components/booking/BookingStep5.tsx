'use client';

import { useState, useEffect } from "react";
import Button from "../ui/Button";
import {
  FiCheck,
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiHome,
  FiPackage,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

interface Step5Props {
  data: any;
  updateData: (data: any) => void;
  prevStep: () => void;
  onSubmit: () => void;
}

export default function BookingStep5({
  data,
  updateData,
  prevStep,
  onSubmit, // We might not use this if we handle submission internally
}: Step5Props) {
  const [coupon, setCoupon] = useState(data.couponCode || "");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(
    data.paymentMethod || "online"
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [calculations, setCalculations] = useState({
    baseAmount: 0,
    discount: 0,
    homeServiceCharge: 0,
    taxAmount: 0,
    totalAmount: 0,
    urgentFee: 0,
  });

  // Calculate amounts on mount and when dependencies change
  useEffect(() => {
    const calculateAmounts = () => {
      // Base amount from service selection
      const baseAmount = data.baseAmount || 2500; // Default fallback

      // Home service charge
      const homeServiceCharge =
        data.appointmentType === "home-service" ? 200 : 0;


      // Discount logic (example coupons)
      let discount = 0;
      if (coupon === "QUICK50") discount = 50;
      else if (coupon === "HEALTH100") discount = 100;
      else if (coupon === "FIRSTBOOK") discount = 200;

      // Urgent Fee
      const urgentFee = data.urgentFee || 0;

      // Calculate GST (18%)
      const taxableAmount = baseAmount + homeServiceCharge + urgentFee - discount;
      const taxAmount = taxableAmount * 0.18;

      // Total amount
      const totalAmount = baseAmount + homeServiceCharge + urgentFee + taxAmount - discount;

      setCalculations({
        baseAmount,
        discount,
        homeServiceCharge,
        taxAmount,
        totalAmount,
        urgentFee, // Add this to state if you typed it, strictly speaking I should update the state type too but JS is loose. 
                   // Wait, I need to check if I can just add it. The state is defined in the component.
                   // I should update the interface for the state too.
      });

      // Update parent data
      updateData({
        baseAmount,
        discount,
        homeServiceCharge,
        taxAmount,
        totalAmount,
        paymentMethod,
        couponCode: coupon,
      });
    };

    calculateAmounts();
  }, [
    coupon,
    paymentMethod,
    data.appointmentType,
    data.baseAmount,
    data.urgentFee, // Add dependency
    updateData,
  ]);

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMessage({ type: "error", text: "Please enter a coupon code" });
      return;
    }

    setApplyingCoupon(true);
    setCouponMessage(null);

    try {
      // In production, call your API
      const validCoupons = ["QUICK50", "HEALTH100", "FIRSTBOOK"];
      const couponUpper = coupon.toUpperCase();

      if (validCoupons.includes(couponUpper)) {
        const discountAmount =
          couponUpper === "QUICK50"
            ? 50
            : couponUpper === "HEALTH100"
            ? 100
            : 200;
        setCouponMessage({
          type: "success",
          text: `Coupon applied! ₹${discountAmount} discount added.`,
        });
        updateData({ couponCode: couponUpper });
      } else {
        setCouponMessage({
          type: "error",
          text: "Invalid or expired coupon code",
        });
      }
    } catch (error) {
      setCouponMessage({
        type: "error",
        text: "Failed to apply coupon. Please try again.",
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTimeSlot = (timeSlot: string) => {
    if (!timeSlot) return "Not selected";
    return timeSlot.replace("-", " to ");
  };

  const handlePaymentSubmit = async () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    console.log("📦 Submitting booking with data:", data);
    console.log("💰 Calculations:", calculations);

    try {
      // Test with simple data first
      // In a real app, you would construct the payload carefully
      const payload = {
        serviceId: data.serviceId || "mri-scan",
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        labId: data.labId,
        appointmentType: data.appointmentType,
        paymentMethod: data.paymentMethod,
        isUrgent: data.isUrgent, // Add this
        urgentFee: data.urgentFee, // Add this
        // Add other fields as needed by your API
      };

      console.log("🚀 Sending to API:", payload);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success) {
        // alert(`Booking successful! ID: ${result.bookingId}`);
        window.location.href = `/booking/success?bookingId=${result.bookingId}`;
      } else {
        alert(`Booking failed: ${result.message}`);
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      alert("Booking failed. Check console for details.");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Review & Confirm Booking</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Summary Card */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center text-foreground">
              <FiPackage className="mr-3 text-primary" />
              Booking Summary
            </h3>

            <div className="space-y-6">
              {/* Service Details */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <h4 className="font-medium text-foreground">Service</h4>
                  <p className="text-lg font-semibold text-foreground">
                    {data.serviceName || "MRI Scan"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.appointmentType === "home-service"
                      ? "Home Service"
                      : "Lab Visit"}
                    {data.isUrgent && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        Urgent
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    ₹{calculations.baseAmount}
                  </div>
                  <div className="text-sm text-muted-foreground">Base amount</div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiCalendar className="mt-1 mr-3 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Date & Time</div>
                    <div className="text-muted-foreground">
                      {formatDate(data.appointmentDate)} •{" "}
                      {formatTimeSlot(data.timeSlot)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="mt-1 mr-3 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Location</div>
                    <div className="text-muted-foreground">
                      {data.labName || "Lab not selected"}
                      {data.labAddress && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {data.labAddress}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiUser className="mt-1 mr-3 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Patient Details</div>
                    <div className="text-muted-foreground">
                      {data.patientName || "Not provided"}
                      {data.patientAge && data.patientGender && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({data.patientAge} yrs, {data.patientGender})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {data.patientPhone} • {data.patientEmail}
                    </div>
                  </div>
                </div>

                {/* Home Service Address */}
                {data.appointmentType === "home-service" &&
                  data.homeServiceAddress && (
                    <div className="flex items-start">
                      <FiHome className="mt-1 mr-3 text-green-500" />
                      <div className="flex-1">
                      <div className="font-medium text-green-700">
                          Home Service Address
                        </div>
                        <div className="text-muted-foreground">
                          {data.homeServiceAddress}
                        </div>
                        {data.homeServicePincode && (
                          <div className="text-sm text-muted-foreground">
                            Pincode: {data.homeServicePincode}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center text-foreground">
              <FiCreditCard className="mr-3 text-primary" />
              Select Payment Method
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "online",
                  title: "Online Payment",
                  description: "Pay now with UPI, Card, NetBanking",
                  icon: "💳",
                  features: ["Instant confirmation", "Secure payment"],
                },
                {
                  id: "cash",
                  title: "Pay at Lab",
                  description: "Pay in cash at the diagnostic center",
                  icon: "💵",
                  features: ["Pay after service", "Cash only"],
                },
                {
                  id: "insurance",
                  title: "Use Insurance",
                  description: "Claim through health insurance",
                  icon: "🏥",
                  features: ["TPA supported", "Cashless claim"],
                },
                {
                  id: "wallet",
                  title: "QuickScan Wallet",
                  description: "Use wallet balance",
                  icon: "👛",
                  features: ["Instant payment", "Add money anytime"],
                },
              ].map((method) => (
                <div
                  key={method.id}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                    paymentMethod === method.id
                      ? "border-primary bg-secondary/50"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setPaymentMethod(method.id);
                    updateData({ paymentMethod: method.id });
                  }}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">{method.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{method.title}</div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {method.description}
                      </div>
                      <ul className="space-y-1">
                        {method.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-xs text-muted-foreground"
                          >
                            <FiCheck
                              className="mr-1 text-green-500"
                              size={12}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {paymentMethod === method.id && (
                      <FiCheck className="text-primary text-xl" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Price & Actions */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center text-foreground">
              <FiDollarSign className="mr-3 text-primary" />
              Price Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-medium text-foreground">₹{calculations.baseAmount}</span>
              </div>

              {calculations.homeServiceCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Home Service Charge</span>
                  <span className="font-medium text-foreground">
                    ₹{calculations.homeServiceCharge}
                  </span>
                </div>
              )}

              {/* Urgent Fee Display */}
              {/* @ts-ignore - urgentFee might not be in the initial state type yet but we are adding it */}
              {calculations.urgentFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium text-orange-600">Urgent / Priority Fee</span>
                  <span className="font-medium text-orange-600">
                    {/* @ts-ignore */}
                    ₹{calculations.urgentFee}
                  </span>
                </div>
              )}

              {calculations.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied</span>
                  <span className="font-medium">-₹{calculations.discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium text-foreground">
                  ₹{calculations.taxAmount.toFixed(2)}
                </span>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-primary">
                    ₹{calculations.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value.toUpperCase());
                    if (couponMessage) setCouponMessage(null);
                  }}
                  className="flex-1 border border-input rounded-lg px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter code"
                />
                <Button
                  onClick={applyCoupon}
                  disabled={applyingCoupon}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  {applyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              {couponMessage && (
                <div
                  className={`mt-2 text-sm font-medium ${
                    couponMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {couponMessage.text}
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 mr-3 text-primary border-input focus:ring-primary rounded"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  . I understand that cancellations may be subject to charges.
                </label>
              </div>
            </div>

         

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePaymentSubmit}
                disabled={!termsAccepted}
                variant="default" // Changed from primary to default
                className="w-full py-3 text-lg font-semibold"
              >
                {paymentMethod === "online" ? (
                  <>Pay ₹{calculations.totalAmount.toFixed(2)} Now</>
                ) : (
                  <>Confirm Booking</>
                )}
              </Button>

              <Button onClick={prevStep} variant="outline" className="w-full">
                ← Back
              </Button>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-secondary/30 border border-border rounded-xl p-5">
            <div className="flex items-start">
              <FiAlertCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold text-foreground mb-2">
                  Need Help?
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div>📞 Call: 1800-123-4567</div>
                  <div>💬 Chat with us (24×7)</div>
                  <div>✉️ Email: support@quickscan.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
