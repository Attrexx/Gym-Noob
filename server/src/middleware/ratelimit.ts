import type { Context, Next } from 'hono';
import { AppError } from '../errors.ts';

/**
 * Fereastră glisantă în memorie (fără Redis — un singur proces, utilizatori
 * puțini). Cheia e IP-ul (doar Caddy poate ajunge la container, deci primul
 * X-Forwarded-For e de încredere) sau, după autentificare, id-ul userului.
 */
interface Bucket {
  timestamps: number[];
}

export function ipKey(c: Context): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}

export function rateLimiter(opts: { limit: number; windowMs: number; key?: (c: Context) => string }) {
  const buckets = new Map<string, Bucket>();
  let ultimaCuratare = Date.now();

  return async (c: Context, next: Next) => {
    const acum = Date.now();

    // măturăm gălețile moarte din când în când, să nu crească Map-ul la infinit
    if (acum - ultimaCuratare > opts.windowMs) {
      for (const [k, b] of buckets) {
        if (b.timestamps.every((t) => acum - t >= opts.windowMs)) buckets.delete(k);
      }
      ultimaCuratare = acum;
    }

    const cheie = (opts.key ?? ipKey)(c);
    const bucket = buckets.get(cheie) ?? { timestamps: [] };
    bucket.timestamps = bucket.timestamps.filter((t) => acum - t < opts.windowMs);

    if (bucket.timestamps.length >= opts.limit) {
      const retryMs = opts.windowMs - (acum - bucket.timestamps[0]);
      c.header('Retry-After', String(Math.max(1, Math.ceil(retryMs / 1000))));
      throw new AppError('RATE_LIMITED', 429, 'Prea multe cereri — ia o pauză scurtă (ca între seturi).');
    }

    bucket.timestamps.push(acum);
    buckets.set(cheie, bucket);
    await next();
  };
}
