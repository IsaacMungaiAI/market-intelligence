import {
    pgTable,
    uuid,
    integer,
    numeric,
    timestamp,
} from "drizzle-orm/pg-core";

import { mlModels } from "./ml-models";

export const modelTrainingLogs = pgTable("model_training_logs", {
    id: uuid("id").defaultRandom().primaryKey(),

    modelId: uuid("model_id")
        .notNull()
        .references(() => mlModels.id, {
            onDelete: "cascade",
        }),

    epoch: integer("epoch"),

    loss: numeric("loss"),

    validationLoss: numeric("validation_loss"),

    learningRate: numeric("learning_rate"),

    createdAt: timestamp("created_at").defaultNow(),
});