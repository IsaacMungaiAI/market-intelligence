/*import { getPortfolio } from "@/app/db/queries/portfolio";
import { getLatestPrice } from "@/app/db/queries/stock";
import { getAuthenticatedUserId } from "@/app/lib/auth";

/**
 * Get total portfolio value for the authenticated user.
 * The user id is always taken from the current session, never from the caller.
 */
/*export async function getPortfolioValue() {
    await getAuthenticatedUserId();
    const holdings = await getPortfolio();

    let total = 0;

    for (const h of holdings) {
        const price = await getLatestPrice(h.company ?? "");

        total += Number(price?.[0]?.close ?? 0) * h.quantity;
    }

    return total;
}*/


// app/services/portfolio.ts

import { getPortfolio } from "@/app/db/queries/portfolio";
import { getLatestPrice } from "@/app/db/queries/stock";

export async function getPortfolioDashboard() {
    const holdings = await getPortfolio();

    let totalValue = 0;

    const portfolio = await Promise.all(
        holdings.map(async (holding) => {
            const latest = await getLatestPrice(holding.company ?? "");

            const currentPrice = Number(latest?.[0]?.close ?? 0);

            const marketValue = currentPrice * holding.quantity;

            totalValue += marketValue;

            return {
                ...holding,
                currentPrice,
                marketValue,
                profitLoss:
                    (currentPrice - Number(holding.avgCost)) *
                    holding.quantity,
            };
        })
    );

    return {
        totalValue,
        holdings: portfolio,
    };
}
