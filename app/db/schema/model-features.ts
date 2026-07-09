import {
    pgTable,
    uuid,
    text,
    numeric,
    integer,
} from "drizzle-orm/pg-core";

import { mlModels } from "./ml-models";

export const modelFeatures = pgTable("model_features", {
    id: uuid("id").defaultRandom().primaryKey(),

    modelId: uuid("model_id")
        .notNull()
        .references(() => mlModels.id, {
            onDelete: "cascade",
        }),

    featureName: text("feature_name").notNull(),

    importanceScore: numeric("importance_score"),

    rank: integer("rank"),
});