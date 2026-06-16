import {
    pgTable,
    uuid,
    date,
    numeric,
    integer,
    timestamp,
    index,
    text,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const stockPrices = pgTable(
    "stock_prices",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        companyId: uuid("company_id")
            .notNull()
            .references(() => companies.id),

        date: date("date").notNull(),

        open: numeric("open", { precision: 12, scale: 2 }),
        high: numeric("high", { precision: 12, scale: 2 }),
        low: numeric("low", { precision: 12, scale: 2 }),
        close: numeric("close", { precision: 12, scale: 2 }),
        adjustedClose: numeric("adjusted_close", { precision: 12, scale: 2 }),

        volume: integer("volume"),

        source: text("source"),

        createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
        companyDateIdx: index("stock_company_date_idx").on(
            table.companyId,
            table.date
        ),
    })
);