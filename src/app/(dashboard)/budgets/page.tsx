import Budgets from "@/components/budgets/Budgets";
import { checkUser } from "@/actions/checkUser";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function BudgetsPage() {
  await checkUser();
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch budgets
  const budgets = await db.budget.findMany({
    where: { clerkId: userId },
  });

  // Fetch current month's transactions
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      clerkId: userId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const filteredExpenses = transactions.filter(t => t.type === "EXPENSE" || t.amount < 0);

  // Calculate totals
  let totalLimit = 0;
  let totalSpent = 0;
  
  const budgetData: Record<string, { limit: number; spent: number; count: number; originalName: string }> = {};
  
  // Initialize with budgets
  budgets.forEach(b => {
    // Standardize category key to lowercase for matching
    budgetData[b.category.toLowerCase()] = { limit: b.amount, spent: 0, count: 0, originalName: b.category };
    totalLimit += b.amount;
  });

  // Aggregate transactions
  filteredExpenses.forEach(t => {
    const categoryKey = t.category.toLowerCase();
    if (budgetData[categoryKey]) {
      const absAmount = Math.abs(t.amount);
      budgetData[categoryKey].spent += absAmount;
      budgetData[categoryKey].count += 1;
      totalSpent += absAmount;
    }
  });
  
  const categoryBudgets = Object.values(budgetData).map((data: any) => ({
    category: data.originalName,
    limit: data.limit,
    spent: data.spent,
    transactionsCount: data.count,
  }));

  // Velocity logic:
  // How far into the month are we vs how much we spent
  const daysInMonth = endOfMonth.getDate();
  const currentDay = now.getDate();
  const monthProgress = currentDay / daysInMonth;
  const spendProgress = totalLimit > 0 ? totalSpent / totalLimit : 0;
  
  const velocityDiff = (spendProgress - monthProgress) * 100; // positive means over-spending

  return (
    <div className="space-y-6">
      <Budgets 
        initialBudgets={categoryBudgets} 
        totalLimit={totalLimit} 
        totalSpent={totalSpent} 
        velocityDiff={velocityDiff}
        currentDay={currentDay}
        daysInMonth={daysInMonth}
      />
    </div>
  );
}
