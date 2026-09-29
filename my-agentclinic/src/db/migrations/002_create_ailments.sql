CREATE TABLE ailments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL CHECK (length(trim(description)) > 0)
);
