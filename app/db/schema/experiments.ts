import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { experimentStatusEnum } from "./enums";

export const experiments = pgTable("experiments", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    description: text("description"),

    algorithm: text("algorithm").notNull(),

    parameters: text("parameters"),

    datasetVersion: text("dataset_version"),

    status: experimentStatusEnum("status")
        .default("RUNNING")
        .notNull(),

    createdAt: timestamp("created_at").defaultNow(),
});