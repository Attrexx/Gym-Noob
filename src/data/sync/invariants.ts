import { db } from '../db';

/**
 * Reparații de invariante după un pull — reguli pe care îmbinarea rând-cu-rând
 * (LWW) nu le poate garanta singură. Trebuie să fie DETERMINISTE: ambele
 * dispozitive ajung la același rezultat, iar rândurile atinse pleacă dirty și
 * converg la următorul sync.
 */

/** Un singur obiectiv activ per profil: rămâne cel mai NOU după creatLa. */
export async function reparaObiective(profileId: number): Promise<void> {
  const active = await db.goals.where({ profileId }).filter((g) => g.activ).toArray();
  if (active.length <= 1) return;
  const dupaData = [...active].sort((a, b) => (b.creatLa ?? '').localeCompare(a.creatLa ?? ''));
  for (const g of dupaData.slice(1)) {
    await db.goals.update(g.id!, { activ: false, updatedAt: new Date().toISOString(), dirty: 1 });
  }
}
