import { Hono } from 'hono';
import type { DatabaseSync } from 'node:sqlite';
import {
  TABELE_SINCRONIZATE,
  type SnapshotResponse,
  type SyncResponse,
  type WireDeletion,
  type WireRow,
} from '../../../shared/wire.ts';
import { validare } from '../errors.ts';
import type { Env } from '../env.ts';
import { bearerAuth, type AppVars } from '../middleware/auth.ts';
import { rateLimiter } from '../middleware/ratelimit.ts';
import { applyPush, replaceAll, snapshot } from './store.ts';

const TABELE = new Set<string>(TABELE_SINCRONIZATE);
const MAX_SCHIMBARI_PER_PUSH = 10_000;
const MAX_RANDURI_REPLACE = 100_000;

function parseWireRow(r: unknown, i: number): WireRow {
  const row = r as Record<string, unknown>;
  if (typeof row?.tabel !== 'string' || !TABELE.has(row.tabel)) throw validare(`upserts[${i}]: tabel necunoscut.`);
  if (typeof row.uid !== 'string' || !row.uid || row.uid.length > 200) throw validare(`upserts[${i}]: uid invalid.`);
  if (typeof row.payload !== 'object' || row.payload === null || Array.isArray(row.payload)) {
    throw validare(`upserts[${i}]: payload trebuie să fie obiect.`);
  }
  if (typeof row.updatedAt !== 'string') throw validare(`upserts[${i}]: updatedAt lipsește.`);
  return row as unknown as WireRow;
}

function parseDeletion(d: unknown, i: number): WireDeletion {
  const del = d as Record<string, unknown>;
  if (typeof del?.tabel !== 'string' || !TABELE.has(del.tabel)) throw validare(`deletions[${i}]: tabel necunoscut.`);
  if (typeof del.uid !== 'string' || !del.uid || del.uid.length > 200) throw validare(`deletions[${i}]: uid invalid.`);
  if (typeof del.deletedAt !== 'string') throw validare(`deletions[${i}]: deletedAt lipsește.`);
  return del as unknown as WireDeletion;
}

export function syncRoutes(db: DatabaseSync, env: Env) {
  const app = new Hono<{ Variables: AppVars }>();
  const perUser = (c: { get: (k: 'userId') => number }) => `user:${c.get('userId')}`;

  app.use('*', bearerAuth(env));
  app.use('/replace', rateLimiter({ limit: env.RATE_REPLACE_PER_HOUR, windowMs: 3_600_000, key: perUser }));
  app.use('*', rateLimiter({ limit: env.RATE_SYNC_PER_MIN, windowMs: 60_000, key: perUser }));

  app.post('/', async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    if (typeof body.profileUid !== 'string' || !body.profileUid) throw validare('profileUid lipsește.');
    const cursor = typeof body.cursor === 'number' && body.cursor >= 0 ? body.cursor : 0;
    const changes = (body.changes ?? {}) as Record<string, unknown>;
    const rawUpserts = Array.isArray(changes.upserts) ? changes.upserts : [];
    const rawDeletions = Array.isArray(changes.deletions) ? changes.deletions : [];
    if (rawUpserts.length + rawDeletions.length > MAX_SCHIMBARI_PER_PUSH) {
      throw validare(`Prea multe schimbări într-un push (max ${MAX_SCHIMBARI_PER_PUSH}).`);
    }
    const upserts = rawUpserts.map(parseWireRow);
    const deletions = rawDeletions.map(parseDeletion);

    const rezultat: SyncResponse = applyPush(db, c.get('userId'), body.profileUid, cursor, upserts, deletions);
    return c.json(rezultat, 200);
  });

  app.get('/snapshot', (c) => {
    const raspuns: SnapshotResponse = snapshot(db, c.get('userId'));
    return c.json(raspuns, 200);
  });

  app.post('/replace', async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    if (typeof body.profileUid !== 'string' || !body.profileUid) throw validare('profileUid lipsește.');
    const rawRows = Array.isArray(body.rows) ? body.rows : [];
    if (rawRows.length > MAX_RANDURI_REPLACE) throw validare('Prea multe rânduri.');
    const rows = rawRows.map(parseWireRow);
    return c.json(replaceAll(db, c.get('userId'), body.profileUid, rows), 200);
  });

  return app;
}
