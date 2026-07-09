import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { getNotifications, getUnreadCount } from "@/app/services/notification.service";
import type { ApiResponse, AppNotification, UnreadCount } from "@/lib/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get("unread") === "true";

        if (unreadOnly) {
            const count = await getUnreadCount();
            return NextResponse.json({ data: count } satisfies ApiResponse<UnreadCount>);
        }

        const data = await getNotifications();
        return NextResponse.json({ data } satisfies ApiResponse<AppNotification[]>);
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" } satisfies ApiResponse<never>,
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Failed to fetch notifications" } satisfies ApiResponse<never>,
            { status: 500 }
        );
    }
}
