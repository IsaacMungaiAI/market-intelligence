import {
    pgTable,
    uuid,
    text,
    numeric,
} from "drizzle-orm/pg-core";

import { financialStatements } from "./financialStatements";

export const financialStatementItems = pgTable(
    "financial_statement_items",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        statementId: uuid("statement_id")
            .notNull()
            .references(() => financialStatements.id),

        label: text("label").notNull(),
        category: text("category"),

        value: numeric("value", { precision: 18, scale: 2 }),
    }
);