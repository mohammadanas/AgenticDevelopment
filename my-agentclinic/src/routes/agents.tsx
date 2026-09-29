import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";

import { AgentDetail } from "../components/AgentDetail";
import { AgentsList } from "../components/AgentsList";
import { BookingForm } from "../components/BookingForm";
import { NotFound } from "../components/NotFound";
import { createRepository } from "../db/repository";

import { parseLocalDateTime } from "../time";

export const agentsRouter = (database: Database.Database, timeZone = "UTC", now: () => Date = () => new Date()) => {
  const router = new Hono();
  const repository = createRepository(database);

  router.get("/", (context) => context.html(html`<!doctype html>${<AgentsList agents={repository.listAgents()} />}`));
  router.get("/:id/appointments/new", (context) => {
    const value = context.req.param("id");
    if (!/^\d+$/.test(value)) return context.html(html`<!doctype html>${<NotFound />}`, 404);
    const agent = repository.findAgent(Number(value));
    if (!agent) return context.html(html`<!doctype html>${<NotFound />}`, 404);
    return context.html(html`<!doctype html>${<BookingForm agent={agent} />}`);
  });
  router.post("/:id/appointments", async (context) => {
    const value = context.req.param("id");
    if (!/^\d+$/.test(value)) return context.html(html`<!doctype html>${<NotFound />}`, 404);
    const agent = repository.findAgent(Number(value));
    if (!agent) return context.html(html`<!doctype html>${<NotFound />}`, 404);
    const body = await context.req.parseBody();
    const scheduledAt = typeof body.scheduled_at === "string" ? body.scheduled_at : "";
    const parsed = parseLocalDateTime(scheduledAt, timeZone);
    let error: string | undefined;
    if (!scheduledAt) error = "Choose an appointment date and time.";
    else if (!parsed.ok && parsed.reason === "ambiguous") error = "That time occurs twice because of a daylight-saving change. Choose another time.";
    else if (!parsed.ok && parsed.reason === "nonexistent") error = "That time does not exist because of a daylight-saving change. Choose another time.";
    else if (!parsed.ok) error = "Enter a valid appointment date and time.";
    else if (parsed.epochMs <= now().getTime()) error = "Choose a date and time in the future.";
    if (error || !parsed.ok) return context.html(html`<!doctype html>${<BookingForm agent={agent} value={scheduledAt} error={error} />}`, 422);
    const appointmentId = repository.createAppointment(agent.id, parsed.iso);
    return context.redirect(`/appointments/${appointmentId}`, 303);
  });
  router.get("/:id", (context) => {
    const value = context.req.param("id");
    if (!/^\d+$/.test(value)) return context.html(html`<!doctype html>${<NotFound />}`, 404);

    const agent = repository.findAgent(Number(value));
    if (!agent) return context.html(html`<!doctype html>${<NotFound />}`, 404);
    return context.html(html`<!doctype html>${<AgentDetail agent={agent} />}`);
  });

  return router;
};
