import { db } from './db';

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
  return { app: 'gym-noob', versiune: 1, exportatLa: new Date().toISOString(), date };
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
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) {
      await db.table(t).clear();
      const rows = parsed.date[t];
      if (Array.isArray(rows) && rows.length) await db.table(t).bulkAdd(rows as never[]);
    }
  });
}
