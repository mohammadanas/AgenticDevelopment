import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";

import { AgentDetail } from "../components/AgentDetail";
import { AgentsList } from "../components/AgentsList";
import { NotFound } from "../components/NotFound";
import { createRepository } from "../db/repository";

export const agentsRouter = (database: Database.Database) => {
  const router = new Hono();
  const repository = createRepository(database);

  router.get("/", (context) => context.html(html`<!doctype html>${<AgentsList agents={repository.listAgents()} />}`));
  router.get("/:id", (context) => {
    const value = context.req.param("id");
    if (!/^\d+$/.test(value)) return context.html(html`<!doctype html>${<NotFound />}`, 404);

    const agent = repository.findAgent(Number(value));
    if (!agent) return context.html(html`<!doctype html>${<NotFound />}`, 404);
    return context.html(html`<!doctype html>${<AgentDetail agent={agent} />}`);
  });

  return router;
};
