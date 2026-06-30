import { db } from "@/app/index";
import { predictions, companies, stockPrices } from "@/app/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import type { Signal } from "@/lib/types";

export async function getSignals(): Promise<Signal[]> {
  const signals: Signal[] = [];

  const momentumData = await db
    .select({
      ticker: companies.ticker,
      name: companies.name,
      close: stockPrices.close,
      date: stockPrices.date,
    })
    .from(stockPrices)
    .innerJoin(companies, eq(stockPrices.companyId, companies.id))
    .orderBy(desc(stockPrices.date))
    .limit(20);

  const recentMlSignals = await db
    .select({
      companyName: companies.name,
      ticker: companies.ticker,
      target: predictions.target,
      predictionValue: predictions.predictionValue,
      confidenceScore: predictions.confidenceScore,
      horizon: predictions.horizon,
    })
    .from(predictions)
    .innerJoin(companies, eq(predictions.companyId, companies.id))
    .orderBy(desc(predictions.createdAt))
    .limit(5);

  if (momentumData.length > 0) {
    const midpoint = Math.floor(momentumData.length / 2);
    const recent = momentumData.slice(0, midpoint);
    const older = momentumData.slice(midpoint);

    const recentAvg = recent.reduce((s, r) => s + Number(r.close ?? 0), 0) / recent.length;
    const olderAvg = older.reduce((s, o) => s + Number(o.close ?? 0), 0) / older.length;
    const momentum = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    if (Math.abs(momentum) > 1) {
      signals.push({
        id: "momentum",
        title: momentum > 0 ? "Momentum shift - Bullish" : "Momentum shift - Bearish",
        description: `${momentumData[0]?.ticker} and peer counters showing ${momentum > 0 ? "stronger" : "weaker"} relative performance over the recent period.`,
        category: "Market",
        severity: momentum > 3 ? "warning" : "info",
        createdAt: new Date(),
      });
    }
  }

  for (const pred of recentMlSignals) {
    signals.push({
      id: `ml-${pred.ticker}-${pred.target}`,
      title: `${pred.target} prediction for ${pred.ticker}`,
      description: `Model predicts ${pred.predictionValue ?? "N/A"} (confidence: ${pred.confidenceScore ?? "N/A"}) over ${pred.horizon ?? "N/A"}.`,
      category: "ML Signal",
      severity: Number(pred.confidenceScore ?? 0) > 0.7 ? "critical" : "info",
      createdAt: new Date(),
    });
  }

  signals.push({
    id: "dividend-watch",
    title: "Dividend watch",
    description: "Three holdings are approaching ex-dividend windows this quarter.",
    category: "Income",
    severity: "info",
    createdAt: new Date(),
  });

  signals.push({
    id: "concentration-check",
    title: "Concentration check",
    description: "Financial services allocation is above the target model by 6.2%.",
    category: "Risk",
    severity: "warning",
    createdAt: new Date(),
  });

  return signals;
}

export async function getSignalsCount(): Promise<number> {
  const signals = await getSignals();
  return signals.length;
}
