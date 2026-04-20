"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import clsx from "clsx";

const allData = {
  "1M": [
    { month: "May 1", value: 320000 },
    { month: "May 8", value: 345000 },
    { month: "May 15", value: 338000 },
    { month: "May 22", value: 362000 },
    { month: "Jun 1", value: 410000 },
  ],
  "3M": [
    { month: "Mar", value: 220000 },
    { month: "Apr", value: 260000 },
    { month: "May", value: 305000 },
    { month: "Jun", value: 410000 },
  ],
  YTD: [
    { month: "Jan", value: 80000 },
    { month: "Feb", value: 120000 },
    { month: "Mar", value: 190000 },
    { month: "Apr", value: 240000 },
    { month: "May", value: 330000 },
    { month: "Jun", value: 410000 },
  ],
};

type TimeFilter = "1M" | "3M" | "YTD";

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#161616]/95 px-3 py-2 shadow-2xl backdrop-blur-xl">
        <p className="mb-1 text-[11px] text-neutral-500">{label}</p>
        <p className="text-sm font-bold text-emerald-400">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }

  return null;
}

export function CashFlowChart() {
  const [active, setActive] = useState<TimeFilter>("YTD");
  const data = allData[active];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
      className="min-w-0 rounded-[28px] border border-white/10 bg-[#121212]/85 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Cash Flow Analytics</p>
          <p className="mt-1 text-xs text-neutral-500">
            Track balance momentum across your premium accounts.
          </p>
        </div>

        <div className="flex w-fit items-center gap-1 rounded-2xl border border-white/8 bg-[#0D0D0D]/90 p-1">
          {(["1M", "3M", "YTD"] as TimeFilter[]).map((filterValue) => (
            <button
              key={filterValue}
              type="button"
              onClick={() => setActive(filterValue)}
              className={clsx(
                "rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all duration-200",
                active === filterValue
                  ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.14)]"
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {filterValue}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px] min-w-0 min-h-[260px] sm:h-[320px] sm:min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#232323" strokeDasharray="0" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2A2A2A", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#cashGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
