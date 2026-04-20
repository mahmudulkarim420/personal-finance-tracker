"use client";

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

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length > 0) {
    const val = payload[0].value;
    const isNegative = val < 0;
    return (
      <div className="rounded-2xl border border-white/10 bg-[#161616]/95 px-3 py-2 shadow-2xl backdrop-blur-xl">
        <p className="mb-1 text-[11px] text-neutral-500">{label}</p>
        <p className="text-sm font-bold text-emerald-400">
          {isNegative ? "-" : ""}${Math.abs(val).toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
}

type CashFlowChartProps = {
  data: { month: string; amount: number }[];
};

export function CashFlowChart({ data }: CashFlowChartProps) {
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
              tickFormatter={(value: number) => {
                const absVal = Math.abs(value);
                const prefix = value < 0 ? "-" : "";
                return prefix + "$" + (absVal >= 1000 ? (absVal / 1000).toFixed(0) + "k" : absVal);
              }}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2A2A2A", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="amount"
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
