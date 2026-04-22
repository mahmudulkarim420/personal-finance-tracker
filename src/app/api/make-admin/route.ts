import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * ONE-TIME admin promotion endpoint.
 *
 * Usage (in browser while logged in):
 *   GET http://localhost:3000/api/make-admin?secret=obsidian-admin-2024
 *
 * After you've promoted yourself, you can delete this file.
 *
 * Security: requires a matching secret query param so random
 * visitors cannot promote themselves.
 */
const SETUP_SECRET = "obsidian-admin-2024";

export async function GET(request: Request) {
  // 1. Verify secret token
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== SETUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Must be authenticated
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 3. Promote in DB
  try {
    const updated = await db.user.update({
      where: { clerkId: userId },
      data: { role: "admin" },
      select: { clerkId: true, email: true, role: true },
    });

    console.log(`[make-admin] ✅ Promoted ${updated.email} to admin`);

    return NextResponse.json({
      success: true,
      message: `✅ Promoted to admin! You can now delete /api/make-admin/route.ts`,
      user: updated,
    });
  } catch (e) {
    console.error("[make-admin] DB update failed:", e);
    return NextResponse.json(
      { error: "DB update failed — is your user record in the DB?" },
      { status: 500 }
    );
  }
}
