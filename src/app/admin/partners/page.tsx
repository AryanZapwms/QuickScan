"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiBriefcase, FiTrash2, FiEdit2, FiCheckCircle, FiShield } from "react-icons/fi";
import { toast } from "react-hot-toast";
import PartnerForm from "@/components/admin/PartnerForm";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      if (data.success) setPartners(data.data);
    } catch (error) {
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this partner's access? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted");
        fetchPartners();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Access Control</h1>
          <p className="text-gray-500">Manage user accounts for diagnostic center partners.</p>
        </div>
        <button
          onClick={() => { setEditingPartner(null); setShowForm(true); }}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl"
        >
          <FiPlus />
          <span>Provision New Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400">Syncing partner registry...</div>
        ) : partners.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 italic">
            No partner accounts provisioned yet.
          </div>
        ) : partners.map((partner) => (
          <div key={partner._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    partner.role === 'lab-admin' ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                }`}>
                  {partner.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{partner.name}</h3>
                  <p className="text-xs text-gray-500">{partner.email}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  partner.role === 'lab-admin' ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-emerald-600 text-white shadow-md shadow-emerald-100"
              }`}>
                {partner.role === 'lab-admin' ? "Admin" : "Staff"}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 space-y-3 relative z-10">
              <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wide">
                <FiBriefcase className="mr-2" />
                <span>Assigned Lab</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                 <p className="font-bold text-gray-900 text-sm">{partner.labId?.name || "UNASSIGNED"}</p>
                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{partner.labId?.city || "Unknown City"}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between relative z-10">
               <div className="flex items-center text-emerald-600 text-[10px] font-bold uppercase">
                  <FiShield className="mr-1" />
                  <span>Access Active</span>
               </div>
               <div className="flex space-x-2">
                  <button 
                    onClick={() => { setEditingPartner(partner); setShowForm(true); }}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(partner._id)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
               </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
               <FiPlus size={150} />
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <PartnerForm
          partner={editingPartner}
          onClose={() => setShowForm(false)}
          onSuccess={fetchPartners}
        />
      )}
    </div>
  );
}
