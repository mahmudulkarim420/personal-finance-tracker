"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addGoal(data: { name: string; targetAmount: number; deadline?: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const goal = await db.goal.create({
    data: {
      clerkId: userId,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      deadline: data.deadline ? new Date(data.deadline) : null,
    }
  });

  revalidatePath("/goals");
  return goal;
}

export async function addFundsToGoal(goalId: string, amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const goal = await db.goal.update({
    where: { id: goalId },
    data: {
      currentAmount: {
        increment: amount
      }
    }
  });
  
  revalidatePath("/goals");
  return goal;
}
