import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/app/index";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function proxy(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isAuthApiRoute = req.nextUrl.pathname.startsWith("/api/auth");

    // Validate that the user still exists in the database.
    if (token?.userId) {
        const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.id, token.userId as string))
            .limit(1);

        if (!dbUser[0]) {
            if (isApiRoute) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }
            return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
        }
    }

    // Redirect to signin if accessing dashboard without token.
    if (!token && isDashboard) {
        return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Redirect to dashboard if already signed in and trying to access signin page.
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect API routes by default, except the NextAuth endpoints themselves.
    if (!token && isApiRoute && !isAuthApiRoute) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};
