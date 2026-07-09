import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";
import { mlModels } from "./ml-models";
import { predictionStatusEnum, predictionTypeEnum } from "./enums";

export const predictionRuns = pgTable("prediction_runs", {
    id: uuid("id").defaultRandom().primaryKey(),

    modelId: uuid("model_id")
        .notNull()
        .references(() => mlModels.id),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    predictionDate: timestamp("prediction_date").defaultNow(),

    targetDate: timestamp("target_date"),

    predictionType: predictionTypeEnum("prediction_type")
        .notNull(),

    status: predictionStatusEnum("status")
        .default("PENDING")
        .notNull(),

    runtimeMs: integer("runtime_ms"),

    createdAt: timestamp("created_at").defaultNow(),
});