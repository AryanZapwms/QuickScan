"use client";

import { useState, useEffect } from "react";
import { FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function SalesPayoutsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const res = await fetch("/api/sales/payouts");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      toast.error("Failed to load payout data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading your earnings...</div>;

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payouts & Earnings</h1>
          <p className="text-slate-500">Track your processed payments and upcoming settlements.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Available for Payout</p>
                <p className="text-2xl font-bold text-slate-900">₹{(data?.stats?.availableForPayout || 0).toLocaleString()}</p>
             </div>
             <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200">
                Request Payout
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium">Lifetime Earnings</p>
                <p className="text-3xl font-bold mt-1">₹{(data?.stats?.lifetimeEarnings || 0).toLocaleString()}</p>
                <div className="flex items-center space-x-1 text-emerald-400 text-xs mt-4 font-bold">
                    <FiTrendingUp />
                    <span>Real-time earnings tracker</span>
                </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-white/5"><FiDollarSign size={100} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Last Settlement</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
                {data?.stats?.lastPayoutDate ? new Date(data.stats.lastPayoutDate).toLocaleDateString() : "No payouts yet"}
            </p>
            <p className="text-xs text-slate-400 mt-4 font-bold flex items-center">
                <FiClock className="mr-1" /> Next cycle: End of month
            </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Payout Method</p>
            <p className="text-lg font-bold text-slate-900 mt-1 truncate">UPI: Default</p>
            <button className="text-blue-600 text-xs mt-4 font-bold hover:underline">Change details</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-900">Commission History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.commissions?.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400">No earnings recorded yet.</td></tr>
              ) : data?.commissions?.map((pay: any) => (
                <tr key={pay._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{pay._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(pay.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{pay.bookingIdString || "Ref-Booking"}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{pay.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center space-x-1 text-[10px] font-bold uppercase px-3 py-1 rounded-full w-fit ${
                      pay.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                      pay.status === 'earned' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {pay.status === 'paid' ? <FiCheckCircle /> : <FiClock />}
                      <span>{pay.status}</span>
                    </span>
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
