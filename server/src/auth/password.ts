import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from 'node:crypto';

// promisify() pierde overload-ul cu opțiuni al lui scrypt — împachetăm manual
const scrypt = (parola: string, salt: Buffer, keyLen: number, opts: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) =>
    scryptCb(parola, salt, keyLen, opts, (err, key) => (err ? reject(err) : resolve(key))),
  );

/**
 * scrypt N=2^14, r=8, p=1 → ~16 MB pe hash. Containerul are 256 MB, deci
 * hash-urile concurente trec printr-un semafor cu 2 locuri: la orice trafic,
 * memoria de hashing rămâne ≤ ~32 MB (restul cererilor așteaptă la coadă).
 */
const PARAMS = { N: 16384, r: 8, p: 1 };
const KEY_LEN = 32;
const LOCURI = 2;

let ocupate = 0;
const coada: Array<() => void> = [];

async function cuSemafor<T>(fn: () => Promise<T>): Promise<T> {
  if (ocupate >= LOCURI) await new Promise<void>((r) => coada.push(r));
  ocupate++;
  try {
    return await fn();
  } finally {
    ocupate--;
    coada.shift()?.();
  }
}

export interface PasswordRecord {
  hash: Buffer;
  salt: Buffer;
  params: string; // JSON — pentru a putea crește costul în viitor fără re-hash forțat
}

export async function hashPassword(parola: string): Promise<PasswordRecord> {
  const salt = randomBytes(32);
  const hash = await cuSemafor(() => scrypt(parola, salt, KEY_LEN, PARAMS));
  return { hash, salt, params: JSON.stringify(PARAMS) };
}

export async function verifyPassword(
  parola: string,
  salt: Buffer,
  asteptat: Buffer,
  params: string,
): Promise<boolean> {
  const p = JSON.parse(params) as typeof PARAMS;
  const hash = await cuSemafor(() => scrypt(parola, salt, asteptat.length, p));
  return hash.length === asteptat.length && timingSafeEqual(hash, asteptat);
}
