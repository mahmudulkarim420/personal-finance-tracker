"use client";

import { motion } from "framer-motion";
import { Car, Plane, TrendingUp, UtensilsCrossed } from "lucide-react";
import clsx from "clsx";

const transactions = [
  {
    id: 1,
    name: "Delta Airlines",
    category: "Travel",
    amount: -1240,
    status: "Completed",
    Icon: Plane,
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
  },
  {
    id: 2,
    name: "Equities Dividend",
    category: "Investment",
    amount: 8450,
    status: "Cleared",
    Icon: TrendingUp,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    id: 3,
    name: "Le Bernardin",
    category: "Dining",
    amount: -850,
    status: "Pending",
    Icon: UtensilsCrossed,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    id: 4,
    name: "Porsche Financial",
    category: "Auto",
    amount: -2100,
    status: "Completed",
    Icon: Car,
    iconBg: "bg-fuchsia-500/15",
    iconColor: "text-fuchsia-400",
  },
];

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-500/10 text-emerald-400",
  Cleared: "bg-sky-500/10 text-sky-400",
  Pending: "bg-amber-500/10 text-amber-400",
};

export function RecentFlow() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
      className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[#121212]/85 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Recent Flow</p>
          <p className="mt-1 text-xs text-neutral-500">Latest cleared and pending activity.</p>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.map((tx, index) => (
          <motion.article
            key={tx.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + index * 0.08, duration: 0.35 }}
            className="flex items-center gap-3 rounded-2xl border border-transparent px-1 py-1 transition-colors hover:border-white/5 hover:bg-white/[0.03]"
          >
            <div
              className={clsx(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                tx.iconBg
              )}
            >
              <tx.Icon className={clsx("h-4 w-4", tx.iconColor)} strokeWidth={1.5} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-200">{tx.name}</p>
              <p className="text-[11px] text-neutral-600">{tx.category}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p
                className={clsx(
                  "text-sm font-semibold tabular-nums",
                  tx.amount > 0 ? "text-emerald-400" : "text-neutral-300"
                )}
              >
                {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount).toLocaleString()}
              </p>
              <span
                className={clsx(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  statusStyles[tx.status]
                )}
              >
                {tx.status}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
