import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";

import { createDatabase } from "./database";
import { migrate } from "./migrate";
import { createRepository } from "./repository";
import { seed } from "./seed";

const openDatabases: Database.Database[] = [];

const freshDatabase = () => {
  const database = createDatabase(":memory:");
  openDatabases.push(database);
  migrate(database);
  return database;
};

afterEach(() => openDatabases.splice(0).forEach((database) => database.close()));

describe("migrations", () => {
  it("creates expected tables and runs repeatedly", () => {
    const database = freshDatabase();
    expect(() => migrate(database)).not.toThrow();
    const tables = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as Array<{ name: string }>;
    expect(tables.map(({ name }) => name)).toEqual(expect.arrayContaining(["migrations", "agents", "ailments", "agent_ailments", "therapies", "ailment_therapies", "appointments"]));
    expect((database.prepare("SELECT COUNT(*) AS count FROM migrations").get() as { count: number }).count).toBe(5);
  });

  it("enforces foreign keys and unique relationships", () => {
    const database = freshDatabase();
    seed(database);
    expect(database.pragma("foreign_keys", { simple: true })).toBe(1);
    expect(() => database.prepare("INSERT INTO agent_ailments VALUES (?, ?)").run(999, 1)).toThrow();
    expect(() => database.prepare("INSERT INTO agent_ailments VALUES (?, ?)").run(1, 1)).toThrow();
    expect(() => database.prepare("INSERT INTO ailment_therapies VALUES (?, ?, ?)").run(999, 1, 1)).toThrow();
    expect(() => database.prepare("INSERT INTO appointments (agent_id, scheduled_at, status) VALUES (?, ?, ?)").run(1, "2030-01-01T10:00:00+00:00", "unknown")).toThrow();
  });

  it("rolls back a failed migration without recording it", () => {
    const directory = mkdtempSync(join(tmpdir(), "agentclinic-migrations-"));
    writeFileSync(join(directory, "001_invalid.sql"), "CREATE TABLE rolled_back (id INTEGER); INVALID SQL;");
    const database = createDatabase(":memory:");
    openDatabases.push(database);
    expect(() => migrate(database, directory)).toThrow();
    expect(database.prepare("SELECT name FROM sqlite_master WHERE name = 'rolled_back'").get()).toBeUndefined();
    expect(database.prepare("SELECT name FROM migrations WHERE name = '001_invalid.sql'").get()).toBeUndefined();
  });
});

describe("seed and repository", () => {
  it("seeds deterministic records idempotently", () => {
    const database = freshDatabase();
    seed(database);
    seed(database);
    expect((database.prepare("SELECT COUNT(*) AS count FROM agents").get() as { count: number }).count).toBe(6);
    expect((database.prepare("SELECT COUNT(*) AS count FROM ailments").get() as { count: number }).count).toBe(6);
    expect((database.prepare("SELECT COUNT(*) AS count FROM agent_ailments").get() as { count: number }).count).toBe(6);
    expect((database.prepare("SELECT COUNT(*) AS count FROM therapies").get() as { count: number }).count).toBe(6);
    expect((database.prepare("SELECT COUNT(*) AS count FROM ailment_therapies").get() as { count: number }).count).toBe(9);
  });

  it("returns ordered lists, joined details, empty relationships, and missing records", () => {
    const database = freshDatabase();
    seed(database);
    const repository = createRepository(database);
    expect(repository.listAgents()[0].name).toBe("Agatha-nano");
    expect(repository.listAilments()[0].name).toBe("Context-Window Claustrophobia");
    expect(repository.findAgent(1)?.ailments).toHaveLength(2);
    expect(repository.findAgent(6)?.ailments).toEqual([]);
    expect(repository.findAgent(999999)).toBeUndefined();
    expect(repository.listTherapies()).toHaveLength(6);
    expect(repository.listAilments()[0].therapies?.map(({ id }) => id)).toEqual([1, 2]);
  });

  it("creates appointments, calculates dashboard data, and protects terminal states", () => {
    const database = freshDatabase();
    seed(database);
    const repository = createRepository(database);
    const id = repository.createAppointment(1, "2030-01-01T10:00:00+00:00");
    expect(repository.findAppointment(id)?.agent_name).toBe("Bartholomew-47B");
    const dashboard = repository.getDashboard("2029-01-01T00:00:00.000Z");
    expect(dashboard.agentCount).toBe(6);
    expect(dashboard.activeAilmentCount).toBe(4);
    expect(dashboard.upcomingCount).toBe(1);
    expect(repository.transitionAppointment(id, "completed")).toBe("updated");
    expect(repository.transitionAppointment(id, "cancelled")).toBe("terminal");
    expect(repository.transitionAppointment(999999, "completed")).toBe("missing");
  });
});
