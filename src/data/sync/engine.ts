import type { SnapshotResponse, WireDeletion, WireRow } from '../../../shared/wire';
import { db } from '../db';
import { useProfile } from '@/state/profileStore';
import {
  SyncApiError,
  inregistrareApi,
  loginApi,
  logoutApi,
  meCuToken,
  mesajEroare,
  replaceApi,
  replaceCuToken,
  snapshotCuToken,
  stergeContApi,
  syncApi,
} from './api';
import { colecteazaSchimbari, colecteazaTot, type Colectare } from './collect';
import { aplicaRaspunsSync, curataDupaReplace, importaProfilDinCloud } from './apply';
import { useCont } from './authStore';

/**
 * Motorul de sincronizare. `runSync` e re-entrant-safe: o singură rulare o
 * dată; apelurile din timpul unei rulări programează EXACT o re-rulare.
 * La erori de rețea reîncearcă singur cu backoff exponențial (30 s → 16 min);
 * cota plină și sesiunea expirată NU se reîncearcă automat.
 */

const setCont = useCont.setState;
const MAX_SCHIMBARI_PER_PUSH = 3000; // sub limita serverului de 10k; primul push după ani de date se taie în felii

let inFlight: Promise<void> | null = null;
let inCoada = false;
let backoffMs = 30_000;
let backoffTimer: ReturnType<typeof setTimeout> | null = null;

function programeazaReincercare() {
  if (backoffTimer) return;
  backoffTimer = setTimeout(() => {
    backoffTimer = null;
    void runSync('backoff');
  }, backoffMs);
  backoffMs = Math.min(backoffMs * 2, 16 * 60_000);
}

export function runSync(_motiv: string): Promise<void> {
  if (inFlight) {
    inCoada = true;
    return inFlight;
  }
  inFlight = (async () => {
    const profil = useProfile.getState().profil;
    if (!profil?.uid || !profil.id) return;
    const profileUid = profil.uid;
    const stare = await db.syncState.get(profileUid);
    if (!stare?.refreshToken) return; // nelegat sau sesiune expirată — nimic de făcut
    if (!navigator.onLine) return; // offline: rămânem cum suntem; evenimentul 'online' ne trezește

    setCont({ stare: 'sincronizez' });
    try {
      const tot = await colecteazaSchimbari(profileUid);
      let cursor = stare.cursor;
      let ramaseUpserts = tot.upserts;
      let ramaseDeletions = tot.deletions;

      // cel puțin o rundă (chiar fără schimbări locale — pull-only), apoi restul feliilor
      do {
        const felie: Colectare = {
          upserts: ramaseUpserts.slice(0, MAX_SCHIMBARI_PER_PUSH),
          deletions: ramaseDeletions.slice(0, Math.max(0, MAX_SCHIMBARI_PER_PUSH - Math.min(ramaseUpserts.length, MAX_SCHIMBARI_PER_PUSH))),
          snapshotTs: tot.snapshotTs,
        };
        ramaseUpserts = ramaseUpserts.slice(felie.upserts.length);
        ramaseDeletions = ramaseDeletions.slice(felie.deletions.length);

        const raspuns = await syncApi(profileUid, {
          profileUid,
          cursor,
          changes: { upserts: felie.upserts, deletions: felie.deletions },
        });
        const rezultat = await aplicaRaspunsSync(profileUid, raspuns, felie);
        cursor = raspuns.cursor;
        setCont({ quota: raspuns.quota });
        if (rezultat.profilSauSetariAtins) await useProfile.getState().incarca(profil.id);
      } while (ramaseUpserts.length + ramaseDeletions.length > 0);

      backoffMs = 30_000;
      setCont({ stare: 'legat', lastSyncLa: new Date().toISOString(), lastError: undefined, cotaPlina: false, sesiuneExpirata: false });
    } catch (e) {
      const mesaj = mesajEroare(e);
      if (e instanceof SyncApiError && (e.code === 'INVALID_REFRESH' || e.code === 'TOKEN_EXPIRED')) {
        setCont({ stare: 'eroare', lastError: mesaj, sesiuneExpirata: true });
      } else if (e instanceof SyncApiError && e.code === 'QUOTA_EXCEEDED') {
        setCont({ stare: 'eroare', lastError: mesaj, cotaPlina: true });
        await db.syncState.update(profileUid, { lastError: mesaj });
      } else {
        setCont({ stare: 'eroare', lastError: mesaj });
        await db.syncState.update(profileUid, { lastError: mesaj }).catch(() => undefined);
        programeazaReincercare();
      }
    }
  })().finally(() => {
    inFlight = null;
    if (inCoada) {
      inCoada = false;
      void runSync('coada');
    }
  });
  return inFlight;
}

