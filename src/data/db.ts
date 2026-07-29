import Dexie, { type EntityTable } from 'dexie';
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
} from './types';

/**
 * Baza de date locală (IndexedDB). Tot ce ține de utilizator stă aici,
 * pe dispozitiv. Catalogul de exerciții e static și NU e stocat în DB.
 *
 * Stratul acesta e singurul care atinge Dexie — dacă vreodată mutăm
 * datele într-un backend, doar fișierele din src/data se schimbă.
 */
class GymNoobDB extends Dexie {
  profiles!: EntityTable<Profile, 'id'>;
  bodyMetrics!: EntityTable<BodyMetric, 'id'>;
  goals!: EntityTable<Goal, 'id'>;
  templates!: EntityTable<Template, 'id'>;
  sessions!: EntityTable<Session, 'id'>;
  setLogs!: EntityTable<SetLog, 'id'>;
  waterLogs!: EntityTable<WaterLog, 'id'>;
  achievements!: EntityTable<AchievementUnlock, 'id'>;
  settings!: EntityTable<Settings, 'id'>;

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
  }
}

export const db = new GymNoobDB();
