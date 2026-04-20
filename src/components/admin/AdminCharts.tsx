"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { OnboardingPoint, ActivityPoint } from "@/actions/admin";

// ─── Shared Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0D0D0D]/95 px-3 py-2 text-xs backdrop-blur-xl shadow-xl">
      <p className="mb-1 text-neutral-500">{label}</p>
      <p className="font-semibold text-white">
        {payload[0].value}{" "}
        <span className="font-normal text-neutral-400">{payload[0].name}</span>
      </p>
    </div>
  );
}

// ─── Onboarding Line Chart ────────────────────────────────────────────────────
export function OnboardingChart({ data }: { data: OnboardingPoint[] }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0D0D0D]/85 p-5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
          User Onboarding Trend
        </p>
        <p className="mt-1 text-sm text-neutral-600">New signups · last 30 days</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)" }} />
          <Line
            type="monotone"
            dataKey="signups"
            name="signups"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Platform Activity Bar Chart ──────────────────────────────────────────────
export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0D0D0D]/85 p-5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
          Platform Activity
        </p>
        <p className="mt-1 text-sm text-neutral-600">Total transactions · last 14 days</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barSize={10}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar
            dataKey="transactions"
            name="transactions"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
