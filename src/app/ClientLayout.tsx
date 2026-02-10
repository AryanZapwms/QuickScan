'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import LeadCaptureModal from "@/components/ui/LeadCaptureModal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <Providers>
      {!isAdminPage && <Header />}

      <main className={`flex-1 w-full ${!isAdminPage ? "pt-20 md:pt-16" : ""}`}>
        {children}
      </main>

      {!isAdminPage && <Footer />} 
      {!isAdminPage && <LeadCaptureModal />}

      <Toaster position="top-right" />
    </Providers>
  );
}
