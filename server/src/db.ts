import { createRequire } from 'node:module';
import type { DatabaseSync } from 'node:sqlite';

// Încărcat la runtime prin createRequire: vite-ul din vitest 2 nu are încă
// node:sqlite pe lista de builtins și ar încerca să-l rezolve ca fișier.
const { DatabaseSync: Sqlite } = createRequire(import.meta.url)('node:sqlite') as typeof import('node:sqlite');

/**
 * O singură bază SQLite (WAL). Stocarea e un „row store" generic:
 * serverul nu cunoaște schema aplicației — doar (user, tabel, uid) →
 * payload JSON + updated_at + seq. Schema clientului poate evolua fără
 * migrări pe server.
 *
 * `seq` e monoton PER UTILIZATOR (users.last_seq) — cursorul de pull al
 * clienților. Tombstone = deleted=1, payload NULL, size 0.
 */
const SCHEMA_VERSION = 1;

const DDL = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  pass_hash BLOB NOT NULL,
  pass_salt BLOB NOT NULL,
  scrypt_params TEXT NOT NULL,
  profile_uid TEXT,
  last_seq INTEGER NOT NULL DEFAULT 0,
  used_bytes INTEGER NOT NULL DEFAULT 0,
  quota_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE refresh_tokens (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash BLOB NOT NULL UNIQUE,
  family TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  consumed_at TEXT,
  revoked_at TEXT
);
CREATE INDEX idx_rt_user ON refresh_tokens(user_id);
CREATE TABLE rows (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tabel TEXT NOT NULL,
  uid TEXT NOT NULL,
  payload TEXT,
  updated_at TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  size INTEGER NOT NULL DEFAULT 0,
  seq INTEGER NOT NULL,
  PRIMARY KEY (user_id, tabel, uid)
) WITHOUT ROWID;
CREATE INDEX idx_rows_user_seq ON rows(user_id, seq);
`;

export function openDb(path: string): DatabaseSync {
  const db = new Sqlite(path);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 5000');
  db.exec('PRAGMA synchronous = NORMAL');
  db.exec('PRAGMA foreign_keys = ON');

  const { user_version } = db.prepare('PRAGMA user_version').get() as { user_version: number };
  if (user_version < SCHEMA_VERSION) {
    // migrator forward-only; deocamdată există doar versiunea 1
    if (user_version === 0) db.exec(DDL);
    db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  }
  return db;
}

/** Tranzacție sincronă — node:sqlite nu are helper propriu. */
export function inTx<T>(db: DatabaseSync, fn: () => T): T {
  db.exec('BEGIN IMMEDIATE');
  try {
    const rezultat = fn();
    db.exec('COMMIT');
    return rezultat;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}