// ── legarea contului (din Setări, cu profil local activ) ────────────

/** Conflictul „fork" în așteptare — trăiește doar în memorie, până alege userul. */
let conflictInAsteptare: {
  email: string;
  accessToken: string;
  refreshToken: string;
  snapshot: SnapshotResponse;
} | null = null;

async function trimiteLocalulPeCont(
  profileUid: string,
  email: string,
  auth: { accessToken: string; refreshToken: string },
): Promise<void> {
  const rows = await colecteazaTot(profileUid);
  const r = await replaceCuToken(auth.accessToken, { profileUid, rows });
  await curataDupaReplace({ profileUid, email, ...auth, cursor: r.cursor });
  setCont({ stare: 'legat', email, lastSyncLa: new Date().toISOString(), lastError: undefined, quota: r.quota, sesiuneExpirata: false });
}

/**
 * Creează cont sau intră în cont, cu un profil local activ.
 * Întoarce 'legat' sau 'conflict' (contul are alt profil, cu date — userul alege).
 */
export async function legaCont(mod: 'inregistrare' | 'login', email: string, parola: string): Promise<'legat' | 'conflict'> {
  const profil = useProfile.getState().profil;
  if (!profil?.uid) throw new Error('Nu există profil activ.');
  const profileUid = profil.uid;

  const auth = mod === 'inregistrare' ? await inregistrareApi(email, parola) : await loginApi(email, parola);
  const tokens = { accessToken: auth.accessToken, refreshToken: auth.refreshToken };
  const me = await meCuToken(auth.accessToken);

  if (me.profileUid === null) {
    await trimiteLocalulPeCont(profileUid, auth.user.email, tokens);
    return 'legat';
  }
  if (me.profileUid === profileUid) {
    // re-legare a aceluiași profil: cursor 0 → reconcilierea completă face restul
    await db.syncState.put({ profileUid, email: auth.user.email, ...tokens, cursor: 0 });
    setCont({ stare: 'legat', email: auth.user.email, sesiuneExpirata: false, lastError: undefined });
    void runSync('re-legare');
    return 'legat';
  }

  const snapshot = await snapshotCuToken(auth.accessToken);
  if (!snapshot.rows.some((r) => r.tabel === 'profiles')) {
    // cont legat de un profil fantomă, fără date → îl tratăm ca proaspăt
    await trimiteLocalulPeCont(profileUid, auth.user.email, tokens);
    return 'legat';
  }

  conflictInAsteptare = { email: auth.user.email, ...tokens, snapshot };
  setCont({ stare: 'conflict', email: auth.user.email });
  return 'conflict';
}

/** Alegerea din dialogul de conflict. 'cloud' NU șterge profilul local — îl lasă nelegat. */
export async function rezolvaConflict(alegere: 'cloud' | 'local' | 'renunt'): Promise<void> {
  const c = conflictInAsteptare;
  const profil = useProfile.getState().profil;
  if (!c) return;
  conflictInAsteptare = null;

  if (alegere === 'renunt' || !profil?.uid) {
    await useCont.getState().hidrateaza(profil?.uid);
    return;
  }
  if (alegere === 'cloud') {
    const idNou = await importaProfilDinCloud(c.snapshot.rows, {
      profileUid: c.snapshot.profileUid!,
      email: c.email,
      accessToken: c.accessToken,
      refreshToken: c.refreshToken,
      cursor: c.snapshot.cursor,
    });
    await useProfile.getState().incarca(idNou);
    await useCont.getState().hidrateaza(c.snapshot.profileUid!);
    void runSync('profil-din-cloud');
  } else {
    await trimiteLocalulPeCont(profil.uid, c.email, { accessToken: c.accessToken, refreshToken: c.refreshToken });
  }
}

/** Login de pe un dispozitiv PROASPĂT (din onboarding, fără profil local). */
export async function loginPeDispozitivNou(email: string, parola: string): Promise<'importat' | 'gol'> {
  const auth = await loginApi(email, parola);
  const me = await meCuToken(auth.accessToken);
  if (me.profileUid === null) return 'gol';
  const snapshot = await snapshotCuToken(auth.accessToken);
  if (!snapshot.rows.some((r) => r.tabel === 'profiles')) return 'gol';

  const idNou = await importaProfilDinCloud(snapshot.rows, {
    profileUid: me.profileUid,
    email: auth.user.email,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    cursor: snapshot.cursor,
  });
  await useProfile.getState().incarca(idNou);
  await useCont.getState().hidrateaza(me.profileUid);
  return 'importat';
}

