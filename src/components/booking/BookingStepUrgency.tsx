"use client";

import { useState, useEffect } from "react";
import Button from "../ui/Button";
import { FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

interface BookingStepUrgencyProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function BookingStepUrgency({
  data,
  updateData,
  nextStep,
  prevStep,
}: BookingStepUrgencyProps) {
  const [isUrgent, setIsUrgent] = useState(data.isUrgent || false);
  const [urgentPrice, setUrgentPrice] = useState(data.urgentFee || 500); // Default fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      if (data.serviceId) {
        try {
          const res = await fetch(`/api/services/${data.serviceId}`);
          const result = await res.json();
          if (result.success && result.data?.urgentPrice) {
            setUrgentPrice(result.data.urgentPrice);
            // If already urgent, update the fee in parent incase it changed
            if (data.isUrgent) {
              updateData({ urgentFee: result.data.urgentPrice });
            }
          }
        } catch (e) {
          console.error("Error fetching urgent price", e);
        } finally {
          setLoading(false);
        }
      } else {
        // No service selected yet, use default but don't show specific price
        setLoading(false);
      }
    };
    fetchPrice();
  }, [data.serviceId, data.isUrgent, updateData]);

  const handleContinue = () => {
    updateData({ 
      isUrgent,
      // If service is selected, use specific price. If not, use default 500 which will be updated in next step
      urgentFee: isUrgent ? urgentPrice : 0 
    });
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Need it Urgent?
        </h2>
        <p className="text-muted-foreground">
          Select if you need priority service for faster reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Option */}
        <div
          onClick={() => setIsUrgent(false)}
          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            !isUrgent
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border hover:border-primary/50"
          }`}
        >
          {/* Radio Indicator */}
          <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            !isUrgent ? "border-primary bg-primary text-white" : "border-muted-foreground"
          }`}>
            {!isUrgent && <FiCheckCircle size={14} />}
          </div>

          <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl">
              🕒
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Standard</h3>
              <div className="text-primary font-semibold mt-1">No Extra Cost</div>
            </div>
            
            <ul className="text-sm text-muted-foreground space-y-2 text-left w-full pl-4">
              <li className="flex items-center">
                <span className="mr-2">•</span> Standard reporting time
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Reports within 24-48 hrs
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Standard queue priority
              </li>
            </ul>
          </div>
        </div>

        {/* Urgent Option */}
        <div
          onClick={() => setIsUrgent(true)}
          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            isUrgent
              ? "border-orange-500 bg-orange-500/5 shadow-lg"
              : "border-border hover:border-orange-500/50"
          }`}
        >
           {/* Radio Indicator */}
           <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isUrgent ? "border-orange-500 bg-orange-500 text-white" : "border-muted-foreground"
          }`}>
            {isUrgent && <FiCheckCircle size={14} />}
          </div>

          <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Urgent / Priority</h3>
              <div className="text-orange-600 font-semibold mt-1">
                 {loading ? "..." : data.serviceId ? `+ ₹${urgentPrice} Extra` : "Starts from ₹500"}
              </div>
            </div>
            
            <ul className="text-sm text-muted-foreground space-y-2 text-left w-full pl-4">
              <li className="flex items-center">
                <span className="mr-2 text-orange-500">✓</span> Priority reporting
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-orange-500">✓</span> Reports within 4-6 hrs
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-orange-500">✓</span> Skip the queue
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isUrgent && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start text-sm text-orange-800 animate-in fade-in slide-in-from-top-2">
          <FiAlertTriangle className="mt-0.5 mr-3 flex-shrink-0" />
          <p>
            Urgent booking ensures your sample is processed immediately upon collection. 
            You will receive digital reports via email/WhatsApp as soon as they are ready.
          </p>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="w-full"
        >
          ← Back
        </Button>
        <Button
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Continue to Payment →
        </Button>
      </div>
    </div>
  );
}
