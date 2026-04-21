import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import Header from "@/components/dashboard/Header";
import { db } from "@/lib/db";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Source of Truth: Check database role
  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <MobileMenuProvider>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_24%),linear-gradient(180deg,#08090C_0%,#0D0D0F_50%,#08090C_100%)] text-white">
        <div className="mx-auto flex min-h-screen w-full flex-col gap-4 lg:flex-row">
          {/* Unified Sidebar */}
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-[280px]">
            {/* Unified Header */}
            <Header />

            {/* Main Content Area - Matching dashboard layout */}
            <section className="flex-1 overflow-y-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pt-36">
              <div className="mx-auto w-full max-w-7xl">
                {/* Glassmorphism Card Container */}
                <div className="rounded-3xl border border-white/10 bg-white/3 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
                  {children}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </MobileMenuProvider>
  );
}
