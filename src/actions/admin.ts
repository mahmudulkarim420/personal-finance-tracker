"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Guard helper (Prisma DB is source of truth — not Clerk session claims) ──
async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized – not authenticated");

  // Always read the role from the database, never from the JWT/sessionClaims.
  // Clerk session tokens are cached and may not reflect a role change until
  // the user signs out and back in.
  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "admin") {
    console.error(`Admin access denied for user ${userId}. Role in DB: ${dbUser?.role || "none"}`);
    throw new Error("Unauthorized – admin only");
  }

  return userId;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlatformStats = {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: number;
  avgTransactionsPerUser: number;
};

export type OnboardingPoint = {
  date: string; // "Apr 12"
  signups: number;
};

export type ActivityPoint = {
  date: string;
  transactions: number;
};

export type AdminUser = {
  id: string;
  clerkId: string;
  email: string;
  role: string;
  createdAt: Date;
  transactionCount: number;
};

type TransactionCountByClerkId = {
  clerkId: string;
  _count: {
    id: number;
  };
};

// ─── Platform Stats ───────────────────────────────────────────────────────────

export async function getPlatformStats(): Promise<PlatformStats> {
  await requireAdmin();

  const [totalUsers, txAggregate] = await Promise.all([
    db.user.count(),
    db.transaction.aggregate({
      _count: { id: true },
      _sum: { amount: true },
    }),
  ]);

  const totalTransactions = txAggregate._count.id ?? 0;
  const totalVolume = txAggregate._sum.amount ?? 0;

  return {
    totalUsers,
    totalTransactions,
    totalVolume,
    avgTransactionsPerUser: totalUsers > 0 ? totalTransactions / totalUsers : 0,
  };
}

// ─── Onboarding Trend (last 30 days) ─────────────────────────────────────────

export async function getOnboardingTrend(): Promise<OnboardingPoint[]> {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const users = await db.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Build a map: "Apr 12" -> count
  const map = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    map.set(label, 0);
  }

  for (const u of users) {
    const label = new Date(u.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    map.set(label, (map.get(label) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([date, signups]) => ({ date, signups }));
}

// ─── Platform Activity (last 14 days) ────────────────────────────────────────

export async function getPlatformActivity(): Promise<ActivityPoint[]> {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const transactions = await db.transaction.findMany({
    where: { date: { gte: since } },
    select: { date: true },
    orderBy: { date: "asc" },
  });

  const map = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    map.set(label, 0);
  }

  for (const t of transactions) {
    const label = new Date(t.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    map.set(label, (map.get(label) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([date, transactions]) => ({ date, transactions }));
}

// ─── User List for Admin ──────────────────────────────────────────────────────

export async function getAdminUsers(): Promise<AdminUser[]> {
  await requireAdmin();

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Get transaction COUNTS per user (no sensitive data)
  const counts = await db.transaction.groupBy({
    by: ["clerkId"],
    _count: { id: true },
  });

  const countMap = new Map(counts.map((c: TransactionCountByClerkId) => [c.clerkId, c._count.id]));

  return users.map((u) => ({
    id: u.id,
    clerkId: u.clerkId,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    transactionCount: countMap.get(u.clerkId) ?? 0,
  }));
}

// ─── Toggle Role ──────────────────────────────────────────────────────────────

export async function toggleUserRole(
  targetId: string,
  currentRole: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = await requireAdmin();

    // Prevent self-demotion
    const targetUser = await db.user.findUnique({ where: { id: targetId } });
    if (!targetUser) return { success: false, error: "User not found" };
    if (targetUser.clerkId === adminId) {
      return { success: false, error: "You cannot change your own role" };
    }

    const newRole = currentRole === "admin" ? "user" : "admin";
    await db.user.update({ where: { id: targetId }, data: { role: newRole } });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e: unknown) {
    console.error(e);
    return { success: false, error: "Failed to toggle role" };
  }
}

// ─── Delete User ──────────────────────────────────────────────────────────────

export async function deleteUser(targetId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = await requireAdmin();

    const targetUser = await db.user.findUnique({ where: { id: targetId } });
    if (!targetUser) return { success: false, error: "User not found" };
    if (targetUser.clerkId === adminId) {
      return { success: false, error: "You cannot delete your own account" };
    }

    // Cascade-delete user data
    await db.transaction.deleteMany({ where: { clerkId: targetUser.clerkId } });
    await db.budget.deleteMany({ where: { clerkId: targetUser.clerkId } });
    await db.goal.deleteMany({ where: { clerkId: targetUser.clerkId } });
    await db.notification.deleteMany({ where: { clerkId: targetUser.clerkId } });
    await db.user.delete({ where: { id: targetId } });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e: unknown) {
    console.error(e);
    return { success: false, error: "Failed to delete user" };
  }
}
