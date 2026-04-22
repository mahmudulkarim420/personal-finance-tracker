import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import Header from "@/components/dashboard/Header";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <MobileMenuProvider>
      <main className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_24%),linear-gradient(180deg,_#08090A_0%,_#0B0C0E_50%,_#08090A_100%)] text-white overflow-x-hidden">
        {/* Persistent Sidebar (Desktop) / Drawer (Mobile) */}
        <Sidebar aria-label="Main Navigation" />

        <div className="flex flex-col min-h-screen transition-all duration-500 ease-in-out lg:pl-[300px]">
          <Header />

          {/* Main Content Area */}
          <section id="main-content" className="flex-1 px-4 pb-8 pt-24 md:px-6 lg:px-8 lg:pt-36">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </section>
        </div>
      </main>
    </MobileMenuProvider>
  );
}
