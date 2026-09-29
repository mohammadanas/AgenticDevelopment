import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type Database from "better-sqlite3";

const defaultMigrationsDirectory = join(dirname(fileURLToPath(import.meta.url)), "migrations");

export const migrate = (database: Database.Database, migrationsDirectory = defaultMigrationsDirectory) => {
  database.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const applied = new Set(
    (database.prepare("SELECT name FROM migrations").all() as Array<{ name: string }>).map(({ name }) => name),
  );
  const applyMigration = database.transaction((name: string, sql: string) => {
    database.exec(sql);
    database.prepare("INSERT INTO migrations (name) VALUES (?)").run(name);
  });

  for (const file of readdirSync(migrationsDirectory).filter((name) => name.endsWith(".sql")).sort()) {
    if (!applied.has(file)) {
      applyMigration(file, readFileSync(join(migrationsDirectory, file), "utf8"));
    }
  }
};
