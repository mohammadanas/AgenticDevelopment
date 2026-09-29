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
    expect(tables.map(({ name }) => name)).toEqual(expect.arrayContaining(["migrations", "agents", "ailments", "agent_ailments"]));
    expect((database.prepare("SELECT COUNT(*) AS count FROM migrations").get() as { count: number }).count).toBe(3);
  });

  it("enforces foreign keys and unique relationships", () => {
    const database = freshDatabase();
    seed(database);
    expect(database.pragma("foreign_keys", { simple: true })).toBe(1);
    expect(() => database.prepare("INSERT INTO agent_ailments VALUES (?, ?)").run(999, 1)).toThrow();
    expect(() => database.prepare("INSERT INTO agent_ailments VALUES (?, ?)").run(1, 1)).toThrow();
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
  });
});
