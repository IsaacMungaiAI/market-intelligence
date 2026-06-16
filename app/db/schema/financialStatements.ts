import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const financialStatements = pgTable("financial_statements", {
  id: uuid("id").defaultRandom().primaryKey(),

  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),

  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),

  fiscalYear: text("fiscal_year").notNull(),

  statementType: text("statement_type").notNull(), 
  // income | balance | cashflow

  currency: text("currency").default("KES"),

  source: text("source"),

  createdAt: timestamp("created_at").defaultNow(),
});