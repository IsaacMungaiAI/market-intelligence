import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { algorithmEnum, frameworkEnum, modelStatusEnum, modelTaskEnum } from "./enums";

export const mlModels = pgTable("ml_models", {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    name: text("name").notNull(),

    version: text("version").notNull(),

    task: modelTaskEnum("task")
        .notNull(),

    target: text("target"),

    algorithm: algorithmEnum("algorithm")
        .notNull(),

    framework: frameworkEnum("framework")
        .notNull(),

    modelPath: text("model_path"),

    trainingStart: timestamp("training_start"),

    trainingEnd: timestamp("training_end"),

    trainingRows: integer("training_rows"),

    status: modelStatusEnum("status").default("TRAINING").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});