"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export type TransactionRecord = Prisma.TransactionGetPayload<{}>;

export async function getTransactions(): Promise<{ success: boolean; data?: TransactionRecord[]; error?: string }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const transactions = await db.transaction.findMany({
      where: {
        clerkId: userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return { success: true, data: transactions };
  } catch (error: any) {
    console.error("Failed to fetch transactions:", error);
    return { success: false, error: "Unable to load transactions" };
  }
}
