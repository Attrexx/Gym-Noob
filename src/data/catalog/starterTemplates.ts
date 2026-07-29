import type { Template } from '../types';

/**
 * Șabloane livrate cu aplicația — programe de început verificate,
 * gândite pentru slăbit + tonifiere. Se copiază în profilul nou creat.
 */
export function starterTemplates(profileId: number): Omit<Template, 'id'>[] {
  const acum = new Date().toISOString();
  const base = { profileId, creatLa: acum, modificatLa: acum, predefinit: true };
  return [
    {
      ...base,
      nume: 'Prima zi la sală',
      descriere: 'Tur de acomodare: puțin din toate, greutăți mici, zero rușine. Scopul e să pleci zâmbind, nu distrus.',
      etichete: ['începător', 'full body'],
      items: [
        { exerciseId: 'mers-inclinat-banda', seturi: 1, durataSec: 600, pauzaSec: 60, viteza: 5.5, inclinatie: 8 },
        { exerciseId: 'impins-piept-aparat', seturi: 2, repetari: 12, greutate: 20, pauzaSec: 90 },
        { exerciseId: 'tractiuni-helcometru', seturi: 2, repetari: 12, greutate: 25, pauzaSec: 90 },
        { exerciseId: 'presa-picioare', seturi: 2, repetari: 12, greutate: 40, pauzaSec: 90 },
        { exerciseId: 'plank', seturi: 2, durataSec: 25, pauzaSec: 60 },
        { exerciseId: 'bicicleta-stationara', seturi: 1, durataSec: 300, pauzaSec: 0 },
      ],
    },
    {
      ...base,
      nume: 'Full Body A',
      descriere: 'Jumătatea A a programului de 3 zile/săptămână (A-B-A, apoi B-A-B). Împins + picioare dominant.',
      etichete: ['începător', 'full body', 'forță'],
      items: [
        { exerciseId: 'mers-inclinat-banda', seturi: 1, durataSec: 480, pauzaSec: 60, viteza: 5.5, inclinatie: 8 },
        { exerciseId: 'presa-picioare', seturi: 3, repetari: 10, greutate: 50, pauzaSec: 120 },
        { exerciseId: 'impins-gantere-banca', seturi: 3, repetari: 10, greutate: 10, pauzaSec: 90, tempo: '2-0-1' },
        { exerciseId: 'ramat-cablu-asezat', seturi: 3, repetari: 12, greutate: 30, pauzaSec: 90 },
        { exerciseId: 'presa-umeri-aparat', seturi: 2, repetari: 12, greutate: 15, pauzaSec: 90 },
        { exerciseId: 'plank', seturi: 3, durataSec: 30, pauzaSec: 60 },
      ],
    },
    {
      ...base,
      nume: 'Full Body B',
      descriere: 'Jumătatea B: tras + lanț posterior dominant. Alternează cu A.',
      etichete: ['începător', 'full body', 'forță'],
      items: [
        { exerciseId: 'vaslit-aparat', seturi: 1, durataSec: 480, pauzaSec: 60 },
        { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 120 },
        { exerciseId: 'genuflexiuni-corp', seturi: 3, repetari: 15, pauzaSec: 90 },
        { exerciseId: 'flexii-ischiogambieri', seturi: 3, repetari: 12, greutate: 20, pauzaSec: 90 },
        { exerciseId: 'flotari', seturi: 3, repetari: 8, pauzaSec: 90 },
        { exerciseId: 'flexii-gantere', seturi: 2, repetari: 12, greutate: 6, pauzaSec: 60 },
        { exerciseId: 'extensii-cablu-triceps', seturi: 2, repetari: 12, greutate: 15, pauzaSec: 60 },
      ],
    },
    {
      ...base,
      nume: 'Cardio + Core',
      descriere: 'Zi de ars calorii și trunchi solid — ideală între zilele de forță sau când vrei ceva mai lejer.',
      etichete: ['cardio', 'abdomen', 'slăbit'],
      items: [
        { exerciseId: 'bicicleta-stationara', seturi: 1, durataSec: 900, pauzaSec: 60 },
        { exerciseId: 'plank', seturi: 3, durataSec: 30, pauzaSec: 45 },
        { exerciseId: 'crunch-saltea', seturi: 3, repetari: 15, pauzaSec: 45 },
        { exerciseId: 'russian-twist', seturi: 3, repetari: 20, pauzaSec: 45 },
        { exerciseId: 'mountain-climbers', seturi: 3, durataSec: 25, pauzaSec: 60 },
        { exerciseId: 'mers-inclinat-banda', seturi: 1, durataSec: 600, pauzaSec: 0, viteza: 5.5, inclinatie: 10 },
      ],
    },
  ];
}
