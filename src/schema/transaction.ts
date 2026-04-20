import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters"),
  amount: z.number().refine(val => val !== 0, { message: "Amount cannot be zero" }),
  category: z.string().min(1, "Category is required"),
  account: z.string().min(1, "Account is required"),
  date: z.string().min(1, "Date is required"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
