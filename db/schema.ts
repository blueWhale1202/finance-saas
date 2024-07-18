import { createId } from "@paralleldrive/cuid2";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accounts = pgTable("accounts", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    plainId: text("plain_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    plainId: text("plain_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const insertCategoriesSchema = createInsertSchema(categories);
