import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/data/db';
import { addStarterTemplates, createProfile, importaProgram } from '@/data/repo';
import { getProgram } from '@/data/catalog/programs';
import { descriereSablon, numeSablon } from '@/data/catalog/text/rezolva';
import { incarcaLimba } from '@/i18n/store';
import type { Template } from '@/data/types';

/**
 * Textul catalogului ajunge în datele utilizatorului la import. Testele astea
 * păzesc înțelegerea: îl afișăm în limba curentă, dar NU-l rescriem în baza de
 * date, iar ce a scris utilizatorul rămâne neatins.
 */

async function profilNou(): Promise<number> {
  return createProfile(
    { nume: 'Test', sex: 'M', dataNasterii: '1990-01-01', inaltimeCm: 180, activitate: 'moderat' } as never,
    90,
  );
}

beforeEach(async () => {
  await db.delete();
  await db.open();
  await incarcaLimba('ro');
});

describe('proveniența textului șabloanelor', () => {
  it('șabloanele livrate primesc sursaText la creare', async () => {
    const id = await profilNou();
    await addStarterTemplates(id);
    const sabloane = await db.templates.where({ profileId: id }).toArray();
    expect(sabloane.length).toBeGreaterThan(0);
    for (const s of sabloane) expect(s.sursaText, s.nume).toMatch(/^starter:\d+$/);
  });

  it('antrenamentele importate dintr-un program primesc sursaText', async () => {
    const id = await profilNou();
    await importaProgram(id, getProgram('full-body-3x')!);
    const sabloane = await db.templates.where({ profileId: id }).toArray();
    expect(sabloane.length).toBeGreaterThan(0);
    for (const s of sabloane) expect(s.sursaText, s.nume).toMatch(/^program:full-body-3x\//);
  });

  it('numele afișat urmează limba, fără să rescrie baza de date', async () => {
    const id = await profilNou();
    await addStarterTemplates(id);
    const inainte = (await db.templates.where({ profileId: id }).first())!;
    const numeRo = numeSablon(inainte);
    expect(numeRo).toBe(inainte.nume);
    expect(descriereSablon(inainte)).toBe(inainte.descriere);

    // rândul din baza de date NU s-a atins — asta e invariantul care ține
    // sincronizarea last-write-wins să nu intre în buclă între dispozitive
    const dupa = (await db.templates.get(inainte.id!))!;
    expect(dupa.nume).toBe(inainte.nume);
    expect(dupa.updatedAt).toBe(inainte.updatedAt);
  });

  it('un șablon redenumit de utilizator nu mai e tradus niciodată', async () => {
    const t: Template = {
      profileId: 1,
      nume: 'Ziua mea de brate',
      etichete: [],
      items: [],
      creatLa: '',
      modificatLa: '',
      sursaText: 'starter:0',
      textEditat: true,
    };
    expect(numeSablon(t)).toBe('Ziua mea de brate');
  });

  it('un șablon făcut de la zero nu e atins (nu are proveniență)', () => {
    const t: Template = {
      profileId: 1,
      nume: 'Planul meu',
      etichete: [],
      items: [],
      creatLa: '',
      modificatLa: '',
    };
    expect(numeSablon(t)).toBe('Planul meu');
    expect(descriereSablon(t)).toBeUndefined();
  });

  it('cade elegant dacă proveniența trimite spre ceva ce nu mai există', () => {
    const t: Template = {
      profileId: 1,
      nume: 'Ce scria atunci',
      etichete: [],
      items: [],
      creatLa: '',
      modificatLa: '',
      sursaText: 'program:program-sters/a',
    };
    // fără plasa asta, un program scos din catalog ar goli numele planului
    expect(numeSablon(t)).toBe('Ce scria atunci');
  });
});
