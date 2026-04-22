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
  chartColor = "#b34800",
  className,
}: StatsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={clsx(
        "flex min-h-[210px] min-w-0 flex-col rounded-[28px] border border-base-300 bg-base-200 p-5 shadow-sm",
        className
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-accent/60">
            {title}
          </p>
          <p className="mt-3 text-3xl font-black leading-none tracking-tight text-neutral">{amount}</p>
        </div>
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-base-300 bg-base-100 text-accent/60">
            {icon}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        {trend ? (
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black",
              trendTone === "positive" && "bg-green-100 text-green-800",
              trendTone === "negative" && "bg-rose-100 text-rose-800",
              trendTone === "neutral" && "bg-base-300 text-accent"
            )}
          >
            {trend}
          </span>
        ) : (
          <span />
        )}
        {meta ? <div className="text-right text-[11px] text-accent font-black">{meta}</div> : null}
      </div>

      {chartData ? (
        <div className="mt-auto h-10 min-w-0 min-h-10 pt-5">
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
