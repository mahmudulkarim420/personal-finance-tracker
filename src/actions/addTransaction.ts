"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { transactionSchema, TransactionFormData } from "@/schema/transaction";

export async function addTransaction(data: TransactionFormData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate incoming data
    const validatedData = transactionSchema.safeParse({
      ...data,
      amount: Number(data.amount)
    });

    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Validation failed", 
        details: validatedData.error.flatten().fieldErrors 
      };
    }

    const { amount, description, category, account, date, type } = validatedData.data;

    // Create the transaction
    const transaction = await db.transaction.create({
      data: {
        clerkId: userId,
        amount,
        description,
        type,
        category,
        account,
        status: "CLEARED", // Defaulting to CLEARED for direct entries
        date: new Date(date),
      },
    });

    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: true, data: transaction };

  } catch (error: any) {
    console.error("Failed to add transaction:", error);
    return { success: false, error: error.message || "Failed to add transaction" };
  }
}
