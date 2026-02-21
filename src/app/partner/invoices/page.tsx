"use client";

import { useState, useEffect } from "react";
import { FiFileText, FiDownload, FiDollarSign, FiCalendar, FiArrowUpRight, FiSearch, FiTrendingUp } from "react-icons/fi";

export default function PartnerInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/partner/invoices");
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data.invoices);
        setStats(json.data.stats);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading billing history...</div>;

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settlements & Invoices</h1>
          <p className="text-slate-500">View your center&#39;s payout history and download tax invoices.</p>
        </div>
        <div className="flex space-x-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <p className="text-xs font-bold text-slate-500 uppercase">Current Cycle</p>
             <p className="text-xl font-bold text-emerald-600">₹38,200</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
             <div className="bg-emerald-500/20 p-2 rounded-lg"><FiDollarSign className="text-emerald-400" /></div>
             <FiArrowUpRight className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm">Next Settlement</p>
          <p className="text-2xl font-bold">End of Month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Total Settled (Lifetime)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹{(stats?.totalSettled || 0).toLocaleString()}</p>
            <div className="flex items-center text-emerald-600 text-[10px] font-bold mt-3 uppercase tracking-wider">
               <FiTrendingUp className="mr-1" />
               <span>Growing steadily</span>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Pending Verification</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹0</p>
            <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">
               All bookings audited
            </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center">
                <FiFileText className="mr-2 text-blue-600" />
                Billing History
            </h3>
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Invoice #" 
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Settle Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{inv.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{inv.period}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      inv.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Download PDF">
                      <FiDownload size={20} />
                    </button>
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
