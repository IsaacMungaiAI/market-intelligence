import { db } from "@/app/index";
import { companies, stockPrices } from "@/app/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getCompanies() {
    return db.select().from(companies);
}

export async function getCompanyByTicker(ticker: string) {
    return db
        .select()
        .from(companies)
        .where(eq(companies.ticker, ticker))
        .limit(1);
}