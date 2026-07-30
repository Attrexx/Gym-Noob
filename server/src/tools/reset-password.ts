import { loadEnv } from '../env.ts';
import { openDb } from '../db.ts';
import { hashPassword } from '../auth/password.ts';
import { revokeAllForUser } from '../auth/tokens.ts';

/**
 * Resetare de parolă rulată de PROPRIETAR pe server (până există resetare
 * prin email). Emailul vine ca argument; parola NOUĂ vine pe STDIN — nu ca
 * argument, ca să nu apară în `ps`/istoric.
 *
 *   echo 'parola-noua' | docker exec -i gymnoob-api \
 *     node dist/server/src/tools/reset-password.js user@exemplu.ro
 */
const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Folosire: reset-password <email>   (parola nouă pe stdin)');
  process.exit(2);
}

const bucati: Buffer[] = [];
for await (const chunk of process.stdin) bucati.push(chunk as Buffer);
const parola = Buffer.concat(bucati).toString('utf8').replace(/\r?\n$/, '');
if (parola.length < 8) {
  console.error('Parola trebuie să aibă minim 8 caractere.');
  process.exit(2);
}

const env = loadEnv();
const db = openDb(env.DB_PATH);
const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
if (!user) {
  console.error(`Nu există cont pentru ${email}.`);
  process.exit(1);
}

const { hash, salt, params } = await hashPassword(parola);
db.prepare('UPDATE users SET pass_hash = ?, pass_salt = ?, scrypt_params = ?, updated_at = ? WHERE id = ?').run(
  hash,
  salt,
  params,
  new Date().toISOString(),
  user.id,
);
revokeAllForUser(db, user.id);
db.close();
console.log(`Parolă resetată pentru ${email}; toate sesiunile au fost închise.`);
