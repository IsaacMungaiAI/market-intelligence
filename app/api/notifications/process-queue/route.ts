import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { processOutbox, markOutboxSent, markOutboxFailed } from "@/app/services/notification.service";
import type { ApiResponse } from "@/lib/types";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST() {
    try {
        const pending = await processOutbox();
        const results: { id: string; channel: string; status: string }[] = [];

        for (const item of pending) {
            const payload = JSON.parse(item.payload);
            const channel = item.channel;

            try {
                if (channel === "email" && RESEND_API_KEY) {
                    const { getUserEmail } = await import("@/app/db/queries/user");
                    const email = await getUserEmail(item.userId);

                    if (email) {
                        const res = await fetch("https://api.resend.com/emails", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${RESEND_API_KEY}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                from: "KMIP <notifications@kmip.app>",
                                to: email,
                                subject: payload.subject,
                                text: payload.body,
                            }),
                        });

                        if (!res.ok) {
                            throw new Error(`Resend API error: ${res.status}`);
                        }
                    }
                }

                await markOutboxSent(item.id);
                results.push({ id: item.id, channel, status: "sent" });
            } catch {
                await markOutboxFailed(item.id);
                results.push({ id: item.id, channel, status: "failed" });
            }
        }

        return NextResponse.json({
            data: { processed: results.length, results },
        } satisfies ApiResponse<{ processed: number; results: typeof results }>);
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" } satisfies ApiResponse<never>,
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: "Failed to process notification queue" } satisfies ApiResponse<never>,
            { status: 500 }
        );
    }
}
