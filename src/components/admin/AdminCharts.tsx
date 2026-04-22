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
    <div className="rounded-xl border border-base-300 bg-white px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 text-accent/60 font-black uppercase tracking-wider">{label}</p>
      <p className="font-black text-neutral">
        {payload[0].value}{" "}
        <span className="font-bold text-accent">{payload[0].name}</span>
      </p>
    </div>
  );
}

// ─── Onboarding Line Chart ────────────────────────────────────────────────────
export function OnboardingChart({ data }: { data: OnboardingPoint[] }) {
  return (
    <div className="rounded-[24px] border border-base-300 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-accent/60">
          User Onboarding Trend
        </p>
        <p className="mt-1 text-sm text-accent font-black">New signups · last 30 days</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#edd3b7"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b3c1a", fontWeight: 900 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6b3c1a", fontWeight: 900 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#edd3b7" }} />
          <Line
            type="monotone"
            dataKey="signups"
            name="signups"
            stroke="#b34800"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: "#b34800", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Platform Activity Bar Chart ──────────────────────────────────────────────
export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  return (
    <div className="rounded-[24px] border border-base-300 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-accent/60">
          Platform Activity
        </p>
        <p className="mt-1 text-sm text-accent font-black">Total transactions · last 14 days</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }} barSize={10}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#edd3b7"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b3c1a", fontWeight: 900 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6b3c1a", fontWeight: 900 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#edd3b7" }} />
          <Bar
            dataKey="transactions"
            name="transactions"
            fill="#b34800"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.9}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
