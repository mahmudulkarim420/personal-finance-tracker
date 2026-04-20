import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { RecentFlow, FlowTransaction } from "@/components/dashboard/RecentFlow";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Landmark, TrendingDown, TrendingUp } from "lucide-react";
import { checkUser } from "@/actions/checkUser";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Sync user with database
  await checkUser();

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch all user transactions
  const transactions = await db.transaction.findMany({
    where: { clerkId: userId },
    orderBy: { date: "desc" },
  });

  // Date utilities
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Aggregate stats
  let totalBalance = 0;
  let currentMonthIncome = 0;
  let currentMonthExpense = 0;
  let lastMonthIncome = 0;
  let lastMonthExpense = 0;
  
  // To find top category
  const expenseCategories: Record<string, number> = {};

  transactions.forEach((t) => {
    totalBalance += t.amount;
    
    const d = new Date(t.date);
    const m = d.getMonth();
    const y = d.getFullYear();

    if (m === currentMonth && y === currentYear) {
      if (t.amount > 0) {
        currentMonthIncome += t.amount;
      } else {
        currentMonthExpense += Math.abs(t.amount);
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Math.abs(t.amount);
      }
    } else if (m === lastMonth && y === lastMonthYear) {
      if (t.amount > 0) {
        lastMonthIncome += t.amount;
      } else {
        lastMonthExpense += Math.abs(t.amount);
      }
    }
  });

  // Calculate trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const incomeTrendValue = calculateTrend(currentMonthIncome, lastMonthIncome);
  const expenseTrendValue = calculateTrend(currentMonthExpense, lastMonthExpense);
  
  // Dummy total balance trend since total balance doesn't compare month vs month directly in typical setups unless we calculate total balance at end of last month
  // We'll calculate a simple net flow trend for the total balance
  const currentNetFlow = currentMonthIncome - currentMonthExpense;
  const lastNetFlow = lastMonthIncome - lastMonthExpense;
  const netFlowTrend = calculateTrend(currentNetFlow, lastNetFlow);

  const formatCurrency = (val: number) =>
    `$${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatTrend = (val: number) => 
    `${val > 0 ? '+' : (val < 0 ? '' : '')}${val.toFixed(1)}% vs last month`;

  // Top category logic
  let topCategory = "None";
  let maxExpense = 0;
  for (const [cat, amt] of Object.entries(expenseCategories)) {
    if (amt > maxExpense) {
      maxExpense = amt;
      topCategory = cat;
    }
  }

  // Chart data: Group transactions by month for the last 6 months
  const chartDataMap: Record<string, number> = {};
  
  // Initialize last 6 months
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData: { month: string; amount: number }[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mx = monthNames[d.getMonth()];
    chartData.push({ month: mx, amount: 0 });
    chartDataMap[`${d.getFullYear()}-${d.getMonth()}`] = chartData.length - 1;
  }

  // We can choose to show Net Flow or Income for the Chart. 
  // Let's show Income - Expense (Net Flow) or just cumulative balance. User asked to "feed into chart". Let's show Net Flow per month.
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (chartDataMap[key] !== undefined) {
      chartData[chartDataMap[key]].amount += t.amount; // net flow
    }
  });

  // Recent 4 flows
  const recentFlows: FlowTransaction[] = transactions.slice(0, 4).map(t => ({
    id: t.id,
    name: t.description || 'Transaction',
    category: t.category,
    amount: t.amount,
    status: t.status,
  }));

  // Dummy mini-chart data for StatsCards (since these usually take small arrays of 6 values)
  // We can just use the chartData values for income/expense
  const miniIncomeData = chartData.map(d => ({ value: Math.abs(d.amount) })); // Simplified
  const miniExpenseData = chartData.map(d => ({ value: Math.abs(d.amount) }));

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
        <div className="min-w-0 space-y-4">
          <div className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            <StatsCard
              title="Total Balance"
              amount={(totalBalance < 0 ? "-" : "") + formatCurrency(totalBalance)}
              trend={formatTrend(netFlowTrend)}
              trendTone={netFlowTrend > 0 ? "positive" : netFlowTrend < 0 ? "negative" : "neutral"}
              icon={<Landmark className="h-5 w-5" strokeWidth={1.5} />}
              className="md:col-span-2 2xl:col-span-1"
            />
            <StatsCard
              title="Monthly Income"
              amount={formatCurrency(currentMonthIncome)}
              trend={formatTrend(incomeTrendValue)}
              trendTone={incomeTrendValue > 0 ? "positive" : incomeTrendValue < 0 ? "negative" : "neutral"}
              icon={<TrendingUp className="h-5 w-5" strokeWidth={1.5} />}
              chartData={miniIncomeData}
              chartColor="#10b981"
            />
            <StatsCard
              title="Monthly Expense"
              amount={formatCurrency(currentMonthExpense)}
              trend={formatTrend(expenseTrendValue)}
              trendTone={expenseTrendValue < 0 ? "positive" : expenseTrendValue > 0 ? "negative" : "neutral"}
              icon={<TrendingDown className="h-5 w-5" strokeWidth={1.5} />}
              meta={
                <>
                  <p className="text-[10px] text-neutral-600">Top category</p>
                  <p className="text-[11px] font-medium text-rose-400">{topCategory}</p>
                </>
              }
              chartData={miniExpenseData}
              chartColor="#f43f5e"
            />
          </div>

          <CashFlowChart data={chartData} />
        </div>

        <div className="min-h-[420px] min-w-0">
          <RecentFlow transactions={recentFlows} />
        </div>
      </section>
    </>
  );
}
