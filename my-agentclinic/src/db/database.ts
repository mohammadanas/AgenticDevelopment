import Database from "better-sqlite3";

export const createDatabase = (path = "agentclinic.db") => {
  const database = new Database(path);
  database.pragma("foreign_keys = ON");
  return database;
};
