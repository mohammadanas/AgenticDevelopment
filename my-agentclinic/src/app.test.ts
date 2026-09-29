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
  app = createApp(database);
});

afterAll(() => database.close());

describe("shared application routes", () => {
  it("preserves the home and health contracts", async () => {
    const home = await app.request("/");
    const body = await home.text();
    expect(home.status).toBe(200);
    expect(body).toMatch(/^<!doctype html>/i);
    expect(body).toContain("AgentClinic is open");
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
    expect(await overrides.text()).toContain("--pico-primary");
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
  });
});
