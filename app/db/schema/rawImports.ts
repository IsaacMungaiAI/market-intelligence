import {
    pgTable,
    uuid,
    text,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

export const rawImports = pgTable("raw_imports", {
    id: uuid("id").defaultRandom().primaryKey(),

    source: text("source").notNull(),
    dataType: text("data_type").notNull(),

    payload: text("payload").notNull(), // JSON string

    processed: boolean("processed").default(false),

    createdAt: timestamp("created_at").defaultNow(),
});