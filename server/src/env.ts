/**
 * Configurația prin variabile de mediu, cu valori implicite sănătoase.
 * În producție (NODE_ENV=production) lipsa lui JWT_SECRET oprește pornirea —
 * mai bine un container care nu pornește decât tokenuri semnate cu 'dev'.
 */
export interface Env {
  PORT: number;
  DB_PATH: string;
  JWT_SECRET: string;
  CORS_ORIGINS: string[];
  QUOTA_BYTES: number;
  RATE_AUTH_PER_15MIN: number;
  RATE_SYNC_PER_MIN: number;
  RATE_REPLACE_PER_HOUR: number;
  ACCESS_TTL_SEC: number;
  REFRESH_TTL_DAYS: number;
  APP_VERSION: string;
  LOG_LEVEL: 'info' | 'silent';
}

const nr = (v: string | undefined, implicit: number): number => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : implicit;
};

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const productie = source.NODE_ENV === 'production';
  const secret = source.JWT_SECRET ?? '';
  if (productie && secret.length < 32) {
    throw new Error('JWT_SECRET lipsește sau e prea scurt (minim 32 de caractere) — refuz să pornesc în producție.');
  }
  return {
    PORT: nr(source.PORT, 8787),
    DB_PATH: source.DB_PATH ?? './gym.db',
    JWT_SECRET: secret || 'dev-secret-nu-folosi-in-productie',
    CORS_ORIGINS: (source.CORS_ORIGINS ?? 'https://attrexx.github.io,http://localhost:5173,http://localhost:4173')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    QUOTA_BYTES: nr(source.QUOTA_BYTES, 26_214_400), // 25 MB
    RATE_AUTH_PER_15MIN: nr(source.RATE_AUTH_PER_15MIN, 10),
    RATE_SYNC_PER_MIN: nr(source.RATE_SYNC_PER_MIN, 60),
    RATE_REPLACE_PER_HOUR: nr(source.RATE_REPLACE_PER_HOUR, 5),
    ACCESS_TTL_SEC: nr(source.ACCESS_TTL_SEC, 900),
    REFRESH_TTL_DAYS: nr(source.REFRESH_TTL_DAYS, 60),
    APP_VERSION: source.APP_VERSION ?? 'dev',
    LOG_LEVEL: source.LOG_LEVEL === 'silent' ? 'silent' : 'info',
  };
}
