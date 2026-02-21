"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp, 
  FiAward,
  FiCopy,
  FiExternalLink
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function SalesOverview() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/sales/overview");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${data?.stats?.referralCode || ""}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading your profile...</div>;

  const stats = [
    { label: "Total Referrals", value: data?.stats?.totalReferrals || 0, icon: FiUsers, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active This Month", value: data?.stats?.activeThisMonth || 0, icon: FiTrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pending Payout", value: `₹${(data?.stats?.pendingPayout || 0).toLocaleString()}`, icon: FiDollarSign, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Commission Level", value: data?.stats?.level || "Bronze (10%)", icon: FiAward, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Sales Executive Dashboard</h1>
        <p className="text-slate-500">Welcome back, {session?.user?.name}. Here&#39;s your performance overview.</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Your Personal Referral Link</h2>
          <p className="text-blue-100 mb-6 opacity-90 max-w-md">
            Share this link with your network. Every successful booking through this link earns you a commission.
          </p>
          <div className="flex items-center space-x-2 bg-white/10 p-1 rounded-xl border border-white/20 backdrop-blur-sm max-w-xl">
            <code className="flex-1 px-4 py-2 font-mono text-sm truncate">
              {data?.stats?.referralCode || "LOADING..."}
            </code>
            <button 
              onClick={copyReferralLink}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <FiCopy />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Conversions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.recentConversions?.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400">No conversions yet.</td></tr>
                ) : data?.recentConversions?.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{row.patientName}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{row.serviceName}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-8 border-slate-50 relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent -rotate-45"></div>
            <span className="text-3xl font-bold text-slate-900">75%</span>
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">Network Progress</h3>
          <p className="text-slate-500 text-sm mb-6">
            Keep growing your network to unlock higher commission brackets.
          </p>
          <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
            Commission Tiers
          </button>
        </div>
      </div>
    </div>
  );
}
