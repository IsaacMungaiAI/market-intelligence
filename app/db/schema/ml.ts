import {
    pgTable,
    uuid,
    text,
    numeric,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const mlModels = pgTable("ml_models", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    version: text("version").notNull(),
    type: text("type"),

    metrics: text("metrics"), // JSON string for now

    createdAt: timestamp("created_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    modelName: text("model_name").notNull(),

    target: text("target").notNull(),

    predictionValue: numeric("prediction_value"),

    confidenceScore: numeric("confidence_score"),

    horizon: text("horizon"), // 3m | 6m | 1y

    createdAt: timestamp("created_at").defaultNow(),
});