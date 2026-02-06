import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dbPath = resolve('prisma/dev.db');
mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS Goal (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Signal (
  id TEXT PRIMARY KEY,
  goalId TEXT NOT NULL,
  title TEXT NOT NULL,
  weeklyTarget INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goalId) REFERENCES Goal(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Action (
  id TEXT PRIMARY KEY,
  signalId TEXT NOT NULL,
  happenedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  notes TEXT,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (signalId) REFERENCES Signal(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Person (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contextTag TEXT,
  lastTouchAt TEXT,
  nextStep TEXT,
  notes TEXT,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Touch (
  id TEXT PRIMARY KEY,
  personId TEXT NOT NULL,
  touchedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  summary TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (personId) REFERENCES Person(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WeeklyReview (
  id TEXT PRIMARY KEY,
  weekStart TEXT NOT NULL,
  wins TEXT,
  misses TEXT,
  commitments TEXT,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_signal_goalId ON Signal(goalId);
CREATE INDEX IF NOT EXISTS idx_action_signalId ON Action(signalId);
CREATE INDEX IF NOT EXISTS idx_touch_personId ON Touch(personId);
CREATE INDEX IF NOT EXISTS idx_person_lastTouchAt ON Person(lastTouchAt);
`);

console.log(`SQLite schema ensured at ${dbPath}`);
