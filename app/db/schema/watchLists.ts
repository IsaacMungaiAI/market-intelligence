import {
    pgTable,
    uuid,
    timestamp,
} from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const watchlists = pgTable("watchlists", {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id").notNull(),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    createdAt: timestamp("created_at").defaultNow(),
});