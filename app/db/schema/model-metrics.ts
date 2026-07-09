import {
    pgTable,
    uuid,
    numeric,
    timestamp,
} from "drizzle-orm/pg-core";

import { mlModels } from "./ml-models";

export const modelMetrics = pgTable("model_metrics", {
    id: uuid("id").defaultRandom().primaryKey(),

    modelId: uuid("model_id")
        .notNull()
        .references(() => mlModels.id, {
            onDelete: "cascade",
        }),

    rmse: numeric("rmse"),

    mae: numeric("mae"),

    mape: numeric("mape"),

    r2: numeric("r2"),

    accuracy: numeric("accuracy"),

    precision: numeric("precision"),

    recall: numeric("recall"),

    f1Score: numeric("f1_score"),

    auc: numeric("auc"),

    crossValidationScore: numeric("cross_validation_score"),

    createdAt: timestamp("created_at").defaultNow(),
});