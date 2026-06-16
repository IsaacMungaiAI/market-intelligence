import * as companyQueries from "@/app/db/queries/company";
import * as stockQueries from "@/app/db/queries/stock";

export async function getCompanyDashboard(ticker: string) {
    const [company] = await companyQueries.getCompanyByTicker(ticker);

    if (!company) return null;

    const latestPrice = await stockQueries.getLatestPrice(company.id);
    const priceSeries = await stockQueries.getPriceSeries(company.id);

    return {
        company,
        latestPrice: latestPrice?.[0],
        priceSeries,
    };
}