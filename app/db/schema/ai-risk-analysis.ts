import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";
import { financialReports } from "./finance-report";
import { riskTypeEnum, severityEnum } from "./enums";

export const aiRiskAnalysis = pgTable("ai_risk_analysis", {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    reportId: uuid("report_id")
        .references(() => financialReports.id),

    rriskType: riskTypeEnum("risk_type")
        .notNull(),

    severity: severityEnum("severity")
        .default("MEDIUM")
        .notNull(),

    description: text("description").notNull(),

    pageNumber: integer("page_number"),

    createdAt: timestamp("created_at").defaultNow(),
});