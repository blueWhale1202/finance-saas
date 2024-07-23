import { parse, subDays } from "date-fns";
import { Hono } from "hono";
import { z } from "zod";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import {
    accounts,
    categories,
    insertTransactionSchema,
    transactions,
} from "@/db/schema";
import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { from, to, accountId } = c.req.valid("query");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);

            const startDate = from
                ? parse(from, "yyyy-MM-dd", new Date())
                : defaultFrom;
            const endDate = to
                ? parse(to, "yyyy-MM-dd", new Date())
                : defaultTo;

            const data = await db
                .select({
                    id: transactions.id,
                    payee: transactions.payee,
                    notes: transactions.notes,
                    date: transactions.date,
                    amount: transactions.amount,
                    account: accounts.name,
                    accountId: transactions.accountId,
                    category: categories.name,
                    categoryId: transactions.categoryId,
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .leftJoin(
                    categories,
                    eq(transactions.categoryId, categories.id)
                )
                .where(
                    and(
                        accountId
                            ? eq(transactions.accountId, accountId)
                            : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate)
                    )
                )
                .orderBy(desc(transactions.date));

            return c.json({ data });
        }
    )
    .get(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            const [data] = await db
                .select({
                    id: transactions.id,
                    payee: transactions.payee,
                    notes: transactions.notes,
                    date: transactions.date,
                    amount: transactions.amount,
                    categoryId: transactions.categoryId,
                    accountId: transactions.accountId,
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(transactions.id, id),
                        eq(accounts.userId, auth.userId)
                    )
                );

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
        }
    )
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertTransactionSchema.omit({ id: true })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db
                .insert(transactions)
                .values({ ...values })
                .returning();

            return c.json({ data });
        }
    )
    .post(
        "/bulk-create",
        clerkMiddleware(),
        zValidator("json", z.array(insertTransactionSchema.omit({ id: true }))),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .insert(transactions)
                .values(values)
                .returning();

            return c.json({ data });
        }
    )
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string()),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { ids } = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const transactionToDelete = db.$with("transaction_to_delete").as(
                db
                    .select({ id: transactions.id })
                    .from(transactions)
                    .innerJoin(
                        accounts,
                        eq(transactions.accountId, accounts.id)
                    )
                    .where(
                        and(
                            inArray(transactions.id, ids),
                            eq(accounts.userId, auth.userId)
                        )
                    )
            );

            const data = await db
                .with(transactionToDelete)
                .delete(transactions)
                .where(
                    inArray(
                        transactions.id,
                        db
                            .select({ id: transactionToDelete.id })
                            .from(transactionToDelete)
                    )
                )
                .returning({ id: transactions.id });

            return c.json({ data });
        }
    )
    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string(),
            })
        ),
        zValidator("json", insertTransactionSchema.omit({ id: true })),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");
            console.log("🚀 ~ values:", values);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            const transactionToUpdate = db.$with("transaction_to_update").as(
                db
                    .select({ id: transactions.id })
                    .from(transactions)
                    .innerJoin(
                        accounts,
                        eq(transactions.accountId, accounts.id)
                    )
                    .where(
                        and(
                            eq(transactions.id, id),
                            eq(accounts.userId, auth.userId)
                        )
                    )
            );

            const [data] = await db
                .with(transactionToUpdate)
                .update(transactions)
                .set(values)
                .where(
                    inArray(
                        transactions.id,
                        db
                            .select({ id: transactionToUpdate.id })
                            .from(transactionToUpdate)
                    )
                )
                .returning();
            console.log("🚀 ~ data:", data);

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
        }
    )
    .delete(
        "/:id",
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            const transactionToDelete = db.$with("transaction_to_delete").as(
                db
                    .select({ id: transactions.id })
                    .from(transactions)
                    .innerJoin(
                        accounts,
                        eq(transactions.accountId, accounts.id)
                    )
                    .where(
                        and(
                            eq(transactions.id, id),
                            eq(accounts.userId, auth.userId)
                        )
                    )
            );

            const [data] = await db
                .with(transactionToDelete)
                .delete(transactions)
                .where(
                    inArray(
                        transactions.id,
                        db
                            .select({ id: transactionToDelete.id })
                            .from(transactionToDelete)
                    )
                )
                .returning({ id: transactions.id });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
        }
    );

export default app;
