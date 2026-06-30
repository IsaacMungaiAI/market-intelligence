import * as watchlistQueries from "@/app/db/queries/watchlist";
import { getLatestPrice } from "@/app/db/queries/stock";
import type { WatchlistItem } from "@/lib/types";

export async function getWatchlistWithPrices(): Promise<WatchlistItem[]> {
  const items = await watchlistQueries.getWatchlist();

  const enriched = await Promise.all(
    items.map(async (item) => {
      const latest = await getLatestPrice(item.companyId);
      const price = Number(latest?.[0]?.close ?? 0);
      const prevClose = Number(latest?.[0]?.open ?? price);
      const change = price - prevClose;
      const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

      return {
        id: item.id,
        companyId: item.companyId,
        company: item.company ?? "",
        ticker: item.ticker ?? "",
        sector: item.sector,
        price,
        change,
        changePercent,
        createdAt: item.createdAt ?? new Date(),
      };
    })
  );

  return enriched;
}
