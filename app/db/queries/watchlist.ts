import { db } from "@/app/index";
import { watchlists, companies } from "@/app/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getAuthenticatedUserId } from "@/app/lib/auth";

export async function getWatchlist() {
  const userId = await getAuthenticatedUserId();

  return db
    .select({
      id: watchlists.id,
      companyId: watchlists.companyId,
      ticker: companies.ticker,
      company: companies.name,
      sector: companies.sector,
      createdAt: watchlists.createdAt,
    })
    .from(watchlists)
    .leftJoin(companies, eq(watchlists.companyId, companies.id))
    .where(eq(watchlists.userId, userId));
}

export async function addToWatchlist(companyId: string) {
  const userId = await getAuthenticatedUserId();

  const existing = await db
    .select()
    .from(watchlists)
    .where(
      and(eq(watchlists.userId, userId), eq(watchlists.companyId, companyId))
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const inserted = await db
    .insert(watchlists)
    .values({ userId, companyId })
    .returning();

  return inserted[0];
}

export async function removeFromWatchlist(watchlistId: string) {
  const userId = await getAuthenticatedUserId();

  return db
    .delete(watchlists)
    .where(
      and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId))
    );
}

export async function getWatchlistCount() {
  const userId = await getAuthenticatedUserId();

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(watchlists)
    .where(eq(watchlists.userId, userId));

  return Number(result[0]?.count ?? 0);
}
