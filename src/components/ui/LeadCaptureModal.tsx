"use client";

import { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiPhone, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

const LeadCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has already submitted or dismissed recently
    const hasSubmitted = localStorage.getItem("quickscan_lead_submitted");
    const dismissedTime = localStorage.getItem("quickscan_lead_dismissed");
    
    // If submitted, don't show
    if (hasSubmitted) return;

    // If dismissed, check if it was less than 1 hour ago
    if (dismissedTime) {
      const timeSinceDismissed = Date.now() - parseInt(dismissedTime);
      if (timeSinceDismissed < 60 * 60 * 1000) return; // 1 hour
    }

    // Show modal after 8 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("quickscan_lead_dismissed", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/visitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        localStorage.setItem("quickscan_lead_submitted", "true");
        toast.success("Thank you! We'll be in touch.");
        
        // Close modal after showing success message
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors bg-secondary rounded-full p-1 border-0"
        >
          <FiX size={20} />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                Your details have been saved. Our health expert will contact you shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Get a Free Health Consultation
                </h3>
                <p className="text-muted-foreground text-sm">
                  Join 250,000+ happy patients. Fill your details to get exclusive offers and proper guidance.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all bg-background text-foreground"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all bg-background text-foreground"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground ml-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all bg-background text-foreground"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2 border-0"
                >
                  {loading ? "Submitting..." : "Get Free Consultation"}
                </button>
              </form>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Your data is safe with us. We don&apos;t spam.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
