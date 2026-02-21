"use client";

import { useState, useEffect } from "react";
import { 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiCheckCircle, 
  FiMoreVertical,
  FiPhone,
  FiMapPin
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function PartnerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "all" 
        ? "/api/partner/bookings" 
        : `/api/partner/bookings?status=${statusFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/partner/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.patientName.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingId.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "sample-collected": return "bg-purple-100 text-purple-700";
      case "processing": return "bg-indigo-100 text-indigo-700";
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Appointment Manager</h1>
          <p className="text-slate-500">Track and manage all diagnostic appointments for your center.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search patient name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <FiFilter className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="sample-collected">Sample Collected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Patient & Booking</th>
                <th className="px-8 py-5">Service Details</th>
                <th className="px-8 py-5">Schedule</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    Syncing with laboratory registry...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                      <FiCalendar className="mx-auto text-4xl mb-4 opacity-20" />
                      <p className="font-medium">No appointments found matching your criteria.</p>
                   </td>
                </tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                          {booking.patientName?.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 leading-tight">{booking.patientName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">ID: {booking.bookingId}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-700 text-sm">{booking.serviceName}</p>
                    <div className="flex items-center text-xs text-slate-400 mt-1">
                       {booking.appointmentType === 'home-service' ? (
                          <span className="flex items-center text-amber-600 font-bold uppercase text-[9px]">
                             <FiMapPin className="mr-1" /> Home Service
                          </span>
                       ) : (
                          <span className="flex items-center text-blue-600 font-bold uppercase text-[9px]">
                             <FiCheckCircle className="mr-1" /> Lab Visit
                          </span>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-slate-900 font-bold text-sm">
                       <FiCalendar className="mr-2 text-slate-400" />
                       {new Date(booking.appointmentDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                       <FiClock className="mr-2 text-slate-400" />
                       {booking.timeSlot}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex justify-end">
                        <select 
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer hover:bg-white"
                          value={booking.status}
                          onChange={(e) => updateStatus(booking._id, e.target.value)}
                        >
                           <option value="pending">Mark Pending</option>
                           <option value="confirmed">Confirm Appointment</option>
                           <option value="sample-collected">Sample Collected</option>
                           <option value="processing">Start Processing</option>
                           <option value="completed">Mark Completed</option>
                           <option value="cancelled">Cancel Booking</option>
                        </select>
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
