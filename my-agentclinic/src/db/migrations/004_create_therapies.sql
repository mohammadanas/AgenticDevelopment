CREATE TABLE therapies (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
  description TEXT NOT NULL CHECK (length(trim(description)) > 0)
);

CREATE TABLE ailment_therapies (
  ailment_id INTEGER NOT NULL REFERENCES ailments(id) ON DELETE CASCADE,
  therapy_id INTEGER NOT NULL REFERENCES therapies(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL CHECK (display_order > 0),
  PRIMARY KEY (ailment_id, therapy_id),
  UNIQUE (ailment_id, display_order)
);

CREATE INDEX idx_ailment_therapies_therapy ON ailment_therapies (therapy_id, ailment_id);
