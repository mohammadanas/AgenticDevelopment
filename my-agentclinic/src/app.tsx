import { serveStatic } from "@hono/node-server/serve-static";
import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";

import { Home } from "./pages/Home";
import { agentsRouter } from "./routes/agents";
import { ailmentsRouter } from "./routes/ailments";

export const createApp = (database: Database.Database) => {
  const app = new Hono();

  app.get(
    "/static/pico.min.css",
    serveStatic({ path: "./node_modules/@picocss/pico/css/pico.min.css" }),
  );
  app.use("/static/*", serveStatic({ root: "./" }));

  app.get("/", (context) => context.html(html`<!doctype html>${<Home />}`));
  app.get("/health", (context) => context.json({ status: "ok" }));
  app.route("/agents", agentsRouter(database));
  app.route("/ailments", ailmentsRouter(database));

  return app;
};
