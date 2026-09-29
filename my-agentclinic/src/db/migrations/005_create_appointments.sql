CREATE TABLE appointments (
  id INTEGER PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
  scheduled_at TEXT NOT NULL CHECK (scheduled_at GLOB '????-??-??T??:??:??[+-]??:??'),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_status_scheduled ON appointments (status, scheduled_at, id);
CREATE INDEX idx_appointments_created ON appointments (created_at DESC, id DESC);
