import Dexie, { type EntityTable } from 'dexie';
import { normalizeazaBaza } from './normalize';
import type {
  Profile,
  BodyMetric,
  Goal,
  Template,
  Session,
  SetLog,
  WaterLog,
  AchievementUnlock,
  Settings,
  DeletionRecord,
  SyncStateRow,
} from './types';

/**
 * Baza de date locală (IndexedDB). Tot ce ține de utilizator stă aici,
 * pe dispozitiv. Catalogul de exerciții e static și NU e stocat în DB.
 *
 * Stratul acesta e singurul care atinge Dexie — sincronizarea opțională
 * (src/data/sync) citește și scrie tot prin el.
 *
 * Versiunea 2 adaugă metadatele de sincronizare (uid unic + dirty pe fiecare
 * tabel), jurnalul de ștergeri și starea contului. Upgrade-ul e ADITIV:
 * utilizatorii au date reale, nu se șterge nimic niciodată aici.
 */
export class GymNoobDB extends Dexie {
  profiles!: EntityTable<Profile, 'id'>;
  bodyMetrics!: EntityTable<BodyMetric, 'id'>;
  goals!: EntityTable<Goal, 'id'>;
  templates!: EntityTable<Template, 'id'>;
  sessions!: EntityTable<Session, 'id'>;
  setLogs!: EntityTable<SetLog, 'id'>;
  waterLogs!: EntityTable<WaterLog, 'id'>;
  achievements!: EntityTable<AchievementUnlock, 'id'>;
  settings!: EntityTable<Settings, 'id'>;
  deletions!: EntityTable<DeletionRecord, 'uid'>;
  syncState!: EntityTable<SyncStateRow, 'profileUid'>;

  constructor() {
    super('gym-noob');
    this.version(1).stores({
      profiles: '++id, nume, folositLa',
      bodyMetrics: '++id, profileId, data, [profileId+data]',
      goals: '++id, profileId, activ',
      templates: '++id, profileId, nume',
      sessions: '++id, profileId, status, inceput, [profileId+inceput]',
      setLogs: '++id, sessionId, profileId, exerciseId, data, [profileId+exerciseId], [profileId+data]',
      waterLogs: '++id, sessionId, profileId, data',
      achievements: '++id, profileId, achievementId, [profileId+achievementId]',
      settings: '++id, profileId',
    });
    this.version(2)
      .stores({
        profiles: '++id, nume, folositLa, &uid, dirty',
        bodyMetrics: '++id, profileId, data, [profileId+data], &uid, dirty',
        goals: '++id, profileId, activ, &uid, dirty',
        templates: '++id, profileId, nume, &uid, dirty',
        sessions: '++id, profileId, status, inceput, [profileId+inceput], &uid, dirty',
        setLogs: '++id, sessionId, profileId, exerciseId, data, [profileId+exerciseId], [profileId+data], &uid, dirty',
        waterLogs: '++id, sessionId, profileId, data, &uid, dirty',
        achievements: '++id, profileId, achievementId, [profileId+achievementId], &uid, dirty',
        settings: '++id, profileId, &uid, dirty',
        deletions: 'uid, tabel, dirty',
        syncState: 'profileUid',
      })
      .upgrade((tx) => normalizeazaBaza(tx));
  }
}

export const db = new GymNoobDB();
