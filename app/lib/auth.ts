import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { NextRequest, NextResponse } from "next/server";

export async function getSession() {
    return getServerSession(authOptions);
}

export async function requireSession() {
    const session = await getSession();

    if (!session?.user?.id) {
        throw new Error("Unauthorized: Authentication required");
    }

    return session;
}

/**
 * Middleware to protect API routes
 * Returns the session if authenticated, otherwise returns a 401 error response
 */
export async function requireAuth(req: NextRequest) {
    const session = await getSession();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized: Authentication required" },
            { status: 401 }
        );
    }

    return session;
}

/**
 * Ensure session exists and return userId
 * Throws error if user is not authenticated
 */
export async function getAuthenticatedUserId(): Promise<string> {
    const session = await requireSession();
    return session.user.id;
}

/**
 * Validate that a user owns a specific resource
 * Useful for portfolio, watchlist, and other user-scoped resources
 */
export async function validateUserOwnership(
    requiredUserId: string,
): Promise<boolean> {
    const session = await getSession();

    if (!session?.user?.id) {
        return false;
    }

    return session.user.id === requiredUserId;
}
