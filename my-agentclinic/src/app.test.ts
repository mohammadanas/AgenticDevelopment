import { describe, expect, it } from "vitest";

import { app } from "./app";

describe("AgentClinic routes", () => {
  it("renders the home page through the shared layout", async () => {
    const response = await app.request("/");
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(body).toMatch(/^<!doctype html>/i);
    expect(body).toContain('<html lang="en">');
    expect(body).toContain('<meta charset="UTF-8"/>');
    expect(body).toContain('name="viewport"');
    expect(body).toContain("<title>AgentClinic</title>");
    expect(body).toContain(
      '<link rel="stylesheet" href="/static/style.css"/>',
    );
    expect(body.match(/<header/g)).toHaveLength(1);
    expect(body.match(/<main/g)).toHaveLength(1);
    expect(body.match(/<footer/g)).toHaveLength(1);
    expect(body).toContain("<h1>AgentClinic</h1>");
    expect(body).toContain("AgentClinic is open");
  });

  it("serves the linked stylesheet", async () => {
    const response = await app.request("/static/style.css");
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/css");
    expect(body.trim()).not.toBe("");
    expect(body).toContain("width: min(100% - 2rem, 60rem)");
    expect(body).toContain("overflow-wrap: anywhere");
    expect(body).toContain("@media (min-width: 48rem)");
  });

  it("reports application health", async () => {
    const response = await app.request("/health");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });
});
