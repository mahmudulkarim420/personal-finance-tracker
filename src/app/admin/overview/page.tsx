import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Users,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import {
  getPlatformStats,
  getOnboardingTrend,
  getPlatformActivity,
} from "@/actions/admin";
import { OnboardingChart, ActivityChart } from "@/components/admin/AdminCharts";

// ─── Stat Card (server-safe, no motion) ──────────────────────────────────────
function AdminStatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent: "emerald" | "purple" | "blue" | "amber";
}) {
  const colors = {
    emerald: "border-primary/20 bg-primary/5 text-primary",
    purple: "border-primary/20 bg-primary/5 text-primary",
    blue: "border-primary/20 bg-primary/5 text-primary",
    amber: "border-primary/20 bg-primary/5 text-primary",
  };

  return (
    <article className="flex flex-col gap-4 rounded-[24px] border border-base-300 bg-base-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-accent/60">
          {label}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${colors[accent]}`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black tracking-tight text-neutral">{value}</p>
        <p className="mt-1 text-[11px] text-accent/60 font-black uppercase tracking-widest">{sub}</p>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const [stats, onboarding, activity] = await Promise.all([
    getPlatformStats(),
    getOnboardingTrend(),
    getPlatformActivity(),
  ]);

  const formatVolume = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-sm">
          <Shield className="h-5 w-5 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-neutral">
            Command Centre
          </h1>
          <p className="text-[12px] text-accent font-black opacity-60">
            Platform-level aggregates only — no user data is surfaced here
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          sub="Registered accounts"
          icon={Users}
          accent="emerald"
        />
        <AdminStatCard
          label="Total Volume"
          value={formatVolume(stats.totalVolume)}
          sub="Sum of all transactions"
          icon={TrendingUp}
          accent="blue"
        />
        <AdminStatCard
          label="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          sub="Platform-wide count"
          icon={ArrowLeftRight}
          accent="purple"
        />
        <AdminStatCard
          label="Avg per User"
          value={stats.avgTransactionsPerUser.toFixed(1)}
          sub="Transactions per account"
          icon={Activity}
          accent="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <OnboardingChart data={onboarding} />
        <ActivityChart data={activity} />
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-[18px] border border-base-300 bg-base-200 px-5 py-4 shadow-sm">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
        <p className="text-[12px] leading-relaxed text-neutral font-black">
          <strong className="font-black text-neutral uppercase tracking-wider text-[10px] mr-1.5">Privacy boundary enforced.</strong>{" "}
          This panel shows only platform-level aggregates. Individual transaction descriptions,
          budget names, and goal details are never exposed to admin users.
        </p>
      </div>
    </div>
  );
}
