import { db } from "@/app/index";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function getUserEmail(userId: string): Promise<string | null> {
    const [user] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    return user?.email ?? null;
}
