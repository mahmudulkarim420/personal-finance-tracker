"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";

type StatsCardProps = {
  title: string;
  amount: string;
  trend?: string;
  trendTone?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  meta?: ReactNode;
  chartData?: Array<{ value: number }>;
  chartColor?: string;
  className?: string;
};

export function StatsCard({
  title,
  amount,
  trend,
  trendTone = "neutral",
  icon,
  meta,
  chartData,
  chartColor = "#10b981",
  className,
}: StatsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={clsx(
        "flex min-h-[210px] flex-col rounded-[28px] border border-white/10 bg-[#121212]/85 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl",
        className
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">
            {title}
          </p>
          <p className="mt-3 text-3xl font-bold leading-none tracking-tight text-white">{amount}</p>
        </div>
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-[#1A1A1A] text-neutral-400">
            {icon}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        {trend ? (
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
              trendTone === "positive" && "bg-emerald-500/10 text-emerald-400",
              trendTone === "negative" && "bg-rose-500/10 text-rose-400",
              trendTone === "neutral" && "bg-white/5 text-neutral-300"
            )}
          >
            {trend}
          </span>
        ) : (
          <span />
        )}
        {meta ? <div className="text-right text-[11px] text-neutral-500">{meta}</div> : null}
      </div>

      {chartData ? (
        <div className="mt-auto h-10 pt-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={6} barCategoryGap={4}>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`${chartColor}-${index}`}
                    fill={index === chartData.length - 1 ? chartColor : `${chartColor}55`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </motion.article>
  );
}
