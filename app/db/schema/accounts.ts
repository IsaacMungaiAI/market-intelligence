import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const accounts = pgTable("accounts", {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    provider: text("provider").notNull(), // google, github
    providerAccountId: text("provider_account_id").notNull(),

    accessToken: text("access_token"),
});