import { Hono } from 'hono';
import type { DatabaseSync } from 'node:sqlite';
import type { AuthResponse, MeResponse, TokenPair } from '../../../shared/wire.ts';
import { AppError, validare } from '../errors.ts';
import type { Env } from '../env.ts';
import { bearerAuth, type AppVars } from '../middleware/auth.ts';
import { hashPassword, verifyPassword } from './password.ts';
import { issueAccessToken, issueRefreshToken, revokeAllForUser, revokeFamily, rotateRefreshToken } from './tokens.ts';

interface DbUser {
  id: number;
  email: string;
  pass_hash: Uint8Array;
  pass_salt: Uint8Array;
  scrypt_params: string;
  profile_uid: string | null;
  used_bytes: number;
  quota_bytes: number;
  created_at: string;
}

function parseCredentiale(body: unknown): { email: string; parola: string } {
  const b = body as Record<string, unknown>;
  const email = typeof b?.email === 'string' ? b.email.trim().toLowerCase() : '';
  const parola = typeof b?.parola === 'string' ? b.parola : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw validare('Adresa de email nu arată a email.');
  }
  if (parola.length < 8 || parola.length > 200) {
    throw validare('Parola trebuie să aibă minim 8 caractere.');
  }
  return { email, parola };
}

async function raspunsAuth(db: DatabaseSync, env: Env, user: Pick<DbUser, 'id' | 'email' | 'created_at'>): Promise<AuthResponse> {
  return {
    accessToken: await issueAccessToken(env, user.id),
    refreshToken: issueRefreshToken(db, env, user.id),
    user: { id: user.id, email: user.email, createdAt: user.created_at },
  };
}

export function authRoutes(db: DatabaseSync, env: Env) {
  const app = new Hono<{ Variables: AppVars }>();
  const userByEmail = () => db.prepare(
    'SELECT id, email, pass_hash, pass_salt, scrypt_params, created_at FROM users WHERE email = ?',
  );

  app.post('/register', async (c) => {
    const { email, parola } = parseCredentiale(await c.req.json().catch(() => ({})));
    const { hash, salt, params } = await hashPassword(parola);
    const acum = new Date().toISOString();
    let id: number;
    try {
      id = Number(
        db
          .prepare(
            'INSERT INTO users (email, pass_hash, pass_salt, scrypt_params, quota_bytes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          )
          .run(email, hash, salt, params, env.QUOTA_BYTES, acum, acum).lastInsertRowid,
      );
    } catch (e) {
      if (e instanceof Error && e.message.includes('UNIQUE')) {
        throw new AppError('EMAIL_TAKEN', 409, 'Există deja un cont cu emailul ăsta — încearcă „Am deja cont".');
      }
      throw e;
    }
    return c.json(await raspunsAuth(db, env, { id, email, created_at: acum }), 201);
  });

  app.post('/login', async (c) => {
    const { email, parola } = parseCredentiale(await c.req.json().catch(() => ({})));
    const user = userByEmail().get(email) as DbUser | undefined;
    const ok = user && (await verifyPassword(parola, Buffer.from(user.pass_salt), Buffer.from(user.pass_hash), user.scrypt_params));
    if (!ok) throw new AppError('BAD_CREDENTIALS', 401, 'Email sau parolă greșite.');
    return c.json(await raspunsAuth(db, env, user), 200);
  });

  app.post('/refresh', async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { refreshToken?: unknown };
    if (typeof body.refreshToken !== 'string' || !body.refreshToken) throw validare('Lipsește refreshToken.');
    const { userId, refreshToken } = rotateRefreshToken(db, env, body.refreshToken);
    const raspuns: TokenPair = { accessToken: await issueAccessToken(env, userId), refreshToken };
    return c.json(raspuns, 200);
  });

  app.post('/logout', async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { refreshToken?: unknown };
    if (typeof body.refreshToken === 'string') revokeFamily(db, body.refreshToken);
    return c.body(null, 204);
  });

  app.get('/me', bearerAuth(env), (c) => {
    const user = db
      .prepare('SELECT id, email, created_at, profile_uid, used_bytes, quota_bytes FROM users WHERE id = ?')
      .get(c.get('userId')) as DbUser | undefined;
    if (!user) throw new AppError('NOT_FOUND', 404, 'Contul nu mai există.');
    const raspuns: MeResponse = {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
      profileUid: user.profile_uid,
      usedBytes: user.used_bytes,
      quotaBytes: user.quota_bytes,
    };
    return c.json(raspuns, 200);
  });

  app.delete('/account', bearerAuth(env), async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { parola?: unknown };
    const user = db
      .prepare('SELECT id, email, pass_hash, pass_salt, scrypt_params, created_at FROM users WHERE id = ?')
      .get(c.get('userId')) as DbUser | undefined;
    if (!user) throw new AppError('NOT_FOUND', 404, 'Contul nu mai există.');
    const ok =
      typeof body.parola === 'string' &&
      (await verifyPassword(body.parola, Buffer.from(user.pass_salt), Buffer.from(user.pass_hash), user.scrypt_params));
    if (!ok) throw new AppError('BAD_CREDENTIALS', 401, 'Parola nu e corectă.');
    revokeAllForUser(db, user.id);
    db.prepare('DELETE FROM users WHERE id = ?').run(user.id); // CASCADE: tokens + rows
    return c.body(null, 204);
  });

  return app;
}
