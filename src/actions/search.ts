"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export type SearchResult = {
  id: string;
  type: "transaction" | "page";
  label: string;
  sublabel?: string;
  href?: string;
  amount?: number;
  txType?: string;
};

const PAGES: SearchResult[] = [
  { id: "page-dashboard", type: "page", label: "Dashboard", href: "/dashboard" },
  { id: "page-transactions", type: "page", label: "Transactions", href: "/transactions" },
  { id: "page-budgets", type: "page", label: "Budgets", href: "/budgets" },
  { id: "page-goals", type: "page", label: "Goals", href: "/goals" },
  { id: "page-settings", type: "page", label: "Settings", href: "/settings" },
];

/**
 * Search transactions by description or category, and also return matching pages.
 */
export async function searchAll(query: string): Promise<{
  success: boolean;
  data?: SearchResult[];
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const q = query.trim().toLowerCase();

    // Filter pages client-side (they're static)
    const matchedPages = PAGES.filter((p) => p.label.toLowerCase().includes(q));

    if (!q) {
      return { success: true, data: PAGES };
    }

    // Search transactions from DB
    const transactions = await db.transaction.findMany({
      where: {
        clerkId: userId,
        OR: [
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { date: "desc" },
      take: 8,
    });

    const txResults: SearchResult[] = transactions.map((t) => ({
      id: t.id,
      type: "transaction",
      label: t.description || t.category,
      sublabel: t.category,
      href: "/transactions",
      amount: t.amount,
      txType: t.type,
    }));

    return { success: true, data: [...matchedPages, ...txResults] };
  } catch (error: unknown) {
    console.error("Search failed:", error);
    return { success: false, error: "Search failed" };
  }
}
