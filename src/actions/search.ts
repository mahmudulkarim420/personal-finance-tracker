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

// Pages available only to regular users
const USER_PAGES: SearchResult[] = [
  { id: "page-dashboard", type: "page", label: "Dashboard", href: "/dashboard" },
  { id: "page-transactions", type: "page", label: "Transactions", href: "/transactions" },
  { id: "page-budgets", type: "page", label: "Budgets", href: "/budgets" },
  { id: "page-goals", type: "page", label: "Goals", href: "/goals" },
  { id: "page-settings", type: "page", label: "Settings", href: "/settings" },
];

// Pages available only to admins (standard user pages are intentionally excluded)
const ADMIN_PAGES: SearchResult[] = [
  { id: "page-admin-overview", type: "page", label: "Admin Dashboard", href: "/admin/overview" },
  { id: "page-admin-users", type: "page", label: "User Management", href: "/admin/users" },
];

/**
 * Search transactions (user) or return admin nav links (admin).
 * Role is always read from the Prisma database — never from Clerk session claims.
 */
export async function searchAll(query: string): Promise<{
  success: boolean;
  data?: SearchResult[];
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Source of truth: read role from DB
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    const isAdmin = dbUser?.role === "admin";
    const PAGES = isAdmin ? ADMIN_PAGES : USER_PAGES;

    const q = query.trim().toLowerCase();

    // Empty query → return all role-appropriate pages
    if (!q) {
      return { success: true, data: PAGES };
    }

    const matchedPages = PAGES.filter((p) => p.label.toLowerCase().includes(q));

    // Admins don't have personal transactions — return only page matches
    if (isAdmin) {
      return { success: true, data: matchedPages };
    }

    // For regular users: also search their transactions
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