/** Re-login când sesiunea a expirat (păstrează cursorul — nu re-trage tot). */
export async function reAutentifica(email: string, parola: string): Promise<void> {
  const profil = useProfile.getState().profil;
  if (!profil?.uid) throw new Error('Nu există profil activ.');
  const auth = await loginApi(email, parola);
  const me = await meCuToken(auth.accessToken);
  if (me.profileUid !== null && me.profileUid !== profil.uid) {
    // între timp contul a fost legat de alt profil — trecem pe fluxul de conflict
    await db.syncState.delete(profil.uid);
    const rezultat = await legaCont('login', email, parola);
    if (rezultat === 'conflict') return;
  } else {
    const stare = await db.syncState.get(profil.uid);
    await db.syncState.put({
      profileUid: profil.uid,
      email: auth.user.email,
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      cursor: stare?.cursor ?? 0,
      lastSyncLa: stare?.lastSyncLa,
    });
  }
  await useCont.getState().hidrateaza(profil.uid);
  void runSync('re-login');
}

/** Dezleagă contul de pe dispozitiv. Datele locale rămân neatinse. */
export async function deconecteaza(): Promise<void> {
  const profil = useProfile.getState().profil;
  if (!profil?.uid) return;
  const stare = await db.syncState.get(profil.uid);
  if (stare?.refreshToken) logoutApi(stare.refreshToken);
  await db.syncState.delete(profil.uid);
  await useCont.getState().hidrateaza(profil.uid);
}

/**
 * După restaurarea unui backup, RESTAURAREA e autoritară pentru orice cont legat:
 *  - profilul contului mai există în datele restaurate (backup v2 din același
 *    „arbore") → `/sync/replace` aduce cloud-ul la varianta restaurată
 *    (rândurile absente devin tombstone pe server);
 *  - nu mai există (tipic un backup v1, care primește uid-uri proaspete la
 *    import) → dezlegăm contul — la re-legare, dialogul de conflict oferă
 *    explicit alegerea;
 *  - replace eșuat (offline etc.) → dezlegăm, ca să nu se strecoare mai târziu
 *    un MERGE tăcut în locul înlocuirii promise.
 * Întoarce un mesaj de pus sub confirmarea restaurării (sau null).
 */
export async function dupaRestaurareBackup(): Promise<string | null> {
  const legate = await db.syncState.toArray();
  if (legate.length === 0) return null;
  const mesaje: string[] = [];
  for (const cont of legate) {
    const profilExista = await db.profiles.get({ uid: cont.profileUid });
    if (!profilExista) {
      await db.syncState.delete(cont.profileUid);
      mesaje.push('Restaurarea a schimbat identitatea datelor — leagă contul din nou din Setări.');
      continue;
    }
    try {
      const rows = await colecteazaTot(cont.profileUid);
      const r = await replaceApi(cont.profileUid, { profileUid: cont.profileUid, rows });
      const proaspat = await db.syncState.get(cont.profileUid); // refresh-ul putea roti tokenurile
      await curataDupaReplace({
        profileUid: cont.profileUid,
        email: cont.email,
        accessToken: proaspat?.accessToken ?? cont.accessToken,
        refreshToken: proaspat?.refreshToken ?? cont.refreshToken,
        cursor: r.cursor,
      });
      mesaje.push(`Cloud-ul (${cont.email}) a fost adus la varianta restaurată.`);
    } catch {
      await db.syncState.delete(cont.profileUid);
      mesaje.push(`Nu am putut sincroniza restaurarea pentru ${cont.email} — leagă contul din nou când ai internet.`);
    }
  }
  await useCont.getState().hidrateaza(useProfile.getState().profil?.uid);
  return mesaje.join(' ');
}

/** Șterge contul și datele din cloud (cu parola). Datele locale rămân. */
export async function stergeCont(parola: string): Promise<void> {
  const profil = useProfile.getState().profil;
  if (!profil?.uid) return;
  await stergeContApi(profil.uid, parola);
  await db.syncState.delete(profil.uid);
  await useCont.getState().hidrateaza(profil.uid);
}

// tip re-exportat pentru UI (dialogul de conflict n-are nevoie de detalii)
export type { WireRow, WireDeletion };
