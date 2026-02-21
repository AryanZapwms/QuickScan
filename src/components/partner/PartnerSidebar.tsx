"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiUpload,
  FiClock,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiUsers,
} from "react-icons/fi";
import { signOut } from "next-auth/react";

const menuItems = [
  { icon: FiHome, label: "Overview", href: "/partner" },
  { icon: FiCalendar, label: "Bookings", href: "/partner/bookings" },
  { icon: FiUpload, label: "Upload Reports", href: "/partner/reports" },
  { icon: FiClock, label: "Slot Management", href: "/partner/slots" },
  { icon: FiUsers, label: "Staff Management", href: "/partner/staff" },
  { icon: FiFileText, label: "Invoices", href: "/partner/invoices" },
  { icon: FiSettings, label: "Center Settings", href: "/partner/settings" },
];

export default function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2 flex items-center space-x-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold">
          P
        </div>
        <span className="text-xl font-bold tracking-tight">Lab Partner</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors w-full"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
