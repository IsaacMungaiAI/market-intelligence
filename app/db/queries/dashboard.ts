import { db } from "@/app/index";
import { portfolios, portfolioHoldings, watchlists } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAuthenticatedUserId } from "@/app/lib/auth";

export async function getHoldingsCount() {
  const userId = await getAuthenticatedUserId();

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(portfolioHoldings)
    .innerJoin(portfolios, eq(portfolioHoldings.portfolioId, portfolios.id))
    .where(eq(portfolios.userId, userId));

  return Number(result[0]?.count ?? 0);
}

export async function getPortfolioIds() {
  const userId = await getAuthenticatedUserId();

  return db
    .select({ id: portfolios.id })
    .from(portfolios)
    .where(eq(portfolios.userId, userId));
}
