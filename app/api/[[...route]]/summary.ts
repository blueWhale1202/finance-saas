import { differenceInDays, parse, subDays } from "date-fns";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";

import {
    accounts,
    categories as categoriesSchema,
    transactions,
} from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono().get(
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
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

        const periodLength = differenceInDays(endDate, startDate);

        const lastPeriodStart = subDays(startDate, periodLength);
        const lastPeriodEnd = subDays(endDate, periodLength);

        async function fetchFinancialData(
            userId: string,
            startDate: Date,
            endDate: Date
        ) {
            const [data] = await db
                .select({
                    income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
                        Number
                    ),
                    expense:
                        sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
                            Number
                        ),
                    remaining: sum(transactions.amount).mapWith(Number),
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId ? eq(accounts.id, accountId) : undefined,
                        eq(accounts.userId, userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate)
                    )
                );

            return data;
        }

        const [currentPeriod, lastPeriod] = await Promise.all([
            fetchFinancialData(auth.userId, startDate, endDate),
            fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd),
        ]);

        const incomeChange = calculatePercentageChange(
            lastPeriod.income,
            currentPeriod.income
        );
        const expenseChange = calculatePercentageChange(
            lastPeriod.expense,
            currentPeriod.expense
        );
        const remainingChange = calculatePercentageChange(
            lastPeriod.remaining,
            currentPeriod.remaining
        );

        const categories = await db
            .select({
                name: categoriesSchema.name,
                value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
            })
            .from(categoriesSchema)
            .innerJoin(
                transactions,
                eq(categoriesSchema.id, transactions.categoryId)
            )
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
                and(
                    accountId ? eq(accounts.id, accountId) : undefined,
                    eq(accounts.userId, auth.userId),
                    lt(transactions.amount, 0),
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate)
                )
            )
            .groupBy(categoriesSchema.name)
            .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

        const topCategories = categories.slice(0, 3);
        const otherCategories = categories.slice(3);

        const otherSum = otherCategories.reduce(
            (sum, category) => sum + category.value,
            0
        );

        const finalCategories = topCategories;
        if (otherCategories.length > 0) {
            finalCategories.push({
                name: "Other",
                value: otherSum,
            });
        }

        const activeDays = await db
            .select({
                date: transactions.date,
                income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
                    Number
                ),
                expense:
                    sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
                        Number
                    ),
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
                and(
                    accountId ? eq(accounts.id, accountId) : undefined,
                    eq(accounts.userId, auth.userId),
                    gte(transactions.date, startDate),
                    lte(transactions.date, endDate)
                )
            )
            .groupBy(transactions.date)
            .orderBy(transactions.date);

        const days = fillMissingDays(activeDays, startDate, endDate);

        return c.json({
            data: {
                remainingAmount: currentPeriod.remaining,
                remainingChange,
                incomeAmount: currentPeriod.income,
                incomeChange,
                expenseAmount: currentPeriod.expense,
                expenseChange,
                categories: finalCategories,
                days,
            },
        });
    }
);

export default app;
