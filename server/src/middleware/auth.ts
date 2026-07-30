import type { Context, Next } from 'hono';
import { AppError } from '../errors.ts';
import { verifyAccessToken } from '../auth/tokens.ts';
import type { Env } from '../env.ts';

/** Variabilele puse de middleware-uri pe context (c.get/c.set). */
export interface AppVars {
  userId: number;
}

export function bearerAuth(env: Env) {
  return async (c: Context<{ Variables: AppVars }>, next: Next) => {
    const antet = c.req.header('authorization');
    if (!antet?.startsWith('Bearer ')) {
      throw new AppError('BAD_CREDENTIALS', 401, 'Lipsește tokenul de acces.');
    }
    c.set('userId', await verifyAccessToken(env, antet.slice(7)));
    await next();
  };
}
