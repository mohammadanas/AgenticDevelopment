import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";
import { Dashboard } from "../components/Dashboard";
import { ErrorPage } from "../components/ErrorPage";
import { createRepository } from "../db/repository";
import type { AppointmentStatus } from "../db/types";

const notices = new Set(["appointment-completed", "appointment-cancelled"] as const);

export const dashboardRouter = (database: Database.Database, timeZone: string, now: () => Date) => {
  const repository = createRepository(database);
  const router = new Hono();
  router.get("/", (context) => {
    const candidates = context.req.queries("notice") ?? [];
    const candidate = candidates.length === 1 ? candidates[0] : undefined;
    const notice = candidate && notices.has(candidate as "appointment-completed" | "appointment-cancelled") ? candidate as "appointment-completed" | "appointment-cancelled" : undefined;
    return context.html(html`<!doctype html>${<Dashboard data={repository.getDashboard(now().toISOString())} timeZone={timeZone} notice={notice} />}`);
  });
  router.post("/appointments/:id/status", async (context) => {
    const value = context.req.param("id");
    if (!/^\d+$/.test(value)) return context.html(html`<!doctype html>${<ErrorPage status={404} title="Appointment not found" message="We could not find that appointment." />}`, 404);
    const body = await context.req.parseBody();
    const status = body.status;
    if (status !== "completed" && status !== "cancelled") {
      return context.html(html`<!doctype html>${<ErrorPage status={422} title="Invalid appointment status" message="Choose completed or cancelled." />}`, 422);
    }
    const result = repository.transitionAppointment(Number(value), status as AppointmentStatus);
    if (result === "missing") return context.html(html`<!doctype html>${<ErrorPage status={404} title="Appointment not found" message="We could not find that appointment." />}`, 404);
    if (result === "terminal") return context.html(html`<!doctype html>${<ErrorPage status={409} title="Appointment already closed" message="Completed and cancelled appointments cannot be changed." />}`, 409);
    return context.redirect(`/dashboard?notice=appointment-${status}`, 303);
  });
  return router;
};
