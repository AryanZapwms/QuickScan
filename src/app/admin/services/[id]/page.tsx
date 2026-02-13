"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface ServiceData {
  name: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  urgentPrice: number;
  description: string;
  isPopular: boolean;
  isHomeService: boolean;
}

export default function EditServicePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ServiceData>({
    name: "",
    category: "mri",
    originalPrice: 0,
    discountedPrice: 0,
    urgentPrice: 500,
    description: "",
    isPopular: false,
    isHomeService: false,
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/admin/services/${params.id}`);
        const result = await response.json();

        if (result.success) {
          setFormData(result.data);
        } else {
          toast.error(result.error || "Failed to load service");
        }
      } catch (error) {
        toast.error("Error loading service details");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/services/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Service updated successfully");
        router.push("/admin/services");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update service");
      }
    } catch (error) {
      toast.error("Error updating service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
            <p className="text-gray-500">Update service details and pricing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Service Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {['mri', 'ct-scan', 'x-ray', 'health-checkup', 'blood-test', 'ultrasound'].map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Original Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Discounted Price (₹)</label>
            <input
              type="number"
              min="0"
              value={formData.discountedPrice || ''}
              onChange={(e) => setFormData({ ...formData, discountedPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Urgent Price Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-orange-700 flex items-center">
              <span className="mr-2">⚡</span> Urgent Booking Price (₹)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.urgentPrice}
              onChange={(e) => setFormData({ ...formData, urgentPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-orange-50"
            />
            <p className="text-xs text-gray-500">
              Extra fee charged for urgent booking requests. Default is 500.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-6 pt-4 border-t">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isHomeService}
              onChange={(e) => setFormData({ ...formData, isHomeService: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Available for Home Service</span>
          </label>
        </div>

        <div className="pt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <FiSave />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
