// app/layout.tsx - UPDATED
"use client"; // Add this to make it a client component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// Note: Metadata must remain in a server component
// You'll need to separate metadata or use a different approach

import LeadCaptureModal from "@/components/ui/LeadCaptureModal";

// ... imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin") || false;

  return (
    <html lang="en">
      <head>
        <title>QuickScan - Book MRI, CT Scans, Health Checkups</title>
        <meta
          name="description"
          content="Book medical tests, scans, and health checkups with instant appointments. 950+ scan centers across India."
        />
        <link
          rel="icon"
          href="https://cdn-icons-png.freepik.com/256/17310/17310527.png"
          type="image/png"
        />
      </head>
      <body className={`${inter.className} flex flex-col  min-h-screen bg-gray-50`}>
        <Providers>
          {/* Only show public Header on non-admin pages */}
          {!isAdminPage && <Header />}

          <main className={`flex-1 w-full  ${!isAdminPage ? "pt-24 md:pt-28" : ""}`}>
            <div className="mx-auto self-center w-full">
              {children}
            </div>
          </main>

          {/* Only show public Footer on non-admin pages */}
          {!isAdminPage && <Footer />}

          {/* Global Components */}
          {!isAdminPage && <LeadCaptureModal />}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}