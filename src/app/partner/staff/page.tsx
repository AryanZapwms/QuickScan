"use client";

import { useState, useEffect } from "react";
import { FiUserPlus, FiMail, FiPhone, FiTrash2, FiShield, FiLock, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function PartnerStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "partner-staff"
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/partner/staff");
      const data = await res.json();
      if (data.success) setStaff(data.data);
    } catch (err) {
      toast.error("Failed to load staff list");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/partner/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Staff member added!");
        setFormData({ name: "", email: "", phone: "", role: "partner-staff" });
        fetchStaff();
      } else {
        toast.error(data.error || "Failed to invite staff");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const removeStaff = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    try {
      // Reusing admin endpoint if it's compatible, or creating a new one. 
      // For now, let's assume we use a specific partner endpoint or the admin one if the user has permissions.
      const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Staff removed");
        fetchStaff();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Staff Management</h1>
          <p className="text-slate-500">Manage access for your receptionists and technicians.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <FiUserPlus className="mr-2 text-emerald-600" />
            Add Team Member
          </h2>
          <form onSubmit={handleInvite} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="name@center.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="+91..."
                />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-100">
              Create Account
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading team members...</div>
          ) : staff.length === 0 ? (
             <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">No other staff members found.</p>
             </div>
          ) : staff.map((s) => (
            <div key={s._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-lg group-hover:scale-110 transition-transform">
                  {s.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900">{s.name}</h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg">
                      {s.role === 'lab-admin' ? "Admin" : "Staff"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500 font-medium">
                    <span className="flex items-center"><FiMail className="mr-1 text-slate-300" /> {s.email}</span>
                    <span className="flex items-center"><FiPhone className="mr-1 text-slate-300" /> {s.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => removeStaff(s._id)}
                  className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" 
                  title="Remove"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
