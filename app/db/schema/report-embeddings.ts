import {
    pgTable,
    uuid,
    integer,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { financialReports } from "./finance-report";

export const reportEmbeddings = pgTable("report_embeddings", {
    id: uuid("id").defaultRandom().primaryKey(),

    reportId: uuid("report_id")
        .notNull()
        .references(() => financialReports.id, {
            onDelete: "cascade",
        }),

    chunkIndex: integer("chunk_index").notNull(),

    chunkText: text("chunk_text").notNull(),

    embeddingId: text("embedding_id").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
});