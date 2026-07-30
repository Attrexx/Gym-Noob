import type { SyncResponse, TabelSincronizat, WireRow } from '../../../shared/wire';
import { db } from '../db';
import type { Colectare } from './collect';
import { reparaObiective } from './invariants';

/**
 * Aplicarea unui răspuns de sincronizare — TOTUL într-o singură tranzacție
 * Dexie, inclusiv avansarea cursorului: ori s-a aplicat tot și cursorul a
 * avansat, ori nimic (o cădere între ele ar sări sau ar re-aplica o fereastră).
 *
 * Scrierile trec prin Dexie → `useLiveQuery` din pagini se împrospătează
 * singur; UI-ul „vede" pull-ul fără niciun cod în plus.
 */

const ORDINE: TabelSincronizat[] = [
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

const TOATE_TABELELE = () => [...ORDINE.map((t) => db.table(t)), db.deletions, db.syncState];

type RandLocal = { id?: number; uid?: string; updatedAt?: string; dirty?: 0 | 1 };

export interface RezultatAplicare {
  aplicate: number;
  /** rânduri refuzate: ale noastre-s mai noi, sau părintele nu mai există */
  sarite: number;
  /** profiles/settings atinse → store-ul de profil trebuie reîncărcat */
  profilSauSetariAtins: boolean;
}

function randDinPayload(r: WireRow): Record<string, unknown> {
  const rand: Record<string, unknown> = { ...r.payload, uid: r.uid, updatedAt: r.updatedAt, dirty: 0 };
  // apărare: id-urile locale n-au ce căuta pe sârmă, chiar dacă un client vechi le-ar trimite
  delete rand.id;
  delete rand.profileId;
  delete rand.sessionId;
  delete rand.templateId;
  return rand;
}

export async function aplicaRaspunsSync(
  profileUid: string,
  raspuns: SyncResponse,
  impins: Colectare,
): Promise<RezultatAplicare> {
  const rezultat: RezultatAplicare = { aplicate: 0, sarite: 0, profilSauSetariAtins: false };
  const acum = new Date().toISOString();

  await db.transaction('rw', TOATE_TABELELE(), async () => {
    const profilLocal = (await db.profiles.get({ uid: profileUid })) as RandLocal | undefined;
    if (!profilLocal?.id) throw new Error('Profilul legat nu mai există local.');
    const profileId = profilLocal.id;

    // 1. ack pentru ce am ÎMPINS: dirty=0 doar dacă rândul n-a fost editat între timp
    for (const u of impins.upserts) {
      const local = (await db.table(u.tabel).get({ uid: u.uid })) as RandLocal | undefined;
      if (local?.id != null && local.dirty === 1 && local.updatedAt === impins.snapshotTs.get(u.uid)) {
        await db.table(u.tabel).update(local.id, { dirty: 0 });
      }
    }
    // ștergerile împinse și-au terminat treaba — jurnalul se golește
    for (const d of impins.deletions) await db.deletions.delete(d.uid);

    // 2. upsert-urile primite, în ordinea dependențelor (părinți → copii)
    const primite = new Map<TabelSincronizat, WireRow[]>();
    for (const r of raspuns.changes.upserts) {
      const lista = primite.get(r.tabel) ?? [];
      lista.push(r);
      primite.set(r.tabel, lista);
    }
    for (const tabel of ORDINE) {
      for (const r of primite.get(tabel) ?? []) {
        const local = (await db.table(tabel).get({ uid: r.uid })) as RandLocal | undefined;
        if (local?.dirty === 1 && (local.updatedAt ?? '') > r.updatedAt) {
          rezultat.sarite++; // al nostru e mai nou — pleacă el la următorul push
          continue;
        }
        const rand = randDinPayload(r);
        if (local?.id != null) rand.id = local.id;
        if (tabel !== 'profiles') rand.profileId = profileId;
        if (tabel === 'sessions' && typeof rand.templateUid === 'string') {
          rand.templateId = ((await db.templates.get({ uid: rand.templateUid })) as RandLocal | undefined)?.id;
        }
        if (tabel === 'setLogs' || tabel === 'waterLogs') {
          const sesiune =
            typeof rand.sessionUid === 'string'
              ? ((await db.sessions.get({ uid: rand.sessionUid })) as RandLocal | undefined)
              : undefined;
          if (!sesiune?.id) {
            rezultat.sarite++; // părinte șters (tombstone) — jurnalul orfan nu se importă
            continue;
          }
          rand.sessionId = sesiune.id;
        }
        await db.table(tabel).put(rand as never);
        rezultat.aplicate++;
        if (tabel === 'profiles' || tabel === 'settings') rezultat.profilSauSetariAtins = true;
      }
    }

    // 3. ștergerile primite
    for (const d of raspuns.changes.deletions) {
      const local = (await db.table(d.tabel).get({ uid: d.uid })) as RandLocal | undefined;
      if (local?.dirty === 1 && (local.updatedAt ?? '') > d.deletedAt) {
        rezultat.sarite++;
        continue;
      }
      if (local?.id != null) {
        await db.table(d.tabel).delete(local.id);
        rezultat.aplicate++;
        if (d.tabel === 'profiles' || d.tabel === 'settings') rezultat.profilSauSetariAtins = true;
      }
      await db.deletions.delete(d.uid); // dacă o aveam și noi în jurnal, serverul o știe deja
    }

    // 4. invariante pe care LWW rând-cu-rând nu le garantează
    await reparaObiective(profileId);

    // 5. cursorul avansează ÎN ACEEAȘI tranzacție cu rândurile aplicate
    await db.syncState.update(profileUid, { cursor: raspuns.cursor, lastSyncLa: acum, lastError: undefined });
  });

  return rezultat;
}

/**
 * Construiește un profil local NOU din snapshot-ul contului (dispozitiv
 * proaspăt sau alegerea „folosesc varianta din cloud" la conflict).
 * Nu atinge profilurile locale existente. Întoarce id-ul local nou.
 */
export async function importaProfilDinCloud(
  rows: WireRow[],
  cont: { profileUid: string; email: string; accessToken: string; refreshToken: string; cursor: number },
): Promise<number> {
  const acum = new Date().toISOString();
  return db.transaction('rw', TOATE_TABELELE(), async () => {
    const profilRow = rows.find((r) => r.tabel === 'profiles' && r.uid === cont.profileUid);
    if (!profilRow) throw new Error('Contul nu conține un profil.');

    const profileId = (await db.profiles.add(randDinPayload(profilRow) as never)) as number;

    const tMap = new Map<string, number>();
    for (const r of rows.filter((x) => x.tabel === 'templates')) {
      const rand = randDinPayload(r);
      rand.profileId = profileId;
      tMap.set(r.uid, (await db.templates.add(rand as never)) as number);
    }
    const sMap = new Map<string, number>();
    for (const r of rows.filter((x) => x.tabel === 'sessions')) {
      const rand = randDinPayload(r);
      rand.profileId = profileId;
      if (typeof rand.templateUid === 'string') rand.templateId = tMap.get(rand.templateUid);
      sMap.set(r.uid, (await db.sessions.add(rand as never)) as number);
    }
    for (const tabel of ['bodyMetrics', 'goals', 'achievements', 'settings'] as const) {
      for (const r of rows.filter((x) => x.tabel === tabel)) {
        const rand = randDinPayload(r);
        rand.profileId = profileId;
        await db.table(tabel).add(rand as never);
      }
    }
    for (const tabel of ['setLogs', 'waterLogs'] as const) {
      for (const r of rows.filter((x) => x.tabel === tabel)) {
        const rand = randDinPayload(r);
        const sessionId = typeof rand.sessionUid === 'string' ? sMap.get(rand.sessionUid) : undefined;
        if (sessionId == null) continue; // jurnal orfan — părintele nu e în snapshot
        rand.profileId = profileId;
        rand.sessionId = sessionId;
        await db.table(tabel).add(rand as never);
      }
    }

    await db.syncState.put({
      profileUid: cont.profileUid,
      email: cont.email,
      accessToken: cont.accessToken,
      refreshToken: cont.refreshToken,
      cursor: cont.cursor,
      lastSyncLa: acum,
    });
    return profileId;
  });
}

/**
 * După un `/sync/replace` cu datele locale (legarea inițială sau „trimit
 * varianta locală"): serverul are deja tot → rândurile locale nu mai sunt
 * murdare, jurnalul de ștergeri se golește, iar starea contului se scrie.
 */
export async function curataDupaReplace(cont: {
  profileUid: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  cursor: number;
}): Promise<void> {
  const acum = new Date().toISOString();
  await db.transaction('rw', TOATE_TABELELE(), async () => {
    for (const tabel of ORDINE) {
      const murdare = (await db.table(tabel).where('dirty').equals(1).toArray()) as Array<
        RandLocal & { profileUid?: string }
      >;
      for (const r of murdare) {
        const alProfilului = tabel === 'profiles' ? r.uid === cont.profileUid : r.profileUid === cont.profileUid;
        if (alProfilului && r.id != null) await db.table(tabel).update(r.id, { dirty: 0 });
      }
    }
    const jurnal = await db.deletions.filter((d) => d.profileUid === cont.profileUid || d.profileUid == null).toArray();
    await db.deletions.bulkDelete(jurnal.map((d) => d.uid));
    await db.syncState.put({ ...cont, lastSyncLa: acum });
  });
}
