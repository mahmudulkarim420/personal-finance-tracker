"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Syncs the currently logged-in Clerk user with our Prisma database.
 *
 * Role sync strategy (promotion-only, never demotes):
 * - New user      → role comes from Clerk publicMetadata.role (default: "user")
 * - Existing user → only upgrade to "admin" if Clerk says so.
 *                   Never overwrite an existing "admin" with "user".
 *
 * This means:
 *   - Promoting in Clerk dashboard → takes effect on next visit ✅
 *   - Manual DB promotion          → stays intact on next visit ✅
 *
 * @returns The up-to-date user object from the database, or null.
 */
export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  // Read the role Clerk carries in publicMetadata.
  // Falls back to "user" if not set.
  const clerkRole =
    (user.publicMetadata?.role as string | undefined) ?? "user";

  console.log(
    `[checkUser] clerkId=${user.id} | Clerk metadata role="${clerkRole}"`
  );

  try {
    const dbUser = await db.user.upsert({
      where: { clerkId: user.id },
      create: {
        // First time: use whatever Clerk says (could be "admin" if set before first login)
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        role: clerkRole,
      },
      update: {
        // Promotion-only: only write "admin" if Clerk explicitly grants it.
        // If Clerk says "user" but DB already has "admin", keep "admin" intact.
        ...(clerkRole === "admin" ? { role: "admin" } : {}),
      },
    });

    console.log(
      `[checkUser] DB synced → clerkId=${dbUser.clerkId} | final role="${dbUser.role}"`
    );

    return dbUser;
  } catch (error) {
    console.error("[checkUser] DB upsert failed:", error);
    return null;
  }
};
