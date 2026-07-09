import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { markAsRead } from "@/app/services/notification.service";
import type { ApiResponse } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Notification id is required" } satisfies ApiResponse<never>,
                { status: 400 }
            );
        }

        const updated = await markAsRead(id);

        if (!updated) {
            return NextResponse.json(
                { error: "Notification not found" } satisfies ApiResponse<never>,
                { status: 404 }
            );
        }

        return NextResponse.json({ data: updated } satisfies ApiResponse<typeof updated>);
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" } satisfies ApiResponse<never>,
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Failed to mark notification as read" } satisfies ApiResponse<never>,
            { status: 500 }
        );
    }
}
