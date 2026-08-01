import type { Template, TemplateItem } from '../types';
import { pachetCatalog } from './text/activ';

/**
 * Șabloane livrate cu aplicația — STRUCTURA. Numele și descrierile vin din
 * pachetul de limbă, aliniate ca ordine cu lista de mai jos.
 *
 * Atenție: textul ăsta se COPIAZĂ în profilul nou creat, deci devine datele
 * utilizatorului. Vezi `sursaText` în repo.ts — de acolo știm mai târziu că
 * un șablon a venit de la noi și îl putem afișa în limba curentă.
 */
const ITEMS: TemplateItem[][] = [
  [
        { exerciseId: 'mers-inclinat-banda', seturi: 1, durataSec: 600, pauzaSec: 60, viteza: 5.5, inclinatie: 8 },
        { exerciseId: 'impins-piept-aparat', seturi: 2, repetari: 12, greutate: 20, pauzaSec: 90 },
        { exerciseId: 'tractiuni-helcometru', seturi: 2, repetari: 12, greutate: 25, pauzaSec: 90 },
        { exerciseId: 'presa-picioare', seturi: 2, repetari: 12, greutate: 40, pauzaSec: 90 },
        { exerciseId: 'plank', seturi: 2, durataSec: 25, pauzaSec: 60 },
        { exerciseId: 'bicicleta-stationara', seturi: 1, durataSec: 300, pauzaSec: 0 },
  ],
  [
        { exerciseId: 'mers-inclinat-banda', seturi: 1, durataSec: 480, pauzaSec: 60, viteza: 5.5, inclinatie: 8 },
        { exerciseId: 'presa-picioare', seturi: 3, repetari: 10, greutate: 50, pauzaSec: 120 },
        { exerciseId: 'impins-gantere-banca', seturi: 3, repetari: 10, greutate: 10, pauzaSec: 90, tempo: '2-0-1' },
        { exerciseId: 'ramat-cablu-asezat', seturi: 3, repetari: 12, greutate: 30, pauzaSec: 90 },
        { exerciseId: 'presa-umeri-aparat', seturi: 2, repetari: 12, greutate: 15, pauzaSec: 90 },
        { exerciseId: 'plank', seturi: 3, durataSec: 30, pauzaSec: 60 },
  ],
  [
        { exerciseId: 'vaslit-aparat', seturi: 1, durataSec: 480, pauzaSec: 60 },
        { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 120 },
        { exerciseId: 'genuflexiuni-corp', seturi: 3, repetari: 15, pauzaSec: 90 },
        { exerciseId: 'flexii-ischiogambieri', seturi: 3, repetari: 12, greutate: 20, pauzaSec: 90 },
        { exerciseId: 'flotari', seturi: 3, repetari: 8, pauzaSec: 90 },
        { exerciseId: 'flexii-gantere', seturi: 2, repetari: 12, greutate: 6, pauzaSec: 60 },
        { exerciseId: 'extensii-cablu-triceps', seturi: 2, repetari: 12, greutate: 15, pauzaSec: 60 },
  ],
  [
        { exerciseId: 'bicicleta-stationara', seturi: 1, durataSec: 900, pauzaSec: 60 },
        { exerciseId: 'plank', seturi: 3, durataSec: 30, pauzaSec: 45 },
        { exerciseId: 'crunch-saltea', seturi: 3, repetari: 15, pauzaSec: 45 },
        { exerciseId: 'russian-twist', seturi: 3, repetari: 20, pauzaSec: 45 },
        { exerciseId: 'mountain-climbers', seturi: 3, durataSec: 25, pauzaSec: 60 },
        { exerciseId: 'mers-inclinat-banda', seturi: 1, durataSec: 600, pauzaSec: 0, viteza: 5.5, inclinatie: 10 },
  ],
];

export function starterTemplates(profileId: number): Omit<Template, 'id'>[] {
  const acum = new Date().toISOString();
  const text = pachetCatalog().sabloaneStart;
  return ITEMS.map((items, i) => ({
    profileId,
    creatLa: acum,
    modificatLa: acum,
    predefinit: true,
    nume: text[i].nume,
    descriere: text[i].descriere,
    etichete: text[i].etichete,
    items,
  }));
}
