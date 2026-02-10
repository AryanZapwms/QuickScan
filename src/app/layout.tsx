// app/layout.tsx (SERVER COMPONENT)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickScan - Book MRI, CT Scans, Health Checkups",
  description:
    "Book medical tests, scans, and health checkups with instant appointments. 950+ scan centers across India.",
  icons: {
    icon: "https://cdn-icons-png.freepik.com/256/17310/17310527.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
  <ClientLayout>
    {children}
  </ClientLayout>
</body>
    </html>
  );
}
