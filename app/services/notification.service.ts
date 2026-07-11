import { db } from "@/app/index";
import { notifications, notificationOutbox } from "@/app/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getAuthenticatedUserId } from "@/app/lib/auth";
import type { AppNotification, UnreadCount } from "@/lib/types";

type NotifyInput = {
    type: string;
    title: string;
    body: string;
    link?: string;
};

export async function createNotification(input: NotifyInput) {
    const userId = await getAuthenticatedUserId();

    const [notification] = await db
        .insert(notifications)
        .values({ userId, ...input })
        .returning();

    return notification;
}

export async function getNotifications(limit = 20): Promise<AppNotification[]> {
    const userId = await getAuthenticatedUserId();

    return db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit);
}

export async function getUnreadCount(): Promise<UnreadCount> {
    const userId = await getAuthenticatedUserId();

    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

    return { count: Number(result?.count ?? 0) };
}

export async function markAsRead(notificationId: string) {
    const userId = await getAuthenticatedUserId();

    const [updated] = await db
        .update(notifications)
        .set({ read: true })
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
        .returning();

    return updated;
}

export async function markAllAsRead() {
    const userId = await getAuthenticatedUserId();

    await db
        .update(notifications)
        .set({ read: true })
        .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
}

export async function queueEmailNotification(userId: string, subject: string, body: string) {
    const [entry] = await db
        .insert(notificationOutbox)
        .values({
            userId,
            channel: "email",
            payload: JSON.stringify({ subject, body }),
        })
        .returning();

    return entry;
}

export async function queuePushNotification(userId: string, title: string, body: string) {
    const [entry] = await db
        .insert(notificationOutbox)
        .values({
            userId,
            channel: "push",
            payload: JSON.stringify({ title, body }),
        })
        .returning();

    return entry;
}

export async function processOutbox() {
    return db
        .select()
        .from(notificationOutbox)
        .where(eq(notificationOutbox.status, "pending"))
        .orderBy(desc(notificationOutbox.createdAt))
        .limit(50);
}

export async function markOutboxSent(id: string) {
    await db
        .update(notificationOutbox)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(notificationOutbox.id, id));
}

export async function markOutboxFailed(id: string) {
    await db
        .update(notificationOutbox)
        .set({ status: "failed" })
        .where(eq(notificationOutbox.id, id));
}
