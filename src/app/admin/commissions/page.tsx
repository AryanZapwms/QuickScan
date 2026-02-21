"use client";

import { useState, useEffect } from "react";
import { FiCheckCircle, FiClock, FiDollarSign, FiFilter, FiDownload, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/commissions");
      const data = await res.json();
      if (data.success) {
        setCommissions(data.data);
      } else {
        toast.error("Failed to load commissions ledger");
      }
    } catch (error) {
      toast.error("Failed to load commissions ledger");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayout = async (id: string) => {
    try {
        const res = await fetch("/api/admin/commissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commissionId: id, status: "paid" })
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Payout marked as paid");
            fetchCommissions();
        } else {
            toast.error(data.error || "Failed to approve");
        }
    } catch (error) {
        toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission Settlements</h1>
          <p className="text-gray-500">Approve and track payouts for the sales executive team.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition">
            <FiDownload />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex space-x-4">
               <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Commission Ledger</span>
            </div>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 text-sm font-bold">
                <FiFilter />
                <span>Filter by Exec</span>
            </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Executive</th>
              <th className="px-6 py-4">Booking Ref</th>
              <th className="px-6 py-4">Commission</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-12 text-center text-gray-400">Loading ledger...</td></tr>
            ) : commissions.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-gray-400">No commission records found</td></tr>
            ) : commissions.map((comm) => (
              <tr key={comm._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-900">{comm.userId?.name || "Deleted User"}</p>
                      <p className="text-[10px] text-gray-500">{comm.userId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{comm.bookingIdString || "N/A"}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{comm.amount}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-1 rounded-full w-fit ${
                    comm.status === 'paid' ? 'bg-green-100 text-green-700' : 
                    comm.status === 'earned' ? 'bg-blue-100 text-blue-700' :
                    comm.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {comm.status === 'paid' ? <FiCheckCircle /> : <FiClock />}
                    <span>{comm.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(comm.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleApprovePayout(comm._id)}
                    className="text-blue-600 font-bold hover:underline text-sm disabled:opacity-30" 
                    disabled={comm.status === 'paid' || comm.status === 'cancelled'}
                  >
                    {comm.status === 'paid' ? "Settled" : "Mark as Paid"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
