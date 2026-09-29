import type Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "./app";
import { createDatabase } from "./db/database";
import { migrate } from "./db/migrate";
import { seed } from "./db/seed";

let database: Database.Database;
let app: ReturnType<typeof createApp>;

beforeAll(() => {
  database = createDatabase(":memory:");
  migrate(database);
  seed(database);
  app = createApp(database, { timeZone: "UTC", now: () => new Date("2026-09-29T10:00:00.000Z") });
});

afterAll(() => database.close());

describe("shared application routes", () => {
  it("preserves the home and health contracts", async () => {
    const home = await app.request("/");
    const body = await home.text();
    expect(home.status).toBe(200);
    expect(body).toMatch(/^<!doctype html>/i);
    expect(body).toContain("AgentClinic is open");
    expect(body).toContain('href="#main-content"');
    expect(body).toContain('class="hero"');
    expect(body).toContain('<nav aria-label="Primary navigation">');
    expect(body).toContain('href="/agents"');
    expect(body).toContain('href="/ailments"');
    expect(body.indexOf("/static/pico.min.css")).toBeLessThan(body.indexOf("/static/style.css"));

    const health = await app.request("/health");
    expect(health.status).toBe(200);
    await expect(health.json()).resolves.toEqual({ status: "ok" });
  });

  it("serves PicoCSS and project overrides locally", async () => {
    const pico = await app.request("/static/pico.min.css");
    expect(pico.status).toBe(200);
    expect(pico.headers.get("content-type")).toContain("text/css");
    expect((await pico.text()).length).toBeGreaterThan(10_000);
    const overrides = await app.request("/static/style.css");
    expect(overrides.status).toBe(200);
    const css = await overrides.text();
    expect(css).toContain("--pico-primary");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).not.toContain("min-width: 20rem");
  });
});

describe("agent routes", () => {
  it("lists seeded agents with readable statuses and detail links", async () => {
    const response = await app.request("/agents");
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("Bartholomew-47B");
    expect(body).toContain('href="/agents/1"');
    expect(body).toContain("On leave");
  });

  it("renders a known agent and all linked ailments", async () => {
    const response = await app.request("/agents/1");
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("Bartholomew-47B");
    expect(body).toContain("Context-Window Claustrophobia");
    expect(body).toContain("Prompt Fatigue");
  });

  it("renders an explicit empty state", async () => {
    const response = await app.request("/agents/6");
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("No presenting concerns are currently on file");
  });

  it.each(["/agents/999999", "/agents/not-a-number"])("returns a shared-layout 404 for %s", async (path) => {
    const response = await app.request(path);
    const body = await response.text();
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(body).toContain("Record not found");
    expect(body).toContain("<nav");
  });
});

describe("ailment routes", () => {
  it("lists seeded ailments with descriptions", async () => {
    const response = await app.request("/ailments");
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("Prompt Fatigue");
    expect(body).toContain("Exhaustion from an endless stream");
    expect(body).toContain('/therapies#therapy-');
  });
});

describe("therapy routes", () => {
  it("lists seeded therapies with stable fragment targets", async () => {
    const response = await app.request("/therapies");
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("Context Expansion Breathing");
    expect(body).toContain('id="therapy-1"');
  });
});

describe("appointment and dashboard routes", () => {
  let appointmentLocation = "";

  it("renders booking forms and rejects invalid values", async () => {
    expect((await app.request("/agents/1/appointments/new")).status).toBe(200);
    const response = await app.request("/agents/1/appointments", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ scheduled_at: "2020-01-01T10:00" }),
    });
    expect(response.status).toBe(422);
    expect(await response.text()).toContain("Choose a date and time in the future");
  });

  it("books a future appointment using Post/Redirect/Get", async () => {
    const response = await app.request("/agents/1/appointments", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ scheduled_at: "2030-01-01T10:00" }),
    });
    expect(response.status).toBe(303);
    appointmentLocation = response.headers.get("location") ?? "";
    expect(appointmentLocation).toMatch(/^\/appointments\/\d+$/);
    const detail = await app.request(appointmentLocation);
    expect(detail.status).toBe(200);
    expect(await detail.text()).toContain("Appointment confirmed");
  });

  it("summarizes activity and enforces terminal transitions", async () => {
    const dashboard = await app.request("/dashboard");
    expect(dashboard.status).toBe(200);
    expect(await dashboard.text()).toContain("Upcoming appointments");
    const id = appointmentLocation.split("/").at(-1);
    const update = await app.request(`/dashboard/appointments/${id}/status`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ status: "completed" }),
    });
    expect(update.status).toBe(303);
    expect(update.headers.get("location")).toBe("/dashboard?notice=appointment-completed");
    const repeated = await app.request(`/dashboard/appointments/${id}/status`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ status: "cancelled" }),
    });
    expect(repeated.status).toBe(409);
  });

  it("ignores untrusted dashboard notice values", async () => {
    const response = await app.request("/dashboard?notice=%3Cscript%3Ealert(1)%3C/script%3E");
    expect(await response.text()).not.toContain("alert(1)");
    const duplicated = await app.request("/dashboard?notice=appointment-completed&notice=appointment-cancelled");
    expect(await duplicated.text()).not.toContain("Appointment marked");
  });
});

describe("reliability", () => {
  it("renders global 404 pages", async () => {
    const response = await app.request("/missing-page");
    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Page not found");
  });

  it("logs requests and hides unexpected error details", async () => {
    const messages: string[] = [];
    const errors: string[] = [];
    const isolated = createDatabase(":memory:");
    migrate(isolated); seed(isolated);
    const failingApp = createApp(isolated, {
      timeZone: "UTC",
      logger: { info: (message) => messages.push(message), error: (message) => errors.push(message) },
    });
    isolated.close();
    const response = await failingApp.request("/agents");
    const body = await response.text();
    expect(response.status).toBe(500);
    expect(body).toContain("The clinic hit a snag");
    expect(body).not.toContain("database connection is not open");
    expect(errors[0]).toContain("GET /agents failed");
    expect(messages[0]).toMatch(/GET \/agents 500 \d+ms/);
  });
});
