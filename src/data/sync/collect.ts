import type { TabelSincronizat, WireDeletion, WireRow } from '../../../shared/wire';
import { db } from '../db';
import type { Session, SyncMeta } from '../types';

/**
 * Colectarea schimbărilor locale pentru push. Payload-ul NU conține id-urile
 * locale (id, dirty, profileId, sessionId, templateId) — între dispozitive
 * rândurile vorbesc doar în uid-uri.
 *
 * Sesiunile ÎN DESFĂȘURARE (activa/pauza) și jurnalele lor NU pleacă:
 * sesiunea live e treaba dispozitivului pe care rulează; totul pleacă în
 * secunda în care `opreste()` o încheie (rândurile sunt deja dirty).
 */

const TABELE_ORDONATE: TabelSincronizat[] = [
  'profiles',
  'templates',
  'sessions',
  'bodyMetrics',
  'goals',
  'setLogs',
  'waterLogs',
  'achievements',
  'settings',
];

export interface Colectare {
  upserts: WireRow[];
  deletions: WireDeletion[];
  /** uid → updatedAt la momentul colectării; ack-ul șterge dirty doar dacă rândul nu s-a schimbat între timp */
  snapshotTs: Map<string, string>;
}

type Rand = SyncMeta & { id?: number; profileUid?: string; sessionUid?: string; [k: string]: unknown };

function payloadDin(rand: Rand): Record<string, unknown> {
  const { id: _id, dirty: _dirty, profileId: _p, sessionId: _s, templateId: _t, ...rest } = rand as Record<string, unknown>;
  return rest;
}

async function sesiuniLive(profileUid: string): Promise<Set<string>> {
  const live = await db.sessions
    .filter((s: Session) => s.profileUid === profileUid && (s.status === 'activa' || s.status === 'pauza'))
    .toArray();
  return new Set(live.map((s) => s.uid!).filter(Boolean));
}

/** Doar rândurile murdare (push-ul incremental obișnuit). */
export async function colecteazaSchimbari(profileUid: string): Promise<Colectare> {
  const excluse = await sesiuniLive(profileUid);
  const upserts: WireRow[] = [];
  const snapshotTs = new Map<string, string>();

  for (const tabel of TABELE_ORDONATE) {
    const randuri = (await db.table(tabel).where('dirty').equals(1).toArray()) as Rand[];
    for (const r of randuri) {
      const alProfilului = tabel === 'profiles' ? r.uid === profileUid : r.profileUid === profileUid;
      if (!alProfilului || !r.uid || !r.updatedAt) continue;
      if (tabel === 'sessions' && excluse.has(r.uid)) continue;
      if ((tabel === 'setLogs' || tabel === 'waterLogs') && r.sessionUid && excluse.has(r.sessionUid)) continue;
      upserts.push({ tabel, uid: r.uid, payload: payloadDin(r), updatedAt: r.updatedAt });
      snapshotTs.set(r.uid, r.updatedAt);
    }
  }

  const deletions: WireDeletion[] = (await db.deletions.where('dirty').equals(1).toArray())
    .filter((d) => d.profileUid === profileUid || d.profileUid == null)
    .map((d) => ({ tabel: d.tabel as TabelSincronizat, uid: d.uid, deletedAt: d.deletedAt }));

  return { upserts, deletions, snapshotTs };
}

/** TOATE rândurile profilului (legarea inițială / „trimit varianta locală"). */
export async function colecteazaTot(profileUid: string): Promise<WireRow[]> {
  const excluse = await sesiuniLive(profileUid);
  const upserts: WireRow[] = [];
  for (const tabel of TABELE_ORDONATE) {
    const randuri = (await db.table(tabel).toArray()) as Rand[];
    for (const r of randuri) {
      const alProfilului = tabel === 'profiles' ? r.uid === profileUid : r.profileUid === profileUid;
      if (!alProfilului || !r.uid) continue;
      if (tabel === 'sessions' && excluse.has(r.uid)) continue;
      if ((tabel === 'setLogs' || tabel === 'waterLogs') && r.sessionUid && excluse.has(r.sessionUid)) continue;
      upserts.push({ tabel, uid: r.uid, payload: payloadDin(r), updatedAt: r.updatedAt ?? new Date().toISOString() });
    }
  }
  return upserts;
}
