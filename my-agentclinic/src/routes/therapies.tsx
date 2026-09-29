import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";
import { TherapiesList } from "../components/TherapiesList";
import { createRepository } from "../db/repository";

export const therapiesRouter = (database: Database.Database) => {
  const repository = createRepository(database);
  const router = new Hono();
  router.get("/", (context) => context.html(html`<!doctype html>${<TherapiesList therapies={repository.listTherapies()} />}`));
  return router;
};
