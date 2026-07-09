import {
    pgTable,
    uuid,
    numeric,
    date,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const financialMetrics = pgTable("financial_metrics", {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    date: date("date").notNull(),

    peRatio: numeric("pe_ratio"),
    pbRatio: numeric("pb_ratio"),
    roe: numeric("roe"),
    roa: numeric("roa"),

    debtToEquity: numeric("debt_to_equity"),

    profitMargin: numeric("profit_margin"),
    revenueGrowthYoY: numeric("revenue_growth_yoy"),
    earningsGrowthYoY: numeric("earnings_growth_yoy"),

    revenue: numeric("revenue"),
    netIncome: numeric("net_income"),
    totalAssets: numeric("total_assets"),
    totalLiabilities: numeric("total_liabilities"),
    equity: numeric("equity"),
});