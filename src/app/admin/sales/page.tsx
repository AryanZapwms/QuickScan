"use client";

import { useState, useEffect } from "react";
import { FiTrendingUp, FiPlus, FiUser, FiPercent, FiActivity, FiTrash2, FiEdit2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import SalesExecutiveForm from "@/components/admin/SalesExecutiveForm";

export default function AdminSalesTeamPage() {
  const [executives, setExecutives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<any | null>(null);

  useEffect(() => {
    fetchSalesTeam();
  }, []);

  const fetchSalesTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/sales");
      const data = await res.json();
      if (data.success) {
        setExecutives(data.data);
      } else {
        toast.error("Failed to load sales team");
      }
    } catch (error) {
      toast.error("Failed to load sales team");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this executive?")) return;
    try {
      const res = await fetch(`/api/admin/sales/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Executive removed");
        fetchSalesTeam();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEdit = (exec: any) => {
    setEditingExecutive(exec);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingExecutive(null);
    setShowForm(true);
  };

  // Stats calculation
  const totalExecutives = executives.length;
  // In a real app, these would come from an analytics API
  const totalRevenue = executives.reduce((acc, curr) => acc + (curr.revenue || 0), 0) + 140000; // Mock base for visuals
  const avgComm = executives.length > 0 
    ? (executives.reduce((acc, curr) => acc + (curr.commissionRate || 0), 0) / executives.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Executive Management</h1>
          <p className="text-gray-500">Oversee performance and commission rates for your sales team.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition"
        >
          <FiPlus />
          <span>Add Executive</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Active Team</p>
          <p className="text-3xl font-bold text-gray-900">{totalExecutives}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Network Growth</p>
          <p className="text-3xl font-bold text-green-600">↑ 12%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Channel Revenue</p>
          <p className="text-3xl font-bold text-blue-600">₹{(totalRevenue/100000).toFixed(1)}L</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avg. Commission</p>
          <p className="text-3xl font-bold text-amber-600">{avgComm}%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Executive</th>
              <th className="px-6 py-4">Referral Code</th>
              <th className="px-6 py-4">Comm. Rate</th>
              <th className="px-6 py-4">Joined On</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading sales team...</td></tr>
            ) : executives.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-400">No executives found. Create one to get started.</td></tr>
            ) : executives.map((exec) => (
              <tr key={exec._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {exec.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{exec.name}</p>
                      <p className="text-xs text-gray-500">{exec.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase">
                    {exec.referralCode || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center space-x-1 font-bold text-amber-600">
                    <FiPercent className="text-xs" />
                    <span>{exec.commissionRate}%</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(exec.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(exec)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                            <FiEdit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(exec._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <SalesExecutiveForm
            executive={editingExecutive}
            onClose={() => setShowForm(false)}
            onSuccess={fetchSalesTeam}
        />
      )}
    </div>
  );
}
