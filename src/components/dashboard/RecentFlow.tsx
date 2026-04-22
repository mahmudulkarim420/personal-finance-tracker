"use client";

import { motion } from "framer-motion";
import { Car, Plane, TrendingUp, UtensilsCrossed, CircleDollarSign } from "lucide-react";
import clsx from "clsx";

export type FlowTransaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  status: string;
};

const categoryConfig: Record<string, { Icon: any; iconBg: string; iconColor: string }> = {
  Travel: { Icon: Plane, iconBg: "bg-blue-100/50", iconColor: "text-blue-800" },
  Investment: { Icon: TrendingUp, iconBg: "bg-green-100/50", iconColor: "text-green-800" },
  Dining: { Icon: UtensilsCrossed, iconBg: "bg-orange-100/50", iconColor: "text-orange-800" },
  Auto: { Icon: Car, iconBg: "bg-primary/10", iconColor: "text-primary" },
};

const defaultCategoryConfig = { Icon: CircleDollarSign, iconBg: "bg-base-300", iconColor: "text-accent/60" };

const statusStyles: Record<string, string> = {
  Completed: "bg-green-100 text-green-800 border-green-200",
  Cleared: "bg-blue-100 text-blue-800 border-blue-200",
  Pending: "bg-orange-100 text-orange-800 border-orange-200",
  CLEARED: "bg-blue-100 text-blue-800 border-blue-200",
  PENDING: "bg-orange-100 text-orange-800 border-orange-200",
};

export function RecentFlow({ transactions }: { transactions: FlowTransaction[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
      className="flex h-full flex-col rounded-[28px] border border-base-300 bg-base-200 p-5 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-neutral">Recent Flow</p>
          <p className="mt-1 text-xs text-accent font-black opacity-60">Latest cleared and pending activity.</p>
        </div>
        <button
          type="button"
          className="text-xs font-black text-primary transition-colors hover:text-neutral"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.length === 0 ? (
          <div className="text-sm text-accent/60 text-center py-4 font-black">No recent transactions</div>
        ) : null}
        
        {transactions.map((tx, index) => {
          const config = categoryConfig[tx.category] || defaultCategoryConfig;
          
          return (
            <motion.article
              key={tx.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.08, duration: 0.35 }}
              className="flex items-center gap-3 rounded-2xl border border-transparent px-1 py-1 transition-colors hover:bg-black/[0.02]"
            >
              <div
                className={clsx(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                  config.iconBg
                )}
              >
                <config.Icon className={clsx("h-4 w-4", config.iconColor)} strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-neutral">{tx.name}</p>
                <p className="text-[11px] text-accent font-black opacity-60">{tx.category}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <p
                  className={clsx(
                    "text-sm font-black tabular-nums",
                    tx.amount > 0 ? "text-green-700" : "text-neutral"
                  )}
                >
                  {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span
                  className={clsx(
                    "rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                    statusStyles[tx.status] || "bg-base-300 text-accent/60 border-base-300"
                  )}
                >
                  {tx.status}
                </span>
              </div>
            </motion.article>
          )
        })}
      </div>
    </motion.section>
  );
}
