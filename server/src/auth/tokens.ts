import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import { sign, verify } from 'hono/jwt';
import { AppError } from '../errors.ts';
import type { Env } from '../env.ts';

/**
 * Access token = JWT HS256 scurt (15 min), fără stare pe server.
 * Refresh token = 32 de octeți aleatori, OPAC, păstrat doar ca sha256 în DB,
 * cu rotire la fiecare folosire. Prezentarea unui token DEJA consumat
 * înseamnă furt (sau client defect) → se revocă întreaga familie.
 */

export async function issueAccessToken(env: Env, userId: number): Promise<string> {
  const acum = Math.floor(Date.now() / 1000);
  return sign({ sub: String(userId), iat: acum, exp: acum + env.ACCESS_TTL_SEC }, env.JWT_SECRET, 'HS256');
}

export async function verifyAccessToken(env: Env, token: string): Promise<number> {
  try {
    const claims = await verify(token, env.JWT_SECRET, 'HS256');
    const id = Number(claims.sub);
    if (!Number.isInteger(id) || id <= 0) throw new Error('sub invalid');
    return id;
  } catch (e) {
    const expirat = e instanceof Error && e.name === 'JwtTokenExpired';
    throw new AppError(expirat ? 'TOKEN_EXPIRED' : 'BAD_CREDENTIALS', 401, 'Token invalid sau expirat.');
  }
}

const sha256 = (t: string) => createHash('sha256').update(t).digest();

function insertRefresh(db: DatabaseSync, env: Env, userId: number, family: string): string {
  const token = randomBytes(32).toString('base64url');
  const expira = new Date(Date.now() + env.REFRESH_TTL_DAYS * 86_400_000).toISOString();
  db.prepare(
    'INSERT INTO refresh_tokens (user_id, token_hash, family, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(userId, sha256(token), family, expira, new Date().toISOString());
  return token;
}

/** La login/înregistrare: pornește o familie nouă de refresh-uri. */
export function issueRefreshToken(db: DatabaseSync, env: Env, userId: number): string {
  return insertRefresh(db, env, userId, randomUUID());
}

interface RefreshRow {
  id: number;
  user_id: number;
  family: string;
  expires_at: string;
  consumed_at: string | null;
  revoked_at: string | null;
}

/**
 * Rotire: consumă tokenul prezentat și emite unul nou din aceeași familie.
 * Reuse (token deja consumat) → revocă familia întreagă și refuză.
 */
export function rotateRefreshToken(
  db: DatabaseSync,
  env: Env,
  token: string,
): { userId: number; refreshToken: string } {
  const rand = db
    .prepare('SELECT id, user_id, family, expires_at, consumed_at, revoked_at FROM refresh_tokens WHERE token_hash = ?')
    .get(sha256(token)) as RefreshRow | undefined;
  const acum = new Date().toISOString();

  if (!rand || rand.revoked_at || rand.expires_at < acum) {
    throw new AppError('INVALID_REFRESH', 401, 'Sesiunea a expirat — intră din nou în cont.');
  }
  if (rand.consumed_at) {
    db.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE family = ? AND revoked_at IS NULL').run(acum, rand.family);
    throw new AppError('INVALID_REFRESH', 401, 'Sesiunea a fost invalidată — intră din nou în cont.');
  }

  db.prepare('UPDATE refresh_tokens SET consumed_at = ? WHERE id = ?').run(acum, rand.id);
  return { userId: rand.user_id, refreshToken: insertRefresh(db, env, rand.user_id, rand.family) };
}

/** Logout: stinge familia tokenului prezentat (dacă există — logout e mereu „ok"). */
export function revokeFamily(db: DatabaseSync, token: string): void {
  const rand = db.prepare('SELECT family FROM refresh_tokens WHERE token_hash = ?').get(sha256(token)) as
    | { family: string }
    | undefined;
  if (rand) {
    db.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE family = ? AND revoked_at IS NULL').run(
      new Date().toISOString(),
      rand.family,
    );
  }
}

/** Schimbare de parolă / ștergere cont: totul afară. */
export function revokeAllForUser(db: DatabaseSync, userId: number): void {
  db.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL').run(
    new Date().toISOString(),
    userId,
  );
}
