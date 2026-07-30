import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import type { DatabaseSync } from 'node:sqlite';
import type { ApiError, HealthResponse } from '../../shared/wire.ts';
import { AppError } from './errors.ts';
import type { Env } from './env.ts';
import { authRoutes } from './auth/routes.ts';
import { syncRoutes } from './sync/routes.ts';
import { rateLimiter } from './middleware/ratelimit.ts';
import type { AppVars } from './middleware/auth.ts';

const MB = 1024 * 1024;

/**
 * Asamblarea aplicației. Ordinea middleware: logger → CORS → limite de corp
 * (mici la auth, mari la sync) → rate limit pe IP la /auth → rute.
 * Limitele per-utilizator la /sync stau în syncRoutes, DUPĂ autentificare.
 */
export function createApp(deps: { env: Env; db: DatabaseSync }) {
  const { env, db } = deps;
  const pornit = Date.now();
  const app = new Hono<{ Variables: AppVars }>();

  app.onError((err, c) => {
    if (err instanceof AppError) {
      const corp: ApiError = { error: { code: err.code, mesaj: err.message } };
      return c.json(corp, err.status as 400);
    }
    if (env.LOG_LEVEL !== 'silent') console.error('EROARE NEPRINSĂ:', err);
    const corp: ApiError = { error: { code: 'SERVER_ERROR', mesaj: 'Ceva a mers prost pe server.' } };
    return c.json(corp, 500);
  });
  app.notFound((c) => {
    const corp: ApiError = { error: { code: 'NOT_FOUND', mesaj: 'Ruta nu există.' } };
    return c.json(corp, 404);
  });

  if (env.LOG_LEVEL !== 'silent') {
    app.use('*', async (c, next) => {
      const t0 = Date.now();
      await next();
      console.log(`${c.req.method} ${c.req.path} → ${c.res.status} (${Date.now() - t0}ms)`);
    });
  }

  app.use(
    '*',
    cors({
      origin: env.CORS_ORIGINS,
      allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86_400,
    }),
  );

  app.use('/auth/*', bodyLimit({ maxSize: 64 * 1024 }));
  app.use('/sync', bodyLimit({ maxSize: 10 * MB }));
  app.use('/sync/replace', bodyLimit({ maxSize: 30 * MB }));
  app.use('/auth/*', rateLimiter({ limit: env.RATE_AUTH_PER_15MIN, windowMs: 15 * 60_000 }));

  app.get('/health', (c) => {
    const raspuns: HealthResponse = {
      ok: true,
      version: env.APP_VERSION,
      uptimeSec: Math.round((Date.now() - pornit) / 1000),
    };
    return c.json(raspuns, 200);
  });

  app.route('/auth', authRoutes(db, env));
  app.route('/sync', syncRoutes(db, env));

  return app;
}
