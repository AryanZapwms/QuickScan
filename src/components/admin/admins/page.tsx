// src/app/admin/admins/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FiShield, FiPlus, FiEdit, FiTrash2, FiMail } from "react-icons/fi";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "lab-admin" | "super-admin";
  createdAt: string;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin" as "admin" | "lab-admin" | "super-admin",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/admins");
      const result = await response.json();
      
      if (result.success) {
        setAdmins(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    // Basic validation
    if (!newAdmin.name || !newAdmin.email || !newAdmin.phone) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Admin added successfully. Invitation email sent.");
        setShowAddModal(false);
        setNewAdmin({ name: "", email: "", phone: "", role: "admin" });
        fetchAdmins();
      } else {
        alert(`Failed to add admin: ${result.message}`);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin");
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Admin removed successfully");
        fetchAdmins();
      } else {
        alert(`Failed to remove admin: ${result.message}`);
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      alert("Failed to remove admin");
    }
  };

  const handleResendInvite = async (email: string) => {
    try {
      const response = await fetch("/api/admin/admins/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Invitation email resent successfully");
      } else {
        alert(`Failed to resend invite: ${result.message}`);
      }
    } catch (error) {
      console.error("Error resending invite:", error);
      alert("Failed to resend invitation");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super-admin": return "bg-red-100 text-red-800";
      case "admin": return "bg-purple-100 text-purple-800";
      case "lab-admin": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600">
            Manage admin users and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          Add New Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold">{admins.length}</div>
          <div className="text-sm text-gray-500">Total Admins</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold">
            {admins.filter(a => a.role === "super-admin").length}
          </div>
          <div className="text-sm text-gray-500">Super Admins</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold">
            {admins.filter(a => a.role === "lab-admin").length}
          </div>
          <div className="text-sm text-gray-500">Lab Admins</div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admins...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Admin</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </td>
                    <td className="py-3 px-4">{admin.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(admin.role)}`}>
                        {admin.role.replace("-", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResendInvite(admin.email)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Resend Invitation"
                        >
                          <FiMail />
                        </button>
                        {admin.role !== "super-admin" && (
                          <button
                            onClick={() => handleRemoveAdmin(admin._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Remove Admin"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {admins.length === 0 && (
              <div className="text-center py-12">
                <FiShield className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No admins found</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Your First Admin
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Admin</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as any})}
                >
                  <option value="admin">Admin</option>
                  <option value="lab-admin">Lab Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}