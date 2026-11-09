CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  conversation_id TEXT,
  page_path TEXT,
  source TEXT,
  language TEXT,
  topic TEXT,
  intent TEXT,
  outcome TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_type_created ON analytics_events(event_type,created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_conversation ON analytics_events(conversation_id);
