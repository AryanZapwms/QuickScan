"use client";

import { useState, useEffect } from "react";
import { FiDownload, FiCalendar, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("overview");
  const [dateRange, setDateRange] = useState("this_month");

  useEffect(() => {
    fetchReports();
  }, [reportType, dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: reportType,
        range: dateRange,
      });

      const res = await fetch(`/api/admin/reports?${params}`);
      const data = await res.json();

      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast("Export feature coming soon");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and download detailed reports</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="overview">Overview</option>
          <option value="revenue">Revenue Report</option>
          <option value="bookings">Booking Report</option>
          <option value="services">Service Performance</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">
                ₹{(reportData?.totals?.revenue || 0).toLocaleString()}
              </p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold mt-1">{reportData?.totals?.bookings || 0}</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold mt-1">
                ₹
                {reportData?.totals?.bookings
                  ? Math.round(reportData.totals.revenue / reportData.totals.bookings).toLocaleString()
                  : 0}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Top Service</p>
              <p className="text-lg font-bold mt-1">
                {reportData?.servicePerformance?.[0]?._id || "N/A"}
              </p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Top Services</h2>
        <div className="space-y-3">
          {reportData?.servicePerformance?.slice(0, 5).map((service: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{service._id}</p>
                <p className="text-sm text-gray-500">{service.bookings} bookings</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{service.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Booking Status</h2>
          <div className="space-y-3">
            {reportData?.bookingStats?.map((stat: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium capitalize">{stat._id}</span>
                <span className="font-bold">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {reportData?.paymentMethods?.map((method: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium capitalize">{method._id || "N/A"}</p>
                  <p className="text-sm text-gray-500">{method.count} transactions</p>
                </div>
                <span className="font-bold">₹{method.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}