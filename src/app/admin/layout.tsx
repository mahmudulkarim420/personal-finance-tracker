import { Sidebar } from "@/components/navigation/Sidebar";
import Header from "@/components/dashboard/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <div className="fixed left-6 top-6 hidden h-[calc(100vh-3rem)] lg:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col lg:pl-[288px]">
        <Header />
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
