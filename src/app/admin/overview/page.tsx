import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, ShieldCheck, Activity } from "lucide-react";

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Overview</h1>
        <p className="text-neutral-500">System performance and administrative insights.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Users"
          amount="1,284"
          trend="+12% from last month"
          trendType="up"
          icon={Users}
          color="emerald"
        />
        <StatsCard
          title="Active Sessions"
          amount="452"
          trend="Currently online"
          trendType="neutral"
          icon={Activity}
          color="blue"
        />
        <StatsCard
          title="Security Alerts"
          amount="0"
          trend="All systems stable"
          trendType="up"
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#0D0D0D] p-8">
        <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-neutral-400">Database</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-neutral-400">Authentication Service</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-neutral-400">File Storage</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
