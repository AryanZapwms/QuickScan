"use client";

import { useState, useEffect } from "react";
import { ServiceItem } from "@/lib/data/services";
import { FiX, FiSave } from "react-icons/fi";

// augment ServiceItem locally for now to include isActive if not present
interface ExtendedServiceItem extends ServiceItem {
  isActive?: boolean;
  description?: string;
  originalPrice?: number;
  reportTime?: string;
  preparation?: string;
  category?: string;
  _id?: string;
}

interface ServiceFormProps {
  service?: ExtendedServiceItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const [formData, setFormData] = useState<Partial<ExtendedServiceItem>>({
    name: "",
    category: "mri",
    price: 0,
    discountedPrice: 0,
    isActive: true,
    description: "",
    reportTime: "",
    preparation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        category: service.category || "mri",
        price: service.originalPrice || service.price || 0,
        discountedPrice: service.discountedPrice || 0,
        isActive: service.isActive !== undefined ? service.isActive : true,
        description: service.description || "",
        reportTime: service.reportTime || "",
        preparation: service.preparation || "",
      });
    } else {
      // Reset to defaults when no service
      setFormData({
        name: "",
        category: "mri",
        price: 0,
        discountedPrice: 0,
        isActive: true,
        description: "",
        reportTime: "",
        preparation: "",
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = service?._id
        ? `/api/admin/services/${service._id}`
        : "/api/admin/services";
      const method = service?._id ? "PUT" : "POST";

      const payload = {
        ...formData,
        originalPrice: formData.price, // map back to db schema
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to save service" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to save service`);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Service form error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {service ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category} // Assuming category matches known types
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mri">MRI</option>
                <option value="ct-scan">CT Scan</option>
                <option value="x-ray">X-Ray</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="blood-test">Blood Test</option>
                <option value="health-checkup">Health Checkup</option>
                <option value="mammography">Mammography</option>
                <option value="pet-ct">PET-CT</option>
                <option value="ecg-echo">ECG / Echo</option>
                 <option value="urine-stool">Urine / Stool</option>
                <option value="thyroid-lipid-diabetes">Thyroid, Lipid, Diabetes</option>
                <option value="home-collection">Home Collection</option>
                 <option value="lab-visit">Lab Visit</option>
              </select>
            </div>

            <div>
               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <span>Status</span>
              </label>
               <div className="flex items-center space-x-4 mt-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive === true}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900">{formData.isActive ? 'Active' : 'Inactive'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discounted Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.discountedPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountedPrice: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Instructions
              </label>
              <textarea
                rows={2}
                value={formData.preparation || ""}
                onChange={(e) =>
                  setFormData({ ...formData, preparation: e.target.value })
                }
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Time
              </label>
              <input
                type="text"
                value={formData.reportTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, reportTime: e.target.value })
                }
                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              <FiSave />
              <span>{loading ? "Saving..." : "Save Service"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
