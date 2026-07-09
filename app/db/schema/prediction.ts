import {
    pgTable,
    uuid,
    numeric,
    text,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";
import { predictionRuns } from "./prediction-runs";

export const predictions = pgTable("predictions", {
    id: uuid("id").defaultRandom().primaryKey(),

    runId: uuid("run_id")
        .notNull()
        .references(() => predictionRuns.id, {
            onDelete: "cascade",
        }),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    target: text("target"),

    predictedValue: numeric("predicted_value").notNull(),

    confidence: numeric("confidence"),

    lowerBound: numeric("lower_bound"),

    upperBound: numeric("upper_bound"),

    actualValue: numeric("actual_value"),

    isVerified: boolean("is_verified").default(false),

    createdAt: timestamp("created_at").defaultNow(),
});