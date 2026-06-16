import { getPortfolio } from "@/app/db/queries/portfolio";
import { getLatestPrice } from "@/app/db/queries/stock";
import { getAuthenticatedUserId } from "@/app/lib/auth";

/**
 * Get total portfolio value for the authenticated user.
 * The user id is always taken from the current session, never from the caller.
 */
export async function getPortfolioValue() {
    await getAuthenticatedUserId();
    const holdings = await getPortfolio();

    let total = 0;

    for (const h of holdings) {
        const price = await getLatestPrice(h.company ?? "");

        total += Number(price?.[0]?.close ?? 0) * h.quantity;
    }

    return total;
}
