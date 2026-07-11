import { db } from "@/app/index";
import { companies } from "@/app/db/schema";
import { eq } from "drizzle-orm";

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