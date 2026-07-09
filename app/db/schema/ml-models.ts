import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { algorithmEnum, frameworkEnum, modelTaskEnum } from "./enums";

export const modelStatusEnum = pgEnum("model_status", [
    "TRAINING",
    "ACTIVE",
    "ARCHIVED",
    "FAILED",
]);

export const mlModels = pgTable("ml_models", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    version: text("version").notNull(),

    task: modelTaskEnum("task")
        .notNull(),

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