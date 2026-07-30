import type { Hono } from 'hono';
import { loadEnv } from '../src/env.ts';
import { openDb } from '../src/db.ts';
import { createApp } from '../src/app.ts';
import type { AuthResponse } from '../../shared/wire.ts';

/** Aplicație de test: SQLite în memorie, limite de rată largi, logger tăcut. */
export function testApp(overrides: Record<string, string> = {}) {
  const env = loadEnv({
    NODE_ENV: 'test',
    DB_PATH: ':memory:',
    LOG_LEVEL: 'silent',
    RATE_AUTH_PER_15MIN: '1000',
    RATE_SYNC_PER_MIN: '1000',
    RATE_REPLACE_PER_HOUR: '1000',
    ...overrides,
  } as NodeJS.ProcessEnv);
  const db = openDb(env.DB_PATH);
  const app = createApp({ env, db });
  return { app, db, env };
}

type App = ReturnType<typeof testApp>['app'] extends Hono<infer E> ? Hono<E> : never;

export function post(body: unknown, accessToken?: string): RequestInit {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  };
}

export const get = (accessToken: string): RequestInit => ({
  headers: { authorization: `Bearer ${accessToken}` },
});

export async function inregistrare(app: App, email = 'testel@exemplu.ro', parola = 'parola123'): Promise<AuthResponse> {
  const res = await app.request('/auth/register', post({ email, parola }));
  if (res.status !== 201) throw new Error(`register a eșuat: ${res.status} ${await res.text()}`);
  return (await res.json()) as AuthResponse;
}

/** Un rând de sârmă minimal — serverul nu validează schema payload-ului. */
export function rand(tabel: string, uid: string, updatedAt: string, payload: Record<string, unknown> = {}) {
  return { tabel, uid, payload: { uid, ...payload }, updatedAt };
}
