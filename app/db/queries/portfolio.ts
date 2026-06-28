import { db } from "@/app/index";
import { portfolioHoldings, companies, portfolios } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUserId } from "@/app/lib/auth";

export async function getPortfolio() {
    const userId = await getAuthenticatedUserId();

    return db
        .select({
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

