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
      <main className="relative min-h-screen bg-base-100 text-neutral overflow-x-hidden">
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
