"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import PaymentDetailsModal from "@/components/admin/PaymentDetailsModal";
import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  useEffect(() => {
    fetchPayments();
  }, [page, search, statusFilter, methodFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(methodFilter !== "all" && { method: methodFilter }),
      });

      const res = await fetch(`/api/admin/payments?${params}`);
      const data = await res.json();

      if (data.success) {
        setPayments(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "paymentId", label: "Payment ID", sortable: true },
    { key: "bookingId", label: "Booking ID" },
    { key: "patient", label: "Patient" },
    { key: "amount", label: "Amount", sortable: true },
    { key: "method", label: "Payment Method" },
    { key: "date", label: "Date", sortable: true },
    { key: "status", label: "Status" },
  ];

  const getStatusStats = (status: string) => {
    const breakdown = stats?.breakdown?.find((s: any) => s._id === status);
    return breakdown || { total: 0, count: 0 };
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && !payments.length) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const paidStats = getStatusStats("paid");
  const pendingStats = getStatusStats("pending");
  const failedStats = getStatusStats("failed");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
          <p className="text-gray-600">Track and manage payment transactions</p>
        </div>
        <button
          onClick={() => toast("Export feature coming soon")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiDownload />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(stats?.total || 0)}</p>
          <p className="text-green-600 text-sm mt-1">All time</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(paidStats.total)}</p>
          <p className="text-green-600 text-sm mt-1">{paidStats.count} transactions</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(pendingStats.total)}</p>
          <p className="text-yellow-600 text-sm mt-1">{pendingStats.count} transactions</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Failed</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(failedStats.total)}</p>
          <p className="text-red-600 text-sm mt-1">{failedStats.count} transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by booking ID, patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Methods</option>
          <option value="upi">UPI</option>
          <option value="card">Credit/Debit Card</option>
          <option value="netbanking">Net Banking</option>
          <option value="wallet">Wallet</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={payments.map((payment) => ({
          id: payment.id,
          paymentId: payment.paymentId,
          bookingId: payment.bookingId,
          patient: payment.patient,
          amount: formatCurrency(payment.amount),
          method: payment.method || "N/A",
          date: formatDate(payment.date),
          status: payment.status,
        }))}
        title="Payment Transactions"
        onView={(id) => {
          const payment = payments.find((p) => p.id === id);
          if (payment) setSelectedPayment(payment);
        }}
      />

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
}