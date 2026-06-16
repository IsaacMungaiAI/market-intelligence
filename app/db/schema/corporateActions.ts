import {
    pgTable,
    uuid,
    text,
    date,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const corporateActions = pgTable("corporate_actions", {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    type: text("type").notNull(),
    // split | bonus | rights_issue

    ratio: text("ratio"), // e.g. "2:1"

    effectiveDate: date("effective_date"),

    description: text("description"),
});