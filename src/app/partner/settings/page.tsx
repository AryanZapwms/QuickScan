"use client";

import { useState, useEffect } from "react";
import { FiSave, FiMapPin, FiPhone, FiMail, FiClock, FiSettings } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function PartnerSettingsPage() {
  const [lab, setLab] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLabSettings();
  }, []);

  const fetchLabSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/partner/lab");
      const json = await res.json();
      if (json.success) setLab(json.data);
    } catch (error) {
      toast.error("Failed to load center settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        const formData = new FormData(e.target as HTMLFormElement);
        const updateData = Object.fromEntries(formData.entries());

        const res = await fetch("/api/partner/lab", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        const json = await res.json();
        if(json.success) {
            toast.success("Center information updated!");
            setLab(json.data);
        } else {
            toast.error(json.error || "Update failed");
        }
    } catch (err) {
        toast.error("An error occurred");
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <FiSettings className="mr-2" />
            Diagnostic Center Settings
        </h1>
        <p className="text-slate-500">Update your diagnostic center&#39;s public profile, contact info, and hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Display Name</label>
              <input 
                type="text" 
                name="name"
                defaultValue={lab?.name}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  name="email"
                  defaultValue={lab?.email}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Support Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  name="phone"
                  defaultValue={lab?.phone}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Opening Hours</label>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  name="openingHours"
                  defaultValue={lab?.openingHours || "07:00 AM - 10:00 PM"}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Full Address</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-6 -translate-y-1/2 text-slate-400" />
              <textarea 
                rows={3}
                name="address"
                defaultValue={lab?.address}
                className="w-full pl-10 pr-4 py-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 border border-slate-200 rounded-xl">
             Discard Changes
          </button>
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-md transition disabled:opacity-50"
          >
            <FiSave />
            <span>{saving ? "Saving..." : "Update Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
