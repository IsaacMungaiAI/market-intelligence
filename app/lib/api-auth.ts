import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware for protecting API routes
 * Usage: const session = await withAuth(req);
 */
export async function withAuth(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token?.sub) {
        return {
            error: NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            ),
            session: null,
        };
    }

    return {
        error: null,
        session: {
            userId: token.sub,
            email: token.email,
        },
    };
}

/**
 * Validate that userId matches authenticated user
 */
export function validateUserAccess(
    requestedUserId: string,
    authenticatedUserId: string
): boolean {
    return requestedUserId === authenticatedUserId;
}
