import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import Header from "@/components/dashboard/Header";
import { db } from "@/lib/db";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import { checkUser } from "@/actions/checkUser";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Handle session sync delay - sessionClaims may be null briefly after sign-in
  if (!sessionClaims) {
    return null;
  }

  // ── Sync Clerk publicMetadata.role → DB before the gate check ──────────────
  // This ensures that promoting a user in the Clerk dashboard takes effect
  // immediately on the next page visit without any manual DB edits.
  await checkUser();

  // Source of Truth: Check database role (now freshly synced)
  const dbUser = await db.user.findUnique({
    where: { clerkId: userId! },
    select: { role: true },
  });

  const sidebarLeft = "lg:left-[300px]";

  console.log(`[AdminLayout] clerkId=${userId} | DB role="${dbUser?.role ?? "(none)"}"`);

  // If no db user found or role is not admin, redirect to dashboard
  if (!dbUser || dbUser.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <MobileMenuProvider>
      <main className="relative min-h-screen bg-base-100 text-neutral overflow-x-hidden font-sans">
        {/* Unified Sidebar */}
        <Sidebar />

        <div className="flex flex-col min-h-screen transition-all duration-500 ease-in-out lg:pl-[300px]">
          {/* Unified Header */}
          <Header />

          {/* Main Content Area - Matching dashboard layout */}
          <section id="main-content" className="flex-1 px-4 pb-8 pt-24 md:px-6 lg:px-8 lg:pt-36">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </section>
        </div>
      </main>
    </MobileMenuProvider>
  );
}
