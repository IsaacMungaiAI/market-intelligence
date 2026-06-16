import {
    pgTable,
    uuid,
    text,
    timestamp,
    date,
} from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
    id: uuid("id").defaultRandom().primaryKey(),

    ticker: text("ticker").notNull().unique(),
    name: text("name").notNull(),

    sector: text("sector"),
    industry: text("industry"),

    listingDate: date("listing_date"),
    currency: text("currency").default("KES"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});