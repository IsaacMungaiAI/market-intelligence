import {
    pgTable,
    uuid,
    text,
    timestamp,
    integer,
    numeric,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";
import { users } from "./users";

export const portfolios = pgTable("portfolios", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioHoldings = pgTable("portfolio_holdings", {
    id: uuid("id").defaultRandom().primaryKey(),

    portfolioId: uuid("portfolio_id").notNull(),
    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    quantity: integer("quantity").notNull(),

    avgCost: numeric("avg_cost", { precision: 12, scale: 2 }),

    createdAt: timestamp("created_at").defaultNow(),
});