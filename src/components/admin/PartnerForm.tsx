"use client";

import { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiPhone, FiLock, FiBriefcase } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface PartnerFormProps {
  partner?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PartnerForm({ partner, onClose, onSuccess }: PartnerFormProps) {
  const [formData, setFormData] = useState({
    name: partner?.name || "",
    email: partner?.email || "",
    phone: partner?.phone || "",
    password: "",
    labId: partner?.labId?._id || partner?.labId || "",
    role: partner?.role || "lab-admin",
  });

  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await fetch("/api/admin/labs?limit=100");
      const data = await res.json();
      if (data.success) setLabs(data.data);
    } catch (err) {
      toast.error("Failed to load labs");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner && !formData.password) {
        toast.error("Password is required for new accounts");
        return;
    }

    setLoading(true);
    try {
      const url = partner ? `/api/admin/partners/${partner._id}` : "/api/admin/partners";
      const method = partner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(partner ? "Partner updated" : "Partner account created");
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to save partner");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {partner ? "Edit Partner Account" : "Access Creation"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      placeholder="e.g. Rahul Sharma"
                    />
                </div>
           </div>

           <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      placeholder="account@partner.com"
                    />
                </div>
           </div>

           <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      placeholder="+91 98765 43210"
                    />
                </div>
           </div>

           {!partner && (
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                        type="password" 
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                        placeholder="••••••••"
                        />
                    </div>
                </div>
           )}

           <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Assigned Diagnostic Center</label>
                <div className="relative">
                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                      required
                      value={formData.labId}
                      onChange={(e) => setFormData({...formData, labId: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium appearance-none"
                    >
                        <option value="">Select Center...</option>
                        {labs.map(lab => (
                            <option key={lab.id} value={lab.id}>{lab.name} ({lab.city})</option>
                        ))}
                    </select>
                </div>
           </div>

           <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
                <div className="flex space-x-2">
                    {["lab-admin", "partner-staff"].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setFormData({...formData, role: r})}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                              formData.role === r ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                            {r === "lab-admin" ? "Admin" : "Staff"}
                        </button>
                    ))}
                </div>
           </div>

           <div className="pt-4">
                <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                {loading ? "Syncing..." : partner ? "Update Credential" : "Provision Account"}
                </button>
           </div>
        </form>
      </div>
    </div>
  );
}
