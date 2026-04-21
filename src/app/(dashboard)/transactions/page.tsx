import Transaction from "@/components/transactions/Transaction";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch unique categories from the user's budgets
  const userBudgets = await db.budget.findMany({
    where: { clerkId: userId },
    select: { category: true }
  });

  const categories = userBudgets.map(b => b.category);

  return (
    <div className="space-y-6">
      <Transaction budgetCategories={categories} />
    </div>
  );
}
