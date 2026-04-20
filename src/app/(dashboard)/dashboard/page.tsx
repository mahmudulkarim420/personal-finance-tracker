import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { RecentFlow } from "@/components/dashboard/RecentFlow";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Landmark, TrendingDown, TrendingUp } from "lucide-react";

const incomeData = [
  { value: 28000 },
  { value: 32000 },
  { value: 30000 },
  { value: 35000 },
  { value: 38000 },
  { value: 42500 },
];

const expenseData = [
  { value: 20000 },
  { value: 17500 },
  { value: 19000 },
  { value: 21000 },
  { value: 18500 },
  { value: 18240 },
];

export default function DashboardPage() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Financial Command Center
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            Monitor liquidity, spending pressure, and wealth momentum from a single
            glassmorphism dashboard.
          </p>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <StatsCard
              title="Total Balance"
              amount="$1,248,903.45"
              trend="+2.4% this month"
              trendTone="positive"
              icon={<Landmark className="h-5 w-5" strokeWidth={1.5} />}
              className="md:col-span-2 2xl:col-span-1"
            />
            <StatsCard
              title="Monthly Income"
              amount="$42,500.00"
              trend="+8.2% vs last month"
              trendTone="positive"
              icon={<TrendingUp className="h-5 w-5" strokeWidth={1.5} />}
              chartData={incomeData}
              chartColor="#10b981"
            />
            <StatsCard
              title="Monthly Expense"
              amount="$18,240.50"
              trend="-1.2% this month"
              trendTone="negative"
              icon={<TrendingDown className="h-5 w-5" strokeWidth={1.5} />}
              meta={
                <>
                  <p className="text-[10px] text-neutral-600">Top category</p>
                  <p className="text-[11px] font-medium text-rose-400">Real Estate</p>
                </>
              }
              chartData={expenseData}
              chartColor="#f43f5e"
            />
          </div>

          <CashFlowChart />
        </div>

        <div className="min-h-[420px]">
          <RecentFlow />
        </div>
      </section>
    </>
  );
}
