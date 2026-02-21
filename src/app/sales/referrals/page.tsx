"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiArrowUpRight, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function SalesReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sales/referrals");
      const json = await res.json();
      if (json.success) setReferrals(json.data);
    } catch (err) {
      toast.error("Failed to load your network");
    } finally {
      setLoading(false);
    }
  };

  const filteredReferrals = referrals.filter(ref => 
    ref.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Referrals</h1>
          <p className="text-slate-500">View and manage customers who signed up using your link.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-right">
           <p className="text-xs font-bold text-slate-500 uppercase">Total Network</p>
           <p className="text-2xl font-bold text-blue-600">{referrals.length} Patients</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search network..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Booking Status</th>
                <th className="px-6 py-4">Total spent</th>
                <th className="px-6 py-4 text-right">Your Earning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan={5} className="p-12 text-center text-slate-400">Loading your network...</td>
                </tr>
              ) : filteredReferrals.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-12 text-center text-slate-400">No matching referrals found.</td>
                </tr>
              ) : filteredReferrals.map((ref, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs text-uppercase">
                        {(ref.patientName || "?").charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{ref.patientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(ref.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      ref.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      ref.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">₹{(ref.revenue || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 font-bold flex items-center justify-end">
                        ₹{(ref.commission || 0).toLocaleString()}
                        <FiArrowUpRight className="ml-1" />
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{ref.commStatus}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
