import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";
import accounts from "./accounts";

export const runtime = "edge";

const app = new Hono().basePath("/api");
const routes = app.route("/accounts", accounts);

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json({ error: "Internal Server Error" }, 500);
});

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
