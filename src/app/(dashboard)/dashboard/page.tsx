import { checkUser } from "@/actions/checkUser";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Overview } from "@/components/dashboard/Overview";
import { FlowTransaction } from "@/components/dashboard/RecentFlow";

export default async function DashboardPage() {
  // Sync user with database
  await checkUser();

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Guard: if this user is an admin in the DB, send them to the admin panel.
  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });
  if (dbUser?.role === "admin") {
    redirect("/admin/overview");
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
  
  const currentNetFlow = currentMonthIncome - currentMonthExpense;
  const lastNetFlow = lastMonthIncome - lastMonthExpense;
  const netFlowTrend = calculateTrend(currentNetFlow, lastNetFlow);

  // Top category logic
  let topCategory = "None";
  let maxExpense = 0;
  for (const [cat, amt] of Object.entries(expenseCategories)) {
    if (amt > maxExpense) {
      maxExpense = amt;
      topCategory = cat;
    }
  }

  // Chart data
  const chartDataMap: Record<string, number> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData: { month: string; amount: number }[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mx = monthNames[d.getMonth()];
    chartData.push({ month: mx, amount: 0 });
    chartDataMap[`${d.getFullYear()}-${d.getMonth()}`] = chartData.length - 1;
  }

  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (chartDataMap[key] !== undefined) {
      chartData[chartDataMap[key]].amount += t.amount; // net flow
    }
  });

  const recentFlows: FlowTransaction[] = transactions.slice(0, 4).map(t => ({
    id: t.id,
    name: t.description || 'Transaction',
    category: t.category,
    amount: t.amount,
    status: t.status,
  }));

  const miniIncomeData = chartData.map(d => ({ value: Math.abs(d.amount) }));
  const miniExpenseData = chartData.map(d => ({ value: Math.abs(d.amount) }));

  return (
    <Overview 
      totalBalance={totalBalance}
      currentMonthIncome={currentMonthIncome}
      currentMonthExpense={currentMonthExpense}
      netFlowTrend={netFlowTrend}
      incomeTrendValue={incomeTrendValue}
      expenseTrendValue={expenseTrendValue}
      topCategory={topCategory}
      chartData={chartData}
      recentFlows={recentFlows}
      miniIncomeData={miniIncomeData}
      miniExpenseData={miniExpenseData}
    />
  );
}
