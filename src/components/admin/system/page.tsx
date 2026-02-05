// src/app/admin/system/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FiSave, FiRefreshCw, FiDatabase, FiMail, FiGlobe, FiLock, FiAlertTriangle } from "react-icons/fi";

interface SystemSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  bookingWindowDays: number;
  maxBookingsPerDay: number;
  invoicePrefix: string;
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "QuickScan Medical",
    siteUrl: "https://quickscan.medical",
    supportEmail: "support@quickscan.medical",
    supportPhone: "+91 9876543210",
    maintenanceMode: false,
    allowRegistrations: true,
    bookingWindowDays: 30,
    maxBookingsPerDay: 50,
    invoicePrefix: "QS",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/system");
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSettings(result.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/system", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("System settings saved successfully");
      } else {
        alert(`Failed to save settings: ${result.message}`);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
      setShowConfirm(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm("Are you sure you want to clear all system cache? This may temporarily affect performance.")) return;

    try {
      const response = await fetch("/api/admin/system/cache", {
        method: "DELETE",
      });

      const result = await response.json();
      
      if (result.success) {
        alert("System cache cleared successfully");
      } else {
        alert(`Failed to clear cache: ${result.message}`);
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      alert("Failed to clear cache");
    }
  };

  const handleResetSettings = () => {
    if (confirm("Reset all settings to default? This cannot be undone.")) {
      setSettings({
        siteName: "QuickScan Medical",
        siteUrl: "https://quickscan.medical",
        supportEmail: "support@quickscan.medical",
        supportPhone: "+91 9876543210",
        maintenanceMode: false,
        allowRegistrations: true,
        bookingWindowDays: 30,
        maxBookingsPerDay: 50,
        invoicePrefix: "QS",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">
          Configure system-wide settings and preferences
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-red-600 mr-3" size={24} />
          <h3 className="text-lg font-bold text-red-800">Danger Zone</h3>
        </div>
        <p className="text-red-700 mb-4">
          These actions are irreversible and can affect the entire system.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Clear System Cache
          </button>
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <FiGlobe className="text-blue-600 mr-3" />
              <h3 className="text-lg font-bold">General Settings</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site URL
              </label>
              <input
                type="url"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={settings.siteUrl}
                onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Prefix
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={settings.invoicePrefix}
                onChange={(e) => setSettings({...settings, invoicePrefix: e.target.value})}
                maxLength={5}
              />
              <p className="text-sm text-gray-500 mt-1">
                Prefix for all invoice numbers (e.g., QS-2024-001)
              </p>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <FiMail className="text-blue-600 mr-3" />
              <h3 className="text-lg font-bold">Contact Settings</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Phone
              </label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={settings.supportPhone}
                onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
              />
            </div>
          </div>

          {/* Booking Settings */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <FiDatabase className="text-blue-600 mr-3" />
              <h3 className="text-lg font-bold">Booking Settings</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Window (Days)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={settings.bookingWindowDays}
                onChange={(e) => setSettings({...settings, bookingWindowDays: parseInt(e.target.value)})}
                min="1"
                max="365"
              />
              <p className="text-sm text-gray-500 mt-1">
                How many days in advance can bookings be made
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Bookings Per Day
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={settings.maxBookingsPerDay}
                onChange={(e) => setSettings({...settings, maxBookingsPerDay: parseInt(e.target.value)})}
                min="1"
                max="1000"
              />
            </div>
          </div>

          {/* System Controls */}
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <FiLock className="text-blue-600 mr-3" />
              <h3 className="text-lg font-bold">System Controls</h3>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                className="h-4 w-4 text-blue-600 rounded"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm font-medium text-gray-700">
                Maintenance Mode
              </label>
            </div>
            <p className="text-sm text-gray-500">
              When enabled, only admins can access the site
            </p>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="allowRegistrations"
                className="h-4 w-4 text-blue-600 rounded"
                checked={settings.allowRegistrations}
                onChange={(e) => setSettings({...settings, allowRegistrations: e.target.checked})}
              />
              <label htmlFor="allowRegistrations" className="ml-2 block text-sm font-medium text-gray-700">
                Allow New Registrations
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Allow new users to register accounts
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Save</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save these system settings? Some changes may require a server restart.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Yes, Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}