"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addBudget(data: { category: string; amount: number }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const budget = await db.budget.upsert({
    where: {
      clerkId_category: {
        clerkId: userId,
        category: data.category,
      },
    },
    update: {
      amount: data.amount,
    },
    create: {
      clerkId: userId,
      category: data.category,
      amount: data.amount,
    },
  });

  revalidatePath("/budgets");
  return budget;
}
