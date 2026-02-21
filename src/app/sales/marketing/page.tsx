"use client";

import { FiDownload, FiShare2, FiImage, FiType } from "react-icons/fi";
import { toast } from "react-hot-toast";

const assets = [
  { title: "Brand Logo (PNG)", type: "Image", size: "1.2 MB" },
  { title: "Service Pamphlets", type: "PDF", size: "4.5 MB" },
  { title: "Social Media Banner", type: "Image", size: "2.1 MB" },
  { title: "QuickScan Pitch Deck", type: "PDF", size: "3.2 MB" },
];

const templates = [
  { 
    title: "Standard Referral Text", 
    content: "Hi! I just found QuickScan Medical for easy diagnostic bookings. Use my link to get a 10% discount on your first MRI/CT scan or Health Checkup!" 
  },
  { 
    title: "Home Service Text", 
    content: "Skip the lab queues! Book a blood test via QuickScan and get a certified technician to visit your home. Highly recommended." 
  }
];

export default function SalesMarketingPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text template copied!");
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Marketing Kit</h1>
        <p className="text-slate-500">Resources to help you promote QuickScan and earn more commissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand Assets */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <FiImage className="mr-2 text-blue-600" />
            Brand Assets & Creatives
          </h2>
          <div className="space-y-4">
            {assets.map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100/50 transition cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                    {asset.type === "Image" ? <FiImage /> : <FiType />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{asset.title}</p>
                    <p className="text-xs text-slate-500">{asset.size}</p>
                  </div>
                </div>
                <button className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition border border-blue-600">
                  <FiDownload />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Templates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <FiShare2 className="mr-2 text-indigo-600" />
            Messaging Templates
          </h2>
          <div className="space-y-6">
            {templates.map((tmpl, i) => (
              <div key={i} className="space-y-2">
                <p className="font-bold text-slate-900 text-sm">{tmpl.title}</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                  <p className="text-sm text-slate-600 pr-8 italic">"{tmpl.content}"</p>
                  <button 
                    onClick={() => copyToClipboard(tmpl.content)}
                    className="absolute top-2 right-2 p-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiShare2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Preview Card */}
      <div className="bg-gradient-to-br from-indigo-700 to-blue-800 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold mb-4">Want specialized banners?</h3>
            <p className="text-blue-100 mb-6">If you need custom graphics with your QR code or referral link, reach out to our partner support team.</p>
            <button className="px-8 py-3 bg-white text-blue-800 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
              Contact Design Team
            </button>
          </div>
          <div className="w-full max-w-[240px] aspect-square bg-white rounded-2xl p-4 flex items-center justify-center">
             <div className="text-slate-400 text-center">
                <FiImage className="text-4xl mx-auto mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-wider">Preview Generated</p>
             </div>
          </div>
        </div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
