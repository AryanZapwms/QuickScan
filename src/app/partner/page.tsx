"use client";


import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  FiCalendar, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp,
  FiActivity,
  FiUpload,
  FiUser
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function PartnerOverview() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerStats();
  }, []);

  const fetchPartnerStats = async () => {
    try {
      const res = await fetch("/api/partner/overview");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      toast.error("Failed to load partner dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading center dashboard...</div>;

  const stats = [
    { label: "Today's Bookings", value: data?.stats?.todaysBookings || 0, icon: FiCalendar, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Pending Reports", value: data?.stats?.pendingReports || 0, icon: FiClock, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Completed Overall", value: data?.stats?.totalCompleted || 0, icon: FiCheckCircle, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Monthly Revenue", value: `₹${(data?.stats?.monthlyRevenue || 0).toLocaleString()}`, icon: FiTrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Partner Dashboard</h1>
        <p className="text-slate-500">Center: {data?.stats?.labName || "Diagnostic Center"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center">
              <FiActivity className="mr-2 text-emerald-600" />
              Today&#39;s Appointment Schedule
            </h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">
              Live View
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {data?.schedule?.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">No appointments for today yet.</div>
            ) : data?.schedule?.map((appt: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-center w-20">
                    <p className="text-sm font-bold text-slate-900">{appt.timeSlot}</p>
                  </div>
                  <div className="border-l border-slate-200 h-8"></div>
                  <div>
                    <p className="font-bold text-slate-900">{appt.patientName}</p>
                    <p className="text-sm text-slate-500">{appt.serviceName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                    appt.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {appt.status.toUpperCase()}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    <FiUpload className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
            <Link href="/partner/bookings" className="text-sm font-bold text-emerald-600 hover:underline">
              View All Appointments
            </Link>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/partner/reports" className="flex items-center space-x-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-colors w-full text-left">
                <FiUpload className="w-5 h-5" />
                <span>Bulk Upload Reports</span>
              </Link>
              <Link href="/partner/slots" className="flex items-center space-x-3 p-4 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors w-full text-left">
                <FiClock className="w-5 h-5" />
                <span>Adjust Today's Slots</span>
              </Link>
              <Link href="/partner/staff" className="flex items-center space-x-3 p-4 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors w-full text-left">
                <FiUser className="w-5 h-5" />
                <span>Manage Center Staff</span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
            <h3 className="font-bold text-lg mb-2 relative z-10">Revenue Overview</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">Your estimated payout for the current cycle.</p>
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Unsettled Amount</p>
                <p className="text-3xl font-bold">₹{(data?.stats?.monthlyRevenue || 0).toLocaleString()}</p>
              </div>
              <FiTrendingUp className="w-12 h-12 text-emerald-500/50" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
