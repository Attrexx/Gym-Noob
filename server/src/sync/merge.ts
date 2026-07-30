/**
 * Regulile de îmbinare last-write-wins — funcții PURE, testate izolat.
 *
 * Toate timestampurile se normalizează la formatul fix `toISOString()`
 * (24 de caractere, UTC) ÎNAINTE de orice comparație: pe formatul ăsta,
 * compararea lexicografică de stringuri e identică cu cea cronologică.
 */

/** Cât de departe în viitor acceptăm ceasul unui client. */
export const CLOCK_SLACK_MS = 5 * 60 * 1000;

/**
 * Normalizează + limitează: un timestamp invalid devine `serverNow`; unul
 * din viitorul îndepărtat e tras înapoi la `serverNow + 5 min`, ca un telefon
 * cu ceasul greșit să nu producă rânduri „de neînvins".
 */
export function clampTimestamp(ts: unknown, serverNowMs: number): string {
  const ms = typeof ts === 'string' ? Date.parse(ts) : NaN;
  if (!Number.isFinite(ms)) return new Date(serverNowMs).toISOString();
  return new Date(Math.min(ms, serverNowMs + CLOCK_SLACK_MS)).toISOString();
}

/** Upsert: STRICT mai nou câștigă; egalitate → rămâne ce există (serverul). */
export function acceptaUpsert(existingUpdatedAt: string | undefined, incomingUpdatedAt: string): boolean {
  return existingUpdatedAt === undefined || incomingUpdatedAt > existingUpdatedAt;
}

/**
 * Ștergere: egalitate → câștigă ștergerea. Peste un rând mai NOU pierde —
 * „șters pe A, dar editat mai târziu pe B" păstrează editarea (înviere
 * legitimă, upsert-ul ulterior trece peste tombstone).
 */
export function acceptaDeletion(existingUpdatedAt: string | undefined, deletedAt: string): boolean {
  return existingUpdatedAt === undefined || deletedAt >= existingUpdatedAt;
}
