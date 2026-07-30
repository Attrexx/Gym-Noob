/**
 * Formatul de sârmă („wire") dintre PWA și API-ul de sincronizare.
 * Singurul modul importat și de client (src/data/sync) și de server
 * (server/src) — doar tipuri și constante, zero dependențe.
 *
 * Regula de identitate: rândurile se recunosc între dispozitive după `uid`;
 * `payload` NU conține id-uri locale (id, dirty) — cheile străine din
 * payload sunt uid-uri (`profileUid`, `sessionUid`, `templateUid`).
 */

export const TABELE_SINCRONIZATE = [
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

export type TabelSincronizat = (typeof TABELE_SINCRONIZATE)[number];

export interface WireRow {
  tabel: TabelSincronizat;
  uid: string;
  payload: Record<string, unknown>;
  /** ISO UTC, normalizat de server (LWW) */
  updatedAt: string;
}

export interface WireDeletion {
  tabel: TabelSincronizat;
  uid: string;
  deletedAt: string;
}

// ── Erori ───────────────────────────────────────────────────────────

export type ErrorCode =
  | 'VALIDATION'
  | 'BAD_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'INVALID_REFRESH'
  | 'PROFILE_MISMATCH'
  | 'EMAIL_TAKEN'
  | 'QUOTA_EXCEEDED'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'SERVER_ERROR';

export interface ApiError {
  error: { code: ErrorCode; mesaj?: string };
}

// ── Autentificare ───────────────────────────────────────────────────

export interface CredentialsRequest {
  email: string;
  parola: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokenPair {
  user: { id: number; email: string; createdAt: string };
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface QuotaInfo {
  usedBytes: number;
  quotaBytes: number;
}

export interface MeResponse {
  id: number;
  email: string;
  createdAt: string;
  /** profilul legat de cont (un cont = un profil); null până la primul sync */
  profileUid: string | null;
  usedBytes: number;
  quotaBytes: number;
}

// ── Sincronizare ────────────────────────────────────────────────────

export interface SyncPushRequest {
  profileUid: string;
  /** ultimul seq văzut de client; serverul întoarce tot ce e mai nou */
  cursor: number;
  changes: { upserts: WireRow[]; deletions: WireDeletion[] };
}

export interface SyncResponse {
  cursor: number;
  /** schimbările altora de după cursor — fără ecoul propriului push */
  changes: { upserts: WireRow[]; deletions: WireDeletion[] };
  quota: QuotaInfo;
}

export interface SnapshotResponse {
  cursor: number;
  profileUid: string | null;
  rows: WireRow[];
}

export interface ReplaceRequest {
  profileUid: string;
  rows: WireRow[];
}

export interface ReplaceResponse {
  cursor: number;
  quota: QuotaInfo;
}

export interface HealthResponse {
  ok: true;
  version: string;
  uptimeSec: number;
}
