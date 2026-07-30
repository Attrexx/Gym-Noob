import { db } from './db';
import { normalizeazaBaza } from './normalize';

/**
 * Tabelele incluse în backup. `deletions` și `syncState` NU intră:
 * sunt stare locală de sincronizare (jurnalul de ștergeri netrimise și
 * tokenurile de cont), nu date ale utilizatorului — și nu se șterg la import.
 */
const TABLES = [
  'profiles',
  'bodyMetrics',
  'goals',
  'templates',
  'sessions',
  'setLogs',
  'waterLogs',
  'achievements',
  'settings',
] as const;

/** Versiunile de fișier pe care știm să le citim. v2 = rânduri cu uid-uri. */
const VERSIUNI_ACCEPTATE = [1, 2];

export interface BackupFile {
  app: 'gym-noob';
  versiune: number;
  exportatLa: string;
  date: Record<string, unknown[]>;
}

/** Exportă toată baza de date într-un JSON descărcabil. */
export async function exportBackup(): Promise<BackupFile> {
  const date: Record<string, unknown[]> = {};
  for (const t of TABLES) {
    date[t] = await db.table(t).toArray();
  }
  return { app: 'gym-noob', versiune: 2, exportatLa: new Date().toISOString(), date };
}

export function downloadBackup(backup: BackupFile) {
  const blob = new Blob([JSON.stringify(backup, null, 1)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gym-noob-backup-${backup.exportatLa.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Importă un backup — ÎNLOCUIEȘTE complet datele existente.
 * Aruncă eroare dacă fișierul nu arată a backup Gym Noob.
 *
 * Fișierele v1 (fără uid-uri) primesc uid-uri și oglinzi de chei străine la
 * import (aceeași logică cu upgrade-ul de schemă); orice import lasă toate
 * rândurile `dirty`, ca o eventuală sincronizare să repornească de la zero.
 */
export async function importBackup(raw: string): Promise<void> {
  let parsed: BackupFile;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Fișierul nu este un JSON valid.');
  }
  if (parsed.app !== 'gym-noob' || !parsed.date) {
    throw new Error('Fișierul nu este un backup Gym Noob.');
  }
  const versiune = parsed.versiune ?? 1;
  if (!VERSIUNI_ACCEPTATE.includes(versiune)) {
    throw new Error(`Backup făcut cu o versiune mai nouă a aplicației (v${versiune}). Actualizează aplicația întâi.`);
  }
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async (tx) => {
    for (const t of TABLES) {
      await db.table(t).clear();
      const rows = parsed.date[t];
      if (Array.isArray(rows) && rows.length) await db.table(t).bulkAdd(rows as never[]);
    }
    await normalizeazaBaza(tx);
  });
}
