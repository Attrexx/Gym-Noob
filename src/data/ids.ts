/**
 * Identități stabile pentru sincronizare. `id`-urile numerice Dexie sunt
 * locale dispozitivului (auto-increment) — între dispozitive rândurile se
 * recunosc după `uid`.
 *
 * Setările și realizările au uid-uri DERIVATE, nu aleatorii: două dispozitive
 * generează același uid pentru același rând logic, deci la sincronizare
 * converg prin last-write-wins fără dubluri.
 */

export const newUid = (): string => crypto.randomUUID();

export const settingsUid = (profileUid: string): string => `${profileUid}-settings`;

export const achievementUid = (profileUid: string, achievementId: string): string =>
  `${profileUid}-ach-${achievementId}`;
