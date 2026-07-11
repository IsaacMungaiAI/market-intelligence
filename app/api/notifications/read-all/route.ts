import { NextResponse } from "next/server";
import { markAllAsRead } from "@/app/services/notification.service";
import type { ApiResponse } from "@/lib/types";

export async function POST() {
    try {
        await markAllAsRead();

        return NextResponse.json(
            { data: { success: true } } satisfies ApiResponse<{ success: boolean }>
        );
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" } satisfies ApiResponse<never>,
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Failed to mark notifications as read" } satisfies ApiResponse<never>,
            { status: 500 }
        );
    }
}
