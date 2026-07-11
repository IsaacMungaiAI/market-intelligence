import { getPortfolioDashboard } from "@/app/services/portfolio.service";
import { getWatchlistWithPrices } from "@/app/services/watchlist.service";
import { getSignals } from "@/app/services/signal.service";
import { getWatchlistCount } from "@/app/db/queries/watchlist";
import { getHoldingsCount } from "@/app/db/queries/dashboard";
import { db } from "@/app/index";
import { companies, portfolioHoldings, portfolios } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAuthenticatedUserId } from "@/app/lib/auth";
import type { DashboardData, SectorAllocation } from "@/lib/types";

export async function getDashboardData(): Promise<DashboardData> {
  const portfolio = await getPortfolioDashboard();
  const watchlist = await getWatchlistWithPrices();
  const signals = await getSignals();
  const watchlistCount = await getWatchlistCount();
  const holdingsCount = await getHoldingsCount();

  const sectorData = await getSectorAllocation();

  const stats = {
    portfolioValue: portfolio.totalValue,
    portfolioChange: portfolio.totalReturn,
    portfolioChangePercent: portfolio.totalReturnPercent,
    holdingsCount,
    watchlistCount,
    signalsCount: signals.length,
  };

  return {
    stats,
    watchlist: watchlist.slice(0, 4),
    signals: signals.slice(0, 3),
    sectorAllocation: sectorData,
  };
}

async function getSectorAllocation(): Promise<SectorAllocation[]> {
  const userId = await getAuthenticatedUserId();

  const result = await db
    .select({
      sector: companies.sector,
      totalQuantity: sql<number>`sum(${portfolioHoldings.quantity})`,
    })
    .from(portfolioHoldings)
    .innerJoin(companies, eq(portfolioHoldings.companyId, companies.id))
    .innerJoin(portfolios, eq(portfolioHoldings.portfolioId, portfolios.id))
    .where(eq(portfolios.userId, userId))
    .groupBy(companies.sector);

  const total = result.reduce((s, r) => s + (r.totalQuantity ?? 0), 0);

  return result.map((r) => ({
    sector: r.sector ?? "Other",
    weight: total > 0 ? ((r.totalQuantity ?? 0) / total) * 100 : 0,
    value: r.totalQuantity ?? 0,
  }));
}
