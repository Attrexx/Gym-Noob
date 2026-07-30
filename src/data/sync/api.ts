import type {
  ApiError,
  AuthResponse,
  ErrorCode,
  MeResponse,
  ReplaceRequest,
  ReplaceResponse,
  SnapshotResponse,
  SyncPushRequest,
  SyncResponse,
  TokenPair,
} from '../../../shared/wire';
import { db } from '../db';
import { apiUrl } from './config';

/**
 * Clientul HTTP al sincronizării. Tokenurile stau în `db.syncState` (per
 * profil); la 401 se încearcă O SINGURĂ reîmprospătare (single-flight — mai
 * multe cereri picate simultan așteaptă același refresh, nu pornesc fiecare
 * al lor: refresh-ul e rotitor, iar un dublu-refresh ar arăta a furt și ar
 * revoca familia).
 */

export class SyncApiError extends Error {
  readonly code: ErrorCode | 'NETWORK';
  readonly status: number;

  constructor(code: ErrorCode | 'NETWORK', status: number, mesaj?: string) {
    super(mesaj ?? code);
    this.code = code;
    this.status = status;
  }
}

/** Mesaje prietenoase pentru UI, pe codurile de sârmă. */
export function mesajEroare(e: unknown): string {
  if (e instanceof SyncApiError) {
    if (e.code === 'NETWORK') return 'Nu ajung la server acum. Datele sunt în siguranță aici — reîncerc eu.';
    if (e.code === 'QUOTA_EXCEEDED') return 'Contul e plin (25 MB de gains!). Sincronizarea ia o pauză.';
    if (e.code === 'INVALID_REFRESH' || e.code === 'TOKEN_EXPIRED') return 'Sesiunea a expirat — intră din nou în cont.';
    if (e.code === 'RATE_LIMITED') return 'Prea multe încercări — o pauză scurtă, ca între seturi.';
    if (e.code === 'PROFILE_MISMATCH') return 'Contul e legat de alt profil (poate l-ai relegat de pe alt dispozitiv).';
    return e.message;
  }
  return e instanceof Error ? e.message : String(e);
}

async function rawFetch<T>(cale: string, init: RequestInit, timeoutMs = 30_000): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${apiUrl()}${cale}`, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (e) {
    throw new SyncApiError('NETWORK', 0, e instanceof Error ? e.message : 'rețea indisponibilă');
  }
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    let corp: ApiError | undefined;
    try {
      corp = (await res.json()) as ApiError;
    } catch {
      /* răspuns fără JSON */
    }
    throw new SyncApiError(corp?.error.code ?? 'SERVER_ERROR', res.status, corp?.error.mesaj);
  }
  return (await res.json()) as T;
}

// ── apeluri fără autentificare ──────────────────────────────────────

export const inregistrareApi = (email: string, parola: string) =>
  rawFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ email, parola }) });

export const loginApi = (email: string, parola: string) =>
  rawFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, parola }) });

/** Logout „best effort" — serverul răspunde mereu 204, iar offline nu ne pasă. */
export function logoutApi(refreshToken: string): void {
  void rawFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }).catch(() => undefined);
}

// ── apeluri cu token explicit (fluxul de legare, înainte să existe syncState) ──

const cuToken = (accessToken: string): Record<string, string> => ({ authorization: `Bearer ${accessToken}` });

export const meCuToken = (accessToken: string) => rawFetch<MeResponse>('/auth/me', { headers: cuToken(accessToken) });

export const snapshotCuToken = (accessToken: string) =>
  rawFetch<SnapshotResponse>('/sync/snapshot', { headers: cuToken(accessToken) }, 120_000);

export const replaceCuToken = (accessToken: string, corp: ReplaceRequest) =>
  rawFetch<ReplaceResponse>('/sync/replace', { method: 'POST', headers: cuToken(accessToken), body: JSON.stringify(corp) }, 120_000);

// ── apeluri autentificate prin syncState (cu refresh single-flight) ─────────

let refreshInFlight: Promise<void> | null = null;

async function refreshTokens(profileUid: string): Promise<void> {
  refreshInFlight ??= (async () => {
    const stare = await db.syncState.get(profileUid);
    if (!stare?.refreshToken) throw new SyncApiError('INVALID_REFRESH', 401);
    try {
      const pereche = await rawFetch<TokenPair>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: stare.refreshToken }),
      });
      await db.syncState.update(profileUid, { accessToken: pereche.accessToken, refreshToken: pereche.refreshToken });
    } catch (e) {
      if (e instanceof SyncApiError && e.code !== 'NETWORK') {
        // refresh mort → sesiunea s-a dus; păstrăm emailul + cursorul, tăiem tokenurile
        await db.syncState.update(profileUid, { accessToken: '', refreshToken: '' });
      }
      throw e;
    }
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function autorizat<T>(profileUid: string, cale: string, init: RequestInit, timeoutMs?: number): Promise<T> {
  const stare = await db.syncState.get(profileUid);
  if (!stare?.accessToken) throw new SyncApiError('INVALID_REFRESH', 401);
  try {
    return await rawFetch<T>(cale, { ...init, headers: { ...(init.headers ?? {}), ...cuToken(stare.accessToken) } }, timeoutMs);
  } catch (e) {
    if (!(e instanceof SyncApiError) || e.status !== 401) throw e;
    await refreshTokens(profileUid);
    const proaspat = await db.syncState.get(profileUid);
    if (!proaspat?.accessToken) throw new SyncApiError('INVALID_REFRESH', 401);
    return rawFetch<T>(cale, { ...init, headers: { ...(init.headers ?? {}), ...cuToken(proaspat.accessToken) } }, timeoutMs);
  }
}

export const syncApi = (profileUid: string, corp: SyncPushRequest) =>
  autorizat<SyncResponse>(profileUid, '/sync', { method: 'POST', body: JSON.stringify(corp) }, 60_000);

export const replaceApi = (profileUid: string, corp: ReplaceRequest) =>
  autorizat<ReplaceResponse>(profileUid, '/sync/replace', { method: 'POST', body: JSON.stringify(corp) }, 120_000);

export const meApi = (profileUid: string) => autorizat<MeResponse>(profileUid, '/auth/me', {});

export const stergeContApi = (profileUid: string, parola: string) =>
  autorizat<void>(profileUid, '/auth/account', { method: 'DELETE', body: JSON.stringify({ parola }) });
