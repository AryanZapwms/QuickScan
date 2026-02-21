import SalesSidebar from "@/components/sales/SalesSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session || session.user?.role !== "sales-executive") {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SalesSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
