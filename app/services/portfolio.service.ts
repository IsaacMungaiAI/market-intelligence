import { getPortfolio } from "@/app/db/queries/portfolio";
import { getLatestPrice } from "@/app/db/queries/stock";
import type { PortfolioDashboard, PortfolioHolding } from "@/lib/types";

export async function getPortfolioDashboard(): Promise<PortfolioDashboard> {
  const holdings = await getPortfolio();

  let totalValue = 0;
  let totalCost = 0;

  const enrichedHoldings: PortfolioHolding[] = await Promise.all(
    holdings.map(async (holding) => {
      const companyId = holding.companyId ?? "";
      const latest = await getLatestPrice(companyId);
      const currentPrice = Number(latest?.[0]?.close ?? 0);
      const avgCost = Number(holding.avgCost ?? 0);
      const quantity = holding.quantity;
      const marketValue = currentPrice * quantity;
      const costBasis = avgCost * quantity;
      const profitLoss = marketValue - costBasis;
      const returnPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

      totalValue += marketValue;
      totalCost += costBasis;

      return {
        company: holding.company ?? "",
        ticker: holding.ticker ?? "",
        quantity,
        avgCost,
        currentPrice,
        marketValue,
        profitLoss,
        returnPercent,
      };
    })
  );

  const totalReturn = totalValue - totalCost;
  const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
  const maxWeightHolding = enrichedHoldings.reduce(
    (max, h) => (h.marketValue > max.marketValue ? h : max),
    enrichedHoldings[0] ?? { marketValue: 0 } as PortfolioHolding
  );
  const largestHoldingWeight = totalValue > 0
    ? (maxWeightHolding.marketValue / totalValue) * 100
    : 0;

  return {
    totalValue,
    totalCost,
    totalReturn,
    totalReturnPercent,
    holdingsCount: enrichedHoldings.length,
    largestHoldingWeight,
    holdings: enrichedHoldings,
  };
}
