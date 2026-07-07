import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";
import { summaryTypeEnum } from "./enums";

export const aiCompanySummaries = pgTable("ai_company_summaries", {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    summaryType: summaryTypeEnum("summary_type")
        .notNull(),

    summary: text("summary").notNull(),

    modelUsed: text("model_used"),

    createdAt: timestamp("created_at").defaultNow(),

    expiresAt: timestamp("expires_at"),
});