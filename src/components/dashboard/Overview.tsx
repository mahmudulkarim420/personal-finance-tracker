"use client";

import { motion } from "framer-motion";
import { Landmark, TrendingUp, TrendingDown } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { CashFlowChart } from "./CashFlowChart";
import { RecentFlow, FlowTransaction } from "./RecentFlow";

interface OverviewProps {
  totalBalance: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  netFlowTrend: number;
  incomeTrendValue: number;
  expenseTrendValue: number;
  topCategory: string;
  chartData: { month: string; amount: number }[];
  recentFlows: FlowTransaction[];
  miniIncomeData: { value: number }[];
  miniExpenseData: { value: number }[];
}

export function Overview({
  totalBalance,
  currentMonthIncome,
  currentMonthExpense,
  netFlowTrend,
  incomeTrendValue,
  expenseTrendValue,
  topCategory,
  chartData,
  recentFlows,
  miniIncomeData,
  miniExpenseData,
}: OverviewProps) {
    
  const formatCurrency = (val: number) =>
    `$${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatTrend = (val: number) => 
    `${val > 0 ? '+' : (val < 0 ? '' : '')}${val.toFixed(1)}% vs last month`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 md:space-y-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-primary/80 font-black"
          >
            Intelligence Overview
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-2xl md:text-4xl 2xl:text-5xl font-black tracking-tight text-neutral"
          >
            Financial Command <br className="hidden sm:block md:hidden" /> Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 max-w-2xl text-sm md:text-base text-accent font-black leading-relaxed"
          >
            Monitor liquidity, spending pressure, and wealth momentum from your 
            private financial workstation.
          </motion.p>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(350px,1fr)]">
        <div className="min-w-0 space-y-6">
          <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            <StatsCard
              title="Total Balance"
              amount={(totalBalance < 0 ? "-" : "") + formatCurrency(totalBalance)}
              trend={formatTrend(netFlowTrend)}
              trendTone={netFlowTrend > 0 ? "positive" : netFlowTrend < 0 ? "negative" : "neutral"}
              icon={<Landmark className="h-5 w-5" strokeWidth={1.5} />}
              className="md:col-span-2 2xl:col-span-1 border-base-300 bg-base-200"
            />
            <StatsCard
              title="Monthly Income"
              amount={formatCurrency(currentMonthIncome)}
              trend={formatTrend(incomeTrendValue)}
              trendTone={incomeTrendValue > 0 ? "positive" : incomeTrendValue < 0 ? "negative" : "neutral"}
              icon={<TrendingUp className="h-5 w-5" strokeWidth={1.5} />}
              chartData={miniIncomeData}
              chartColor="#b34800"
            />
            <StatsCard
              title="Monthly Expense"
              amount={formatCurrency(currentMonthExpense)}
              trend={formatTrend(expenseTrendValue)}
              trendTone={expenseTrendValue < 0 ? "positive" : expenseTrendValue > 0 ? "negative" : "neutral"}
              icon={<TrendingDown className="h-5 w-5" strokeWidth={1.5} />}
              meta={
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-accent/60 uppercase font-black tracking-tight">Top category:</p>
                  <p className="text-[11px] font-black text-neutral">{topCategory}</p>
                </div>
              }
              chartData={miniExpenseData}
              chartColor="#b34800"
            />
          </div>

          <div className="rounded-[32px] border border-base-300 bg-base-200 p-1 shadow-sm overflow-hidden">
            <CashFlowChart data={chartData} />
          </div>
        </div>

        <div className="min-h-[420px] min-w-0 flex flex-col">
          <RecentFlow transactions={recentFlows} />
        </div>
      </section>
    </motion.div>
  );
}
