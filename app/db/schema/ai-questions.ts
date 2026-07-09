import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";
import { users } from "./users";

export const aiQuestions = pgTable("ai_questions", {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
        .references(() => users.id),

    companyId: uuid("company_id")
        .references(() => companies.id),

    question: text("question").notNull(),

    answer: text("answer").notNull(),

    responseTime: integer("response_time"),

    createdAt: timestamp("created_at").defaultNow(),
});