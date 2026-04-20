"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addBudget(data: { category: string; amount: number }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Upsert budget to avoid duplicates per category
  // Wait, Prisma doesn't support upsert without unique constraints.
  // Instead, find first and update, or create
  const existing = await db.budget.findFirst({
    where: { clerkId: userId, category: data.category }
  });

  let budget;
  if (existing) {
    budget = await db.budget.update({
      where: { id: existing.id },
      data: { amount: data.amount }
    });
  } else {
    budget = await db.budget.create({
      data: {
        clerkId: userId,
        category: data.category,
        amount: data.amount
      }
    });
  }

  revalidatePath("/budgets");
  return budget;
}
