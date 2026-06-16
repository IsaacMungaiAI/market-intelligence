import {
    pgTable,
    uuid,
    date,
    numeric,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const dividends = pgTable("dividends", {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    exDate: date("ex_date"),
    paymentDate: date("payment_date"),

    amountPerShare: numeric("amount_per_share", {
        precision: 12,
        scale: 4,
    }),

    currency: text("currency").default("KES"),

    type: text("type"), // interim | final | special

    source: text("source"),

    createdAt: timestamp("created_at").defaultNow(),
});