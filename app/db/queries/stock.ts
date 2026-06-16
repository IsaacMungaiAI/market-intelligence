import { db } from "@/app/index";
import { stockPrices } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getLatestPrice(companyId: string) {
  return db
    .select()
    .from(stockPrices)
    .where(eq(stockPrices.companyId, companyId))
    .orderBy(desc(stockPrices.date))
    .limit(1);
}

export async function getPriceSeries(companyId: string) {
  return db
    .select()
    .from(stockPrices)
    .where(eq(stockPrices.companyId, companyId))
    .orderBy(stockPrices.date);
}