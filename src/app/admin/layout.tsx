import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import Header from "@/components/dashboard/Header";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_24%),linear-gradient(180deg,_#08090C_0%,_#0D0D0F_50%,_#08090C_100%)] px-4 py-4 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex h-full min-h-[calc(100vh-4rem)] w-full max-w-[1700px] flex-col gap-4 lg:flex-row">
        {/* Unified Sidebar */}
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          {/* Unified Header */}
          <Header />

          {/* Unified Content Wrapper: Glassmorphism Card */}
          <section className="min-w-0 flex-1 overflow-y-auto rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_32px_120px_rgba(0,0,0,0.30)] backdrop-blur-xl sm:p-6">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
