-- BootLabs D1 Schema — Whitepaper Leads
-- Run once: wrangler d1 execute bootlabs-leads --file=./db/schema.sql

CREATE TABLE IF NOT EXISTS whitepaper_leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  company     TEXT    NOT NULL,
  phone       TEXT,
  interest    TEXT,
  whitepaper  TEXT,
  ip          TEXT,
  created_at  DATETIME DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_email      ON whitepaper_leads(email);
CREATE INDEX IF NOT EXISTS idx_created_at ON whitepaper_leads(created_at);
