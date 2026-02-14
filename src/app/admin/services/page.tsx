"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";
import ServiceForm from "@/components/admin/ServiceForm";
import { toast } from "react-hot-toast";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        toast.error("Failed to fetch services");
      }
    } catch (error) {
      console.error("Failed to fetch services", error);
      toast.error("Error loading services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Service deleted successfully!");
        fetchServices();
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service", error);
      toast.error("Error deleting service");
    }
  };

  const handleQuickToggle = async (service: any) => {
    try {
      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...service,
          isActive: !service.isActive,
        }),
      });

      if (res.ok) {
        toast.success(`Service ${!service.isActive ? 'activated' : 'deactivated'} successfully!`);
        fetchServices();
      } else {
        toast.error("Failed to update service status");
      }
    } catch (error) {
      console.error("Error toggling service", error);
      toast.error("Error updating service");
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setIsFormOpen(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus />
          <span>Add Service</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={fetchServices}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Discounted</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Loading services...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No services found.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b font-medium text-gray-900">
                      {service.name}
                    </td>
                    <td className="p-4 border-b text-gray-600 capitalize">
                      {service.category.replace("-", " ")}
                    </td>
                    <td className="p-4 border-b text-gray-900">
                      ₹{service.originalPrice?.toLocaleString()}
                    </td>
                    <td className="p-4 border-b text-green-600 font-medium">
                       {service.discountedPrice ? `₹${service.discountedPrice.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 border-b">
                      <button
                        onClick={() => handleQuickToggle(service)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 transition ${
                          service.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {service.isActive ? <FiCheck size={12} /> : <FiX size={12} />}
                        <span>{service.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="p-4 border-b text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
         {/* Pagination (Simple for now) */}
        <div className="p-4 border-t bg-gray-50 text-sm text-gray-500 text-right">
            Showing {filteredServices.length} services
        </div>
      </div>

      {isFormOpen && (
        <ServiceForm
          service={editingService}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchServices();
            toast.success(editingService ? "Service updated successfully!" : "Service created successfully!");
          }}
        />
      )}
    </div>
  );
}