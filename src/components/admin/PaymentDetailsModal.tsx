"use client";

import { FiX, FiDownload, FiCreditCard, FiCalendar, FiUser, FiFileText } from "react-icons/fi";

interface PaymentDetailsModalProps {
  payment: any;
  onClose: () => void;
}

export default function PaymentDetailsModal({ payment, onClose }: PaymentDetailsModalProps) {
  if (!payment) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            <p className="text-sm text-gray-500 mt-1">Transaction ID: {payment.paymentId || payment.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(payment.status)}`}>
              {payment.status}
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <FiDownload size={16} />
              <span>Download Receipt</span>
            </button>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <FiUser size={16} />
                  <span>Patient Name</span>
                </label>
                <p className="text-gray-900 font-medium">{payment.patient}</p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <FiFileText size={16} />
                  <span>Booking ID</span>
                </label>
                <p className="text-gray-900 font-medium">{payment.bookingId}</p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <FiCreditCard size={16} />
                  <span>Payment Method</span>
                </label>
                <p className="text-gray-900 font-medium capitalize">{payment.method || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <FiCalendar size={16} />
                  <span>Payment Date</span>
                </label>
                <p className="text-gray-900 font-medium">{formatDate(payment.date)}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Service</label>
                <p className="text-gray-900 font-medium">{payment.service || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Email</label>
                <p className="text-gray-900 font-medium">{payment.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  {typeof payment.amount === 'number' 
                    ? `₹${payment.amount.toLocaleString()}` 
                    : payment.amount}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <FiCreditCard className="text-white" size={28} />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {payment.bookingStatus && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Booking Status</p>
              <p className="text-gray-900 font-medium capitalize mt-1">{payment.bookingStatus}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
