import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { html } from "hono/html";

import { Home } from "./pages/Home";

export const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (context) => context.html(html`<!doctype html>${<Home />}`));

app.get("/health", (context) => context.json({ status: "ok" }));
