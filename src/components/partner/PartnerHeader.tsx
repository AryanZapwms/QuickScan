"use client";

import Link from "next/link";
import { FiBell, FiHome } from "react-icons/fi";
import { useSession } from "next-auth/react";

export default function PartnerHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
     <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
           <h1 className="text-lg font-bold text-slate-900 font-outfit uppercase tracking-wider"> 
              Laboratory Control Panel 
           </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link 
            href="/"
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition border border-slate-200 font-bold text-sm"
          >
            <FiHome />
            <span>View Website</span>
          </Link>
          
          <button className="relative p-2 text-slate-400 hover:text-emerald-600 rounded-xl bg-slate-50 transition-colors">
            <FiBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-6 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-slate-900 text-sm">{user?.name || "Partner Staff"}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{user?.role?.replace('-', ' ')}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="font-bold text-emerald-700">
                {user?.name?.charAt(0).toUpperCase() || "P"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
