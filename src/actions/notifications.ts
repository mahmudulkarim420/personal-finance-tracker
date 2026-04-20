"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type NotificationRecord = {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  clerkId: string;
  createdAt: Date;
};

/**
 * Fetch all notifications for the currently authenticated user.
 */
export async function getNotifications(): Promise<{
  success: boolean;
  data?: NotificationRecord[];
  hasUnread?: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const notifications = await db.notification.findMany({
      where: { clerkId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const hasUnread = notifications.some((n) => !n.isRead);

    return { success: true, data: notifications, hasUnread };
  } catch (error: unknown) {
    console.error("Failed to fetch notifications:", error);
    return { success: false, error: "Unable to load notifications" };
  }
}

/**
 * Mark a single notification as read by its ID.
 */
export async function markAsRead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    await db.notification.update({
      where: { id, clerkId: userId },
      data: { isRead: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: "Unable to update notification" };
  }
}

/**
 * Mark ALL notifications as read for the current user.
 */
export async function markAllAsRead(): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    await db.notification.updateMany({
      where: { clerkId: userId, isRead: false },
      data: { isRead: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to mark all as read:", error);
    return { success: false, error: "Unable to update notifications" };
  }
}
