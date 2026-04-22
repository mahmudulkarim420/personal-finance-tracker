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
      <div className="rounded-2xl border border-base-300 bg-base-100 px-3 py-2 shadow-xl">
        <p className="mb-1 text-[11px] text-accent font-black opacity-60">{label}</p>
        <p className="text-sm font-black text-primary">
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
      className="min-w-0 rounded-[28px] border border-base-300 bg-base-200 p-5 shadow-sm"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-neutral">Cash Flow Analytics</p>
          <p className="mt-1 text-xs text-accent font-black opacity-60">
            Track balance momentum across your private accounts.
          </p>
        </div>
      </div>

      <div className="h-[260px] min-w-0 min-h-[260px] sm:h-[320px] sm:min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b34800" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#b34800" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#d7ccc8" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#8d6e63", fontSize: 11, fontWeight: 900 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: "#8d6e63", fontSize: 11, fontWeight: 900 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => {
                const absVal = Math.abs(value);
                const prefix = value < 0 ? "-" : "";
                return prefix + "$" + (absVal >= 1000 ? (absVal / 1000).toFixed(0) + "k" : absVal);
              }}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#a1887f", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#b34800"
              strokeWidth={3}
              fill="url(#cashGradient)"
              dot={false}
              activeDot={{ r: 6, fill: "#b34800", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
