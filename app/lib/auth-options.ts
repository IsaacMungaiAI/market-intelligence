import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { db } from "@/app/index";
import { users, accounts } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            httpOptions: {
                timeout: 30000,
            },
        }),
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async authorized({ token }) {
            if (!token?.userId) return false;

            try {
                const dbUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, token.userId as string))
                    .limit(1);

                return !!dbUser[0];
            } catch {
                return false;
            }
        },

        async signIn({ user, account }) {
            if (!account || !user.email) return false;

            // 1. Check if user exists
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, user.email))
                .limit(1);

            let dbUser = existingUser[0];

            // 2. Create user if not exists
            if (!dbUser) {
                const created = await db
                    .insert(users)
                    .values({
                        email: user.email,
                        name: user.name,
                    })
                    .returning();

                dbUser = created[0];
            }

            // 3. Check if account exists
            const existingAccount = await db
                .select()
                .from(accounts)
                .where(
                    and(
                        eq(accounts.provider, account.provider),
                        eq(accounts.providerAccountId, account.providerAccountId)
                    )
                )
                .limit(1);

            if (!existingAccount.length) {
                await db.insert(accounts).values({
                    userId: dbUser.id,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    accessToken: account.access_token,
                });
            }

            return true;
        },

        async jwt({ token, user }) {
            // Attach the DB user id to the token on sign-in.
            if (user?.email) {
                const dbUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, user.email))
                    .limit(1);

                if (dbUser[0]) {
                    token.userId = dbUser[0].id;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.userId as string;
            }

            return session;
        },
    },
};
