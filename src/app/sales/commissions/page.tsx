"use client";

import { useState, useEffect } from "react";
import { FiDollarSign, FiCalendar, FiArrowUpRight, FiFilter } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function SalesCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ earned: 0, pending: 0, paid: 0 });

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sales/commissions");
      const data = await res.json();
      if (data.success) {
        setCommissions(data.data);
        // Calculate basic stats for demo
        const s = data.data.reduce((acc: any, curr: any) => {
          if (curr.status === 'earned') acc.earned += curr.amount;
          if (curr.status === 'pending') acc.pending += curr.amount;
          if (curr.status === 'paid') acc.paid += curr.amount;
          return acc;
        }, { earned: 0, pending: 0, paid: 0 });
        setStats(s);
      }
    } catch (error) {
      toast.error("Failed to fetch commissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Commission Earnings</h1>
          <p className="text-slate-500">Track your referral income and payout status.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-sm">
          <FiDollarSign />
          <span>Request Payout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Balance</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">₹{(stats.earned + stats.pending).toLocaleString()}</p>
          <div className="mt-4 flex items-center text-green-600 text-sm font-bold">
            <FiArrowUpRight className="mr-1" />
            <span>₹{(stats.earned).toLocaleString()} Ready to Payout</span>
          </div>
        </div>
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-emerald-100 text-sm font-medium">Total Paid Out</p>
          <p className="text-3xl font-bold mt-1">₹{stats.paid.toLocaleString()}</p>
          <p className="mt-4 text-emerald-100 text-sm">Last payout: Oct 15, 2026</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Pending Approvals</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">₹{stats.pending.toLocaleString()}</p>
          <p className="mt-4 text-slate-400 text-sm">Wait for booking completion</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-bold text-slate-900">Earning History</h3>
          <button className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 text-sm font-bold">
            <FiFilter />
            <span>Filter</span>
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {commissions.length === 0 ? (
               <tr>
               <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                 <p>No earnings records found</p>
               </td>
             </tr>
            ) : commissions.map((comm, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-600">{comm.bookingIdString}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    comm.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    comm.status === 'earned' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {comm.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {new Date(comm.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">₹{comm.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
