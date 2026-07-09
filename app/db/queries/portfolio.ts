import { db } from "@/app/index";
import { portfolioHoldings, companies, portfolios, notifications } from "@/app/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getAuthenticatedUserId } from "@/app/lib/auth";
import type { AddHoldingInput, HoldingDetail } from "@/lib/types";

export async function getPortfolio() {
  const userId = await getAuthenticatedUserId();

    return db
        .select({
            id: portfolioHoldings.id,
            companyId: companies.id,
            company: companies.name,
            ticker: companies.ticker,
            quantity: portfolioHoldings.quantity,
            avgCost: portfolioHoldings.avgCost,
        })
    .from(portfolioHoldings)
    .leftJoin(companies, eq(portfolioHoldings.companyId, companies.id))
    .innerJoin(portfolios, eq(portfolioHoldings.portfolioId, portfolios.id))
    .where(eq(portfolios.userId, userId));
}

export async function getHoldings(): Promise<HoldingDetail[]> {
  const userId = await getAuthenticatedUserId();

  return db
    .select({
      id: portfolioHoldings.id,
      companyId: portfolioHoldings.companyId,
      portfolioId: portfolioHoldings.portfolioId,
      company: companies.name,
      ticker: companies.ticker,
      quantity: portfolioHoldings.quantity,
      avgCost: sql<number>`coalesce(${portfolioHoldings.avgCost}, 0)`,
      createdAt: portfolioHoldings.createdAt,
    })
    .from(portfolioHoldings)
    .leftJoin(companies, eq(portfolioHoldings.companyId, companies.id))
    .innerJoin(portfolios, eq(portfolioHoldings.portfolioId, portfolios.id))
    .where(eq(portfolios.userId, userId));
}

export async function getOrCreatePortfolio() {
  const userId = await getAuthenticatedUserId();

  const existing = await db
    .select()
    .from(portfolios)
    .where(eq(portfolios.userId, userId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const created = await db
    .insert(portfolios)
    .values({ userId, name: "Main Portfolio" })
    .returning();

  return created[0];
}

export async function addHolding(input: AddHoldingInput) {
  const userId = await getAuthenticatedUserId();
  const portfolio = await getOrCreatePortfolio();

  const [company] = await db
    .select({ name: companies.name, ticker: companies.ticker })
    .from(companies)
    .where(eq(companies.id, input.companyId))
    .limit(1);

  const companyName = company?.name ?? company?.ticker ?? "Unknown";

  const existingHolding = await db
    .select()
    .from(portfolioHoldings)
    .where(
      and(
        eq(portfolioHoldings.portfolioId, portfolio.id),
        eq(portfolioHoldings.companyId, input.companyId)
      )
    )
    .limit(1);

  if (existingHolding.length > 0) {
    const existing = existingHolding[0];
    const existingQty = existing.quantity;
    const existingCost = Number(existing.avgCost ?? 0);
    const totalQty = existingQty + input.quantity;
    const blendedAvgCost =
      totalQty > 0
        ? (existingCost * existingQty + input.avgCost * input.quantity) / totalQty
        : input.avgCost;

    const updated = await db
      .update(portfolioHoldings)
      .set({
        quantity: totalQty,
        avgCost: String(blendedAvgCost),
      })
      .where(eq(portfolioHoldings.id, existing.id))
      .returning();

    await db.insert(notifications).values({
      userId,
      type: "holding_added",
      title: "Portfolio updated",
      body: `Added ${input.quantity} more share(s) of ${companyName}`,
      link: "/dashboard/portfolio",
    });

    return updated[0];
  }

  const inserted = await db
    .insert(portfolioHoldings)
    .values({
      portfolioId: portfolio.id,
      companyId: input.companyId,
      quantity: input.quantity,
      avgCost: String(input.avgCost),
    })
    .returning();

  await db.insert(notifications).values({
    userId,
    type: "holding_added",
    title: "Portfolio updated",
    body: `Added ${input.quantity} share(s) of ${companyName}`,
    link: "/dashboard/portfolio",
  });

  return inserted[0];
}

export async function removeHolding(holdingId: string) {
  const userId = await getAuthenticatedUserId();

  const [holding] = await db
    .select({
      companyId: portfolioHoldings.companyId,
      companyName: companies.name,
      ticker: companies.ticker,
    })
    .from(portfolioHoldings)
    .leftJoin(companies, eq(portfolioHoldings.companyId, companies.id))
    .where(
      and(
        eq(portfolioHoldings.id, holdingId),
        sql`${portfolioHoldings.portfolioId} IN (SELECT id FROM ${portfolios} WHERE user_id = ${userId})`
      )
    )
    .limit(1);

  await db
    .delete(portfolioHoldings)
    .where(
      and(
        eq(portfolioHoldings.id, holdingId),
        sql`${portfolioHoldings.portfolioId} IN (SELECT id FROM ${portfolios} WHERE user_id = ${userId})`
      )
    );

  if (holding) {
    const name = holding.companyName ?? holding.ticker ?? "Unknown";
    await db.insert(notifications).values({
      userId,
      type: "holding_removed",
      title: "Portfolio updated",
      body: `Removed ${name} from your portfolio`,
      link: "/dashboard/portfolio",
    });
  }
}
