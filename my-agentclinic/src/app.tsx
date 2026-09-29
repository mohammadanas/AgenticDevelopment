import { serveStatic } from "@hono/node-server/serve-static";
import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";

import { ErrorPage } from "./components/ErrorPage";
import type { Logger } from "./logger";
import { silentLogger } from "./logger";
import { Feedback } from "./pages/Feedback";
import { Home } from "./pages/Home";
import { agentsRouter } from "./routes/agents";
import { ailmentsRouter } from "./routes/ailments";
import { appointmentsRouter } from "./routes/appointments";
import { dashboardRouter } from "./routes/dashboard";
import { therapiesRouter } from "./routes/therapies";
import { resolveTimeZone } from "./time";

type AppOptions = { logger?: Logger; now?: () => Date; timeZone?: string };

export const createApp = (database: Database.Database, options: AppOptions = {}) => {
  const app = new Hono();
  const logger = options.logger ?? silentLogger;
  const now = options.now ?? (() => new Date());
  const timeZone = resolveTimeZone(options.timeZone);

  app.use("*", async (context, next) => {
    const started = performance.now();
    await next();
    logger.info(`${context.req.method} ${context.req.path} ${context.res.status} ${Math.round(performance.now() - started)}ms`);
  });

  app.get(
    "/static/pico.min.css",
    serveStatic({ path: "./node_modules/@picocss/pico/css/pico.min.css" }),
  );
  app.use("/static/*", serveStatic({ root: "./" }));

  app.get("/", (context) => context.html(html`<!doctype html>${<Home />}`));
  app.get("/feedback", (context) => context.html(html`<!doctype html>${<Feedback />}`));
  app.get("/health", (context) => context.json({ status: "ok" }));
  app.route("/agents", agentsRouter(database, timeZone, now));
  app.route("/ailments", ailmentsRouter(database));
  app.route("/therapies", therapiesRouter(database));
  app.route("/appointments", appointmentsRouter(database, timeZone));
  app.route("/dashboard", dashboardRouter(database, timeZone, now));

  app.notFound((context) => context.html(html`<!doctype html>${<ErrorPage status={404} title="Page not found" message="That page is not in the clinic directory." />}`, 404));
  app.onError((error, context) => {
    logger.error(`${context.req.method} ${context.req.path} failed`, error);
    return context.html(html`<!doctype html>${<ErrorPage status={500} title="The clinic hit a snag" message="Something went wrong. Please return home and try again." />}`, 500);
  });

  return app;
};
