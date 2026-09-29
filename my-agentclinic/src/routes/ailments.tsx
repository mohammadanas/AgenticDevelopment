import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";

import { AilmentsList } from "../components/AilmentsList";
import { createRepository } from "../db/repository";

export const ailmentsRouter = (database: Database.Database) => {
  const router = new Hono();
  const repository = createRepository(database);
  router.get("/", (context) => context.html(html`<!doctype html>${<AilmentsList ailments={repository.listAilments()} />}`));
  return router;
};
