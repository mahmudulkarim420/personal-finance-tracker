import { Settings, Shield, Bell, Database, Globe, Key } from "lucide-react";

export default function AdminPanel() {
  const sections = [
    { icon: Shield, title: "Security Settings", desc: "Configure authentication and access logs." },
    { icon: Globe, title: "Site Configuration", desc: "Manage global settings and regional locales." },
    { icon: Bell, title: "Email Notifications", desc: "System alerts and automated reporting." },
    { icon: Key, title: "API Keys", desc: "Manage integration tokens and webhook secrets." },
    { icon: Database, title: "Maintenance", desc: "Database backups and cache management." },
    { icon: Settings, title: "System Info", desc: "Server resource usage and version tracking." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Panel</h1>
        <p className="text-neutral-500">Core system configurations and maintenance tools.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <button
            key={section.title}
            className="flex flex-col items-start gap-4 rounded-[32px] border border-white/5 bg-[#0D0D0D] p-8 text-left transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 transition-colors">
              <section.icon className="h-6 w-6 text-neutral-400 group-hover:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{section.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{section.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.02] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">System Optimization</h3>
            <p className="text-neutral-400 text-sm max-w-xl">
              Automatic maintenance is scheduled for every Sunday at 3:00 AM UTC. You can manually trigger a system cleanup and cache flush below.
            </p>
          </div>
          <button className="whitespace-nowrap rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors">
            Trigger Optimization
          </button>
        </div>
      </div>
    </div>
  );
}
