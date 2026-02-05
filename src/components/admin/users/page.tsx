// src/app/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiSearch, FiEdit, FiTrash2, FiUserCheck, FiUserX } from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("User role updated successfully");
        fetchUsers(); // Refresh list
      } else {
        alert(`Failed to update role: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        alert("User deleted successfully");
        fetchUsers(); // Refresh list
      } else {
        alert(`Failed to delete user: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleVerifyUser = async (userId: string, verify: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: verify }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`User ${verify ? "verified" : "unverified"} successfully`);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search);
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">
          Manage all users, admins, and their permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold">{users.length}</div>
          <div className="text-sm text-gray-500">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold">
            {users.filter(u => u.role === "admin" || u.role === "super-admin" || u.role === "lab-admin").length}
          </div>
          <div className="text-sm text-gray-500">Admins</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold">
            {users.filter(u => u.isVerified).length}
          </div>
          <div className="text-sm text-gray-500">Verified Users</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold">
            {users.filter(u => u.role === "user").length}
          </div>
          <div className="text-sm text-gray-500">Regular Users</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              <option value="lab-admin">Lab Admins</option>
              <option value="super-admin">Super Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">{user.phone}</td>
                    <td className="py-3 px-4">
                      <select
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)} border-0`}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="lab-admin">Lab Admin</option>
                        <option value="super-admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          user.isVerified 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {user.isVerified ? "Verified" : "Pending"}
                        </span>
                        <button
                          onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title={user.isVerified ? "Unverify User" : "Verify User"}
                        >
                          {user.isVerified ? (
                            <FiUserX className="text-red-600" />
                          ) : (
                            <FiUserCheck className="text-green-600" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete User"
                          disabled={user.role === "super-admin"}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <FiUsers className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
                {search && (
                  <p className="text-sm text-gray-500 mt-2">
                    Try adjusting your search or filters
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}