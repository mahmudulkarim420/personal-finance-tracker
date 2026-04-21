"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(transactionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Ensure the transaction belongs to the user
    const transaction = await db.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transaction || transaction.clerkId !== userId) {
      return { success: false, error: "Transaction not found or unauthorized" };
    }

    await db.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/budgets");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Something went wrong" };
  }
}
