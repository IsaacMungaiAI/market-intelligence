import {
    pgTable,
    uuid,
    text,
    timestamp,
    integer,
    pgEnum,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const reportStatusEnum = pgEnum(
    "report_status",
    [
        "PENDING",
        "DOWNLOADED",
        "PROCESSED",
        "FAILED",
    ]
);

export const financialReports = pgTable(
    "financial_reports",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        companyId: uuid("company_id")
            .notNull()
            .references(() => companies.id, {
                onDelete: "cascade",
            }),

        year: integer("year").notNull(),

        reportType: text("report_type")
            .notNull(),

        pdfUrl: text("pdf_url"),

        storageUrl: text("storage_url"),

        status: reportStatusEnum("status")
            .default("PENDING")
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        companyYearReportUnique: uniqueIndex(
            "financial_report_unique"
        ).on(
            table.companyId,
            table.year,
            table.reportType
        ),
    })
);