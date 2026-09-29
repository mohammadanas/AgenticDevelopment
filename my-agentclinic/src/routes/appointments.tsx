import type Database from "better-sqlite3";
import { Hono } from "hono";
import { html } from "hono/html";
import { AppointmentDetail } from "../components/AppointmentDetail";
import { ErrorPage } from "../components/ErrorPage";
import { createRepository } from "../db/repository";

export const appointmentsRouter = (database: Database.Database, timeZone: string) => {
  const repository = createRepository(database);
  const router = new Hono();
  router.get("/:id", (context) => {
    const value = context.req.param("id");
    if (!/^\d+$/.test(value)) return context.html(html`<!doctype html>${<ErrorPage status={404} title="Appointment not found" message="We could not find that appointment." />}`, 404);
    const appointment = repository.findAppointment(Number(value));
    if (!appointment) return context.html(html`<!doctype html>${<ErrorPage status={404} title="Appointment not found" message="We could not find that appointment." />}`, 404);
    return context.html(html`<!doctype html>${<AppointmentDetail appointment={appointment} timeZone={timeZone} />}`);
  });
  return router;
};
