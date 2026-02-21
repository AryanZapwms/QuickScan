"use client";

import { useState, useEffect } from "react";
import { FiClock, FiCalendar, FiSave, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function PartnerSlotsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/partner/slots?date=${selectedDate}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSlots(data.data);
      } else {
        // Generate default slots if none exist for this date
        setSlots(generateDefaultSlots());
      }
    } catch (error) {
      toast.error("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultSlots = () => {
    const times = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
    return times.map(t => ({
      time: t,
      available: true,
      capacity: 2
    }));
  };

  const toggleSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots[index].available = !newSlots[index].available;
    setSlots(newSlots);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/partner/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          slots: slots
        })
      });
      if (res.ok) {
        toast.success("Availability updated successfully");
      }
    } catch (error) {
      toast.error("Failed to save slots");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Slot Management</h1>
          <p className="text-slate-500">Manage your lab&#39;s daily availability and capacity.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md transition"
        >
          <FiSave />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <p className="text-sm text-slate-500 flex items-center">
            <FiAlertCircle className="mr-1" />
            Changing slots only affects new bookings.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400">Loading availability...</div>
          ) : slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => toggleSlot(i)}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center ${
                slot.available 
                ? "border-emerald-100 bg-emerald-50 text-emerald-900 hover:border-emerald-300" 
                : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
              }`}
            >
              <FiClock className="text-xl mb-2" />
              <span className="font-bold">{slot.time}</span>
              <span className="text-[10px] mt-2 uppercase font-bold tracking-wider">
                {slot.available ? "Active" : "Blocked"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
