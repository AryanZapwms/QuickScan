"use client";

import { useState, useEffect } from "react";
import { FiUpload, FiSearch, FiFileText, FiCheckCircle, FiClock } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function PartnerReportsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/partner/bookings?status=confirmed,processing,sample-collected");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleReportUpload = async (bookingId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingId(bookingId);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "reports");

      // 1. Upload to Cloudinary
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) throw new Error(uploadData.message);

      // 2. Update Booking with Report URL and status
      const updateRes = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportUrl: uploadData.url,
          status: "completed",
        }),
      });

      if (updateRes.ok) {
        toast.success("Report uploaded and notification sent!");
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Test Reports</h1>
        <p className="text-slate-500">Search for patients to upload their diagnostic results.</p>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Patient Name or ID..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Test Name</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <FiFileText className="mx-auto text-4xl mb-4 opacity-20" />
                  <p>No pending bookings found</p>
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status === 'confirmed' ? <FiCheckCircle /> : <FiClock />}
                      <span className="capitalize">{booking.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{booking.patientName}</p>
                    <p className="text-xs text-slate-500">ID: {booking.bookingId}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{booking.serviceName}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(booking.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <label className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors ${
                      uploadingId === booking._id ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                    }`}>
                      <FiUpload />
                      <span>{uploadingId === booking._id ? "Uploading..." : "Upload PDF"}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        disabled={uploadingId === booking._id}
                        onChange={(e) => handleReportUpload(booking._id, e)}
                      />
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
