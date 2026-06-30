import * as companyQueries from "@/app/db/queries/company";
import * as stockQueries from "@/app/db/queries/stock";
import type { Company, CompanyDashboard } from "@/lib/types";

export async function getCompanies(): Promise<Company[]> {
  return companyQueries.getCompanies() as Promise<Company[]>;
}

export async function getCompanyDashboard(ticker: string): Promise<CompanyDashboard | null> {
  const [company] = await companyQueries.getCompanyByTicker(ticker);

  if (!company) return null;

  const latestPrice = await stockQueries.getLatestPrice(company.id);
  const priceSeries = await stockQueries.getPriceSeries(company.id);

  return {
    company: company as unknown as Company,
    latestPrice: (latestPrice?.[0] as CompanyDashboard["latestPrice"]) ?? null,
    priceSeries: priceSeries as CompanyDashboard["priceSeries"],
  };
}
