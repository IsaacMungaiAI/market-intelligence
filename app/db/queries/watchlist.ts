import { db } from "@/app/index";
import { watchlists, companies, notifications } from "@/app/db/schema";
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

  const [company] = await db
    .select({ name: companies.name, ticker: companies.ticker })
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  const name = company?.name ?? company?.ticker ?? "Unknown";
  await db.insert(notifications).values({
    userId,
    type: "watchlist_added",
    title: "Watchlist updated",
    body: `Added ${name} to your watchlist`,
    link: "/dashboard/watchlists",
  });

  return inserted[0];
}

export async function removeFromWatchlist(watchlistId: string) {
  const userId = await getAuthenticatedUserId();

  const [entry] = await db
    .select({
      companyId: watchlists.companyId,
      companyName: companies.name,
      ticker: companies.ticker,
    })
    .from(watchlists)
    .leftJoin(companies, eq(watchlists.companyId, companies.id))
    .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)))
    .limit(1);

  await db
    .delete(watchlists)
    .where(
      and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId))
    );

  if (entry) {
    const name = entry.companyName ?? entry.ticker ?? "Unknown";
    await db.insert(notifications).values({
      userId,
      type: "watchlist_removed",
      title: "Watchlist updated",
      body: `Removed ${name} from your watchlist`,
      link: "/dashboard/watchlists",
    });
  }
}

export async function getWatchlistCount() {
  const userId = await getAuthenticatedUserId();

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(watchlists)
    .where(eq(watchlists.userId, userId));

  return Number(result[0]?.count ?? 0);
}
