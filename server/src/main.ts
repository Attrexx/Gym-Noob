import { serve } from '@hono/node-server';
import { loadEnv } from './env.ts';
import { openDb } from './db.ts';
import { createApp } from './app.ts';

const env = loadEnv();
const db = openDb(env.DB_PATH);
const app = createApp({ env, db });

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`gym-noob-api ${env.APP_VERSION} ascultă pe :${info.port} (db: ${env.DB_PATH})`);
});

let opresc = false;
function opreste(semnal: string) {
  if (opresc) return;
  opresc = true;
  console.log(`${semnal} primit — închid frumos.`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
  // dacă cineva ține conexiunea deschisă, nu așteptăm la nesfârșit
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', () => opreste('SIGTERM'));
process.on('SIGINT', () => opreste('SIGINT'));
