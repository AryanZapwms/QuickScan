"use client";

import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiLock, FiCreditCard, FiBell } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function SalesSettingsPage() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Manage your personal information and payout preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
            {[
                { id: "profile", label: "Profile Info", icon: FiUser },
                { id: "payout", label: "Payout Details", icon: FiCreditCard },
                { id: "security", label: "Security", icon: FiLock },
                { id: "notifications", label: "Notifications", icon: FiBell },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
                        activeSection === tab.id 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                    <tab.icon />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            {activeSection === "profile" && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                            <input 
                              type="text" 
                              defaultValue={session?.user?.name || ""} 
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                            <input 
                              type="email" 
                              defaultValue={session?.user?.email || ""} 
                              disabled
                              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-slate-500 cursor-not-allowed font-medium"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                            <input 
                              type="tel" 
                              defaultValue="+91 98765 43210" 
                              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {activeSection === "payout" && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-4">Payout Method</h3>
                    <p className="text-slate-500 text-sm">Where should we send your monthly commissions?</p>
                    
                    <div className="space-y-4 pt-4">
                        <div className="p-4 border-2 border-blue-600 bg-blue-50/50 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600"><FiCreditCard size={24} /></div>
                                <div>
                                    <p className="font-bold text-slate-900">UPI ID</p>
                                    <p className="text-sm text-slate-500">rahul@okaxis</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-md uppercase">Default</span>
                        </div>

                        <div className="p-4 border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-200 cursor-pointer transition">
                            <div className="flex items-center space-x-4">
                                <div className="bg-slate-50 p-3 rounded-xl text-slate-400"><FiCreditCard size={24} /></div>
                                <div>
                                    <p className="font-bold text-slate-900">Bank Transfer</p>
                                    <p className="text-sm text-slate-500">HDFC Bank ...4521</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button className="text-blue-600 font-bold hover:underline">+ Add new payout method</button>
                    </div>
                </div>
            )}

            {activeSection === "security" && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-4">Change Password</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                            <input type="password" placeholder="********" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                            <input type="password" placeholder="Minimum 8 characters" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none" />
                        </div>
                    </div>
                </div>
            )}

            {activeSection === "notifications" && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                        {[
                            "New referral conversion alert",
                            "Payout processed notification",
                            "New marketing assets available",
                            "Platform updates & newsletter",
                        ].map((notif, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <span className="text-slate-700 font-medium">{notif}</span>
                                <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                                    <div className="absolute right-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
