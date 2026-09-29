CREATE TABLE agents (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  model_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'on_leave', 'discharged')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
