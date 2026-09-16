CREATE TABLE IF NOT EXISTS trip_checkins (
  id TEXT NOT NULL,
  trip_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (trip_id, id)
);

CREATE TABLE IF NOT EXISTS trip_attachments (
  id TEXT NOT NULL,
  trip_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (trip_id, id)
);

CREATE INDEX IF NOT EXISTS idx_trip_checkins_trip ON trip_checkins(trip_id, created_at);
CREATE INDEX IF NOT EXISTS idx_trip_attachments_trip ON trip_attachments(trip_id, created_at);
