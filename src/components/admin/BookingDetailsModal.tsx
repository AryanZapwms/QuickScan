"use client";

import { useState } from "react";
import { FiX, FiCheck, FiXCircle, FiPrinter, FiCalendar, FiUser, FiDollarSign, FiFileText, FiDownload } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface BookingDetails {
  id: string;
  bookingId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  patientAge?: number;
  patientGender?: string;
  serviceName: string;
  serviceType?: string;
  labName?: string;
  labAddress?: string;
  appointmentDate: string;
  timeSlot: string;
  appointmentType?: string;
  totalAmount: number;
  baseAmount?: number;
  discount?: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  referralCode?: string;
  reportUrl?: string;
  reportUploadedAt?: string;
  notes?: string;
  createdAt?: string;
}

interface BookingDetailsModalProps {
  booking: BookingDetails | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function BookingDetailsModal({
  booking,
  onClose,
  onRefresh,
}: BookingDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/confirm`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      toast.success("Booking confirmed");
      onRefresh?.();
      onClose();
    } catch {
      toast.error("Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/cancel`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      toast.success("Booking cancelled");
      onRefresh?.();
      onClose();
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <p className="text-sm text-gray-500 mt-1">{booking.bookingId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              Payment: <span className="font-medium">{booking.paymentStatus}</span>
            </span>
          </div>

          {/* Patient Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FiUser className="mr-2" /> Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{booking.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{booking.patientEmail}</p>
              </div>
              {booking.patientPhone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{booking.patientPhone}</p>
                </div>
              )}
              {booking.patientAge && (
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{booking.patientAge} years</p>
                </div>
              )}
              {booking.patientGender && (
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{booking.patientGender}</p>
              </div>
              )}
              {booking.referralCode && (
                <div>
                  <p className="text-sm text-gray-500">Referral Code</p>
                  <p className="font-bold text-blue-600 uppercase">{booking.referralCode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FiCalendar className="mr-2" /> Service Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{booking.serviceName}</p>
              </div>
              {booking.labName && (
                <div>
                  <p className="text-sm text-gray-500">Lab/Center</p>
                  <p className="font-medium">{booking.labName}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Appointment Date</p>
                <p className="font-medium">{formatDate(booking.appointmentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Slot</p>
                <p className="font-medium">{booking.timeSlot}</p>
              </div>
              {booking.appointmentType && (
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{booking.appointmentType.replace("-", " ")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FiDollarSign className="mr-2" /> Payment Information
            </h3>
            <div className="space-y-2">
              {booking.baseAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Amount</span>
                  <span className="font-medium">₹{booking.baseAmount?.toLocaleString() || 0}</span>
                </div>
              )}
              {booking.discount && booking.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{booking.discount?.toLocaleString() || 0}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total Amount</span>
                <span>₹{(booking.totalAmount || 0).toLocaleString()}</span>
              </div>
              {booking.paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{booking.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reports */}
          {booking.reportUrl && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <FiFileText className="mr-2" /> Diagnostic Report
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Uploaded on {formatDate(booking.reportUploadedAt || "")}</p>
                </div>
                <a 
                  href={booking.reportUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <FiDownload />
                  <span>View Report</span>
                </a>
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <FiPrinter />
            <span>Print Invoice</span>
          </button>

          <div className="flex space-x-3">
            {booking.status === "pending" && (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <FiXCircle />
                  <span>{loading ? "Cancelling..." : "Cancel Booking"}</span>
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <FiCheck />
                  <span>{loading ? "Confirming..." : "Confirm Booking"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
