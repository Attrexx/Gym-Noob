import type { ProgramDef, ProgramGoal } from '../types';

/**
 * Programele celebre, traduse și adaptate pentru începători.
 *
 * Greutățile din `items` sunt puncte de plecare orientative pentru cineva
 * care începe — se reglează la prima sesiune. Unde programul original cere
 * procente dintr-un maxim (Wendler 5/3/1) sau „cât poți" (AMRAP), greutatea
 * lipsește intenționat, iar instrucțiunea stă în `notite`.
 */

export const OBIECTIVE: { id: ProgramGoal; nume: string; emoji: string }[] = [
  { id: 'forta', nume: 'Forță', emoji: '🏋️' },
  { id: 'masa', nume: 'Masă musculară', emoji: '💪' },
  { id: 'slabit', nume: 'Slăbit', emoji: '🔥' },
  { id: 'rezistenta', nume: 'Rezistență', emoji: '🫀' },
  { id: 'tehnica', nume: 'Tehnică', emoji: '🎯' },
];

export function numeObiectiv(id: ProgramGoal): string {
  return OBIECTIVE.find((o) => o.id === id)?.nume ?? id;
}

const AMRAP = 'AMRAP — cât poți, cu formă bună. Oprește-te când mai ai o repetare curată în rezervă.';

export const PROGRAME: ProgramDef[] = [
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'full-body-3x',
    nume: 'Full Body 3x pe săptămână',
    subtitlu: 'Tot corpul, de trei ori pe săptămână. Programul cu care ar trebui să înceapă absolut oricine.',
    origine: 'Structura clasică de începător (rudă cu Starting Strength și StrongLifts 5×5)',
    descriere:
      'Două antrenamente, A și B, alternate: A-B-A într-o săptămână, B-A-B în următoarea. Fiecare grupă musculară e lucrată de trei ori pe săptămână — exact frecvența la care un începător crește cel mai repede. Puține exerciții, toate compuse, nimic exotic. Plictisitor? Da. Funcționează? Extrem.',
    nivel: 1,
    obiective: ['forta', 'masa', 'tehnica'],
    frecventa: '3 zile pe săptămână, cu o zi liberă între ele',
    durata: '45-60 min',
    saptamana: [
      'Luni — Antrenamentul A',
      'Marți — liber (mers, plimbare, orice mișcare ușoară)',
      'Miercuri — Antrenamentul B',
      'Joi — liber',
      'Vineri — Antrenamentul A',
      'Sâmbătă / Duminică — liber. Săptămâna următoare începi cu B.',
    ],
    progresie: [
      'Ai făcut toate seturile cu toate repetările? Adaugă 2,5 kg la exercițiile de sus (împins, presă) și 5 kg la cele de picioare și îndreptări, la următoarea sesiune.',
      'Ai ratat repetările de două ori la rând la același exercițiu? Scazi 10% și urci din nou. Se cheamă „deload" și e parte din plan, nu un eșec.',
    ],
    note: [
      'Primele 2-3 săptămâni folosește greutăți ridicol de mici. Înveți traseul mișcării, nu impresionezi pe nimeni.',
      'Încălzirea nu e opțională: 5 minute cardio ușor + 1-2 seturi cu bara goală la primul exercițiu.',
    ],
    etichete: ['începător', 'full body', 'forță'],
    antrenamente: [
      {
        id: 'a',
        nume: 'Full Body A',
        descriere: 'Genuflexiuni + împins. Ziua în care înveți să te lași jos și să împingi în sus.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150, notite: 'Începe cu bara goală (20 kg) până tehnica e curată.' },
          { exerciseId: 'impins-haltera-banca', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
          { exerciseId: 'ramat-haltera-aplecat', seturi: 3, repetari: 8, greutate: 25, pauzaSec: 120 },
          { exerciseId: 'plank', seturi: 3, durataSec: 30, pauzaSec: 60 },
        ],
      },
      {
        id: 'b',
        nume: 'Full Body B',
        descriere: 'Îndreptări + presă militară. Ziua în care înveți să ridici de jos și să împingi deasupra capului.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
          { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
          { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 40, pauzaSec: 180, notite: 'Un singur set greu e suficient. Îndreptările obosesc mai mult decât par.' },
          { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 120 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'powerbuilding-periodizat',
    nume: 'Powerbuilding periodizat (Rutina 1 + Rutina 2)',
    subtitlu: 'Două rutine full body care se rotesc: 2 săptămâni pe hipertrofie, 6 pe forță, apoi de la capăt.',
    origine: 'Program clasic de forum, în două blocuri complementare',
    descriere:
      'Cel mai bun program de antrenament e cel pe care îl faci constant. Ca începător, ai nevoie de tot corpul de trei ori pe săptămână — iar programul ăsta îți dă două moduri de a face asta. Rutina 1 e orientată pe hipertrofie: fiecare grupă musculară e lovită de trei ori pe săptămână, stimul berechet pentru creșterea în volum. Rutina 2 e orientată pe forță: volum mai mare pe ridicările mari, dar mai puțin volum total per grupă, ca să crești constant la compuse fără să te epuizezi cu accesorii. Împreună formează un program periodizat de powerbuilding.',
    nivel: 2,
    obiective: ['masa', 'forta'],
    frecventa: '3 zile pe săptămână, cu o zi de pauză între sesiuni',
    durata: '60-75 min',
    saptamana: [
      'FAZA 1 (săptămânile 1-2) — hipertrofie: A, B, C, apoi din nou A, B, C.',
      'FAZA 2 (săptămânile 3-8) — forță: alternezi A și B (A-B-A, apoi B-A-B).',
      'După săptămâna 8 o iei de la capăt cu Faza 1.',
      'Exemplu de săptămână: Luni · Miercuri · Vineri, cu o zi liberă între sesiuni.',
    ],
    progresie: [
      'Faza 1 (hipertrofie): când faci toate cele 3 seturi la numărul de repetări cerut, adaugi 2,5 kg data viitoare.',
      'Faza 2 (forță): la ridicările mari (genuflexiuni, îndreptări, împins, presă militară) urci mai agresiv — 2,5 kg sus, 5 kg la picioare — atât timp cât toate repetările ies curate.',
      'La exercițiile AMRAP (tracțiuni, fondări) progresezi prin repetări: când treci de 12 pe set, adaugi greutate cu o centură.',
    ],
    note: [
      'Faza 2 are mai puține accesorii intenționat — ideea e să crești la compuse fără să-ți obosești mușchii cu volum inutil.',
      'Pauzele mari (2-3 min) la exercițiile grele nu sunt timp pierdut. Sunt parte din antrenament.',
      '„3 × 20 pe fiecare parte" la răsucirile cu cablul înseamnă 20 stânga + 20 dreapta, per set.',
    ],
    etichete: ['powerbuilding', 'full body', 'periodizare'],
    antrenamente: [
      {
        id: 'r1a',
        faza: 'Faza 1 · Hipertrofie (2 săptămâni)',
        nume: 'Rutina 1 · Antrenamentul A',
        descriere: 'Îndreptări, presă militară, împins la piept + brațe, gambe și abdomen.',
        items: [
          { exerciseId: 'indreptari-clasice', seturi: 3, repetari: 8, greutate: 40, pauzaSec: 150 },
          { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
          { exerciseId: 'impins-haltera-banca', seturi: 3, repetari: 8, greutate: 25, pauzaSec: 150 },
          { exerciseId: 'flexii-gantere', seturi: 3, repetari: 10, greutate: 8, pauzaSec: 60 },
          { exerciseId: 'extensii-ganteră-cap', seturi: 3, repetari: 10, greutate: 8, pauzaSec: 60 },
          { exerciseId: 'ridicari-gambe', seturi: 3, repetari: 20, greutate: 40, pauzaSec: 60 },
          { exerciseId: 'ridicari-trunchi', seturi: 3, repetari: 20, pauzaSec: 60 },
        ],
      },
      {
        id: 'r1b',
        faza: 'Faza 1 · Hipertrofie (2 săptămâni)',
        nume: 'Rutina 1 · Antrenamentul B',
        descriere: 'Genuflexiuni, ramat, împins înclinat + brațe, umeri și oblici.',
        items: [
          { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 30, pauzaSec: 150 },
          { exerciseId: 'ramat-haltera-aplecat', seturi: 3, repetari: 8, greutate: 30, pauzaSec: 150 },
          { exerciseId: 'impins-haltera-inclinat', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
          { exerciseId: 'flexii-bara-z', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
          { exerciseId: 'ridicari-laterale', seturi: 3, repetari: 10, greutate: 5, pauzaSec: 60 },
          { exerciseId: 'extensii-cablu-triceps', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
          { exerciseId: 'rasuciri-cablu-oblici', seturi: 3, repetari: 20, greutate: 10, pauzaSec: 60, notite: '20 de repetări pe fiecare parte.' },
        ],
      },
      {
        id: 'r1c',
        faza: 'Faza 1 · Hipertrofie (2 săptămâni)',
        nume: 'Rutina 1 · Antrenamentul C',
        descriere: 'Un picior odată, priză îngustă, gantere + spate și abdomen greu.',
        items: [
          { exerciseId: 'fandari-bulgaresti', seturi: 3, repetari: 8, greutate: 8, pauzaSec: 150, notite: '8 repetări pe fiecare picior.' },
          { exerciseId: 'impins-priza-ingusta', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
          { exerciseId: 'impins-gantere-banca', seturi: 3, repetari: 8, greutate: 12, pauzaSec: 150 },
          { exerciseId: 'flexii-inclinat-gantere', seturi: 3, repetari: 10, greutate: 6, pauzaSec: 60 },
          { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 60 },
          { exerciseId: 'face-pull', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
          { exerciseId: 'ridicari-picioare-atarnat', seturi: 3, repetari: 20, pauzaSec: 60, notite: 'Prea greu? Ridicări de genunchi la paralele sau la sol.' },
        ],
      },
      {
        id: 'r2a',
        faza: 'Faza 2 · Forță (6 săptămâni)',
        nume: 'Rutina 2 · Antrenamentul A',
        descriere: 'Genuflexiuni, ramat, împins + tracțiuni și fondări la maxim.',
        items: [
          { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 35, pauzaSec: 180 },
          { exerciseId: 'ramat-haltera-aplecat', seturi: 3, repetari: 8, greutate: 32.5, pauzaSec: 150 },
          { exerciseId: 'impins-haltera-banca', seturi: 3, repetari: 8, greutate: 30, pauzaSec: 180 },
          { exerciseId: 'tractiuni-supinat', seturi: 3, pauzaSec: 60, notite: AMRAP },
          { exerciseId: 'fondari-paralele-libere', seturi: 3, pauzaSec: 60, notite: AMRAP },
          { exerciseId: 'ridicari-gambe', seturi: 3, repetari: 20, greutate: 40, pauzaSec: 60 },
          { exerciseId: 'ridicari-trunchi', seturi: 3, repetari: 20, pauzaSec: 60 },
        ],
      },
      {
        id: 'r2b',
        faza: 'Faza 2 · Forță (6 săptămâni)',
        nume: 'Rutina 2 · Antrenamentul B',
        descriere: 'Îndreptări, presă militară, tracțiuni + umeri, trapez și oblici.',
        items: [
          { exerciseId: 'indreptari-clasice', seturi: 3, repetari: 8, greutate: 45, pauzaSec: 180 },
          { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 22.5, pauzaSec: 180 },
          { exerciseId: 'tractiuni-bara', seturi: 3, pauzaSec: 150, notite: AMRAP },
          { exerciseId: 'ridicari-laterale', seturi: 3, repetari: 10, greutate: 5, pauzaSec: 60 },
          { exerciseId: 'face-pull', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
          { exerciseId: 'ridicari-umeri-haltera', seturi: 3, repetari: 10, greutate: 40, pauzaSec: 60 },
          { exerciseId: 'rasuciri-cablu-oblici', seturi: 3, repetari: 20, greutate: 10, pauzaSec: 60, notite: '20 de repetări pe fiecare parte.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'ppl',
    nume: 'Push / Pull / Legs (PPL)',
    subtitlu: 'Împingi, tragi, picioare. Cea mai populară împărțire din sălile lumii.',
    origine: 'Structură clasică de culturism, popularizată online (Reddit PPL, Metallicadpa)',
    descriere:
      'Împarți corpul după mișcare, nu după mușchi: într-o zi tot ce împingi (piept, umeri, triceps), în alta tot ce tragi (spate, biceps), în a treia picioarele. Fiecare mușchi apucă să se odihnească complet, iar antrenamentele rămân scurte și logice. Poți rula 3 zile pe săptămână (o rotație) sau 6 (două rotații) — începe cu 3.',
    nivel: 2,
    obiective: ['masa', 'forta'],
    frecventa: '3 zile pe săptămână (sau 6, când ai un an de sală în picioare)',
    durata: '55-70 min',
    saptamana: [
      'Varianta pentru începători (3 zile): Luni Împins · Miercuri Tras · Vineri Picioare.',
      'Varianta avansată (6 zile): Împins · Tras · Picioare · Împins · Tras · Picioare · liber.',
      'Nu sări peste ziua de picioare. Toată lumea glumește despre asta pentru că toată lumea o face.',
    ],
    progresie: [
      'Ține repetările în interval (ex. 8-12). Când atingi capătul de sus la toate seturile, adaugi 2,5 kg și cazi înapoi în josul intervalului.',
      'Primul exercițiu al fiecărei zile e cel greu — pe el urmărești progresul cu prioritate.',
    ],
    note: [
      'Cu 3 zile pe săptămână, fiecare mușchi e lucrat o dată — suficient la început, dar când vrei mai mult, adaugi a doua rotație, nu mai multe exerciții.',
      'Dacă ai timp limitat, taie ultimul accesoriu, nu exercițiul compus de la început.',
    ],
    etichete: ['PPL', 'split', 'masă'],
    antrenamente: [
      {
        id: 'push',
        nume: 'Împins (Push)',
        descriere: 'Piept, umeri, triceps — tot ce împinge greutatea departe de tine.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'impins-haltera-banca', seturi: 4, repetari: 8, greutate: 30, pauzaSec: 150 },
          { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 10, greutate: 20, pauzaSec: 120 },
          { exerciseId: 'impins-gantere-inclinat', seturi: 3, repetari: 10, greutate: 12, pauzaSec: 90 },
          { exerciseId: 'ridicari-laterale', seturi: 3, repetari: 15, greutate: 5, pauzaSec: 60 },
          { exerciseId: 'extensii-cablu-triceps', seturi: 3, repetari: 12, greutate: 15, pauzaSec: 60 },
          { exerciseId: 'flotari-diamant', seturi: 2, repetari: 10, pauzaSec: 60 },
        ],
      },
      {
        id: 'pull',
        nume: 'Tras (Pull)',
        descriere: 'Spate, biceps, umeri posteriori — tot ce trage greutatea spre tine.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'ramat-haltera-aplecat', seturi: 4, repetari: 8, greutate: 30, pauzaSec: 150 },
          { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 35, pauzaSec: 120 },
          { exerciseId: 'ramat-cablu-un-brat', seturi: 3, repetari: 12, greutate: 20, pauzaSec: 90 },
          { exerciseId: 'face-pull', seturi: 3, repetari: 15, greutate: 15, pauzaSec: 60 },
          { exerciseId: 'flexii-bara-z', seturi: 3, repetari: 12, greutate: 15, pauzaSec: 60 },
          { exerciseId: 'flexii-ciocan', seturi: 2, repetari: 12, greutate: 8, pauzaSec: 60 },
        ],
      },
      {
        id: 'legs',
        nume: 'Picioare (Legs)',
        descriere: 'Cvadricepși, fesieri, ischiogambieri, gambe. Ziua care contează cel mai mult.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'genuflexiuni-haltera', seturi: 4, repetari: 8, greutate: 35, pauzaSec: 180 },
          { exerciseId: 'indreptari-romanesti', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 120 },
          { exerciseId: 'presa-picioare', seturi: 3, repetari: 12, greutate: 60, pauzaSec: 120 },
          { exerciseId: 'flexii-ischiogambieri', seturi: 3, repetari: 12, greutate: 25, pauzaSec: 90 },
          { exerciseId: 'ridicari-gambe', seturi: 4, repetari: 15, greutate: 40, pauzaSec: 60 },
          { exerciseId: 'plank', seturi: 3, durataSec: 40, pauzaSec: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'upper-lower',
    nume: 'Upper / Lower (sus / jos)',
    subtitlu: 'Patru zile: două pentru partea de sus, două pentru partea de jos.',
    origine: 'Structura standard de intermediar, folosită de aproape toți antrenorii de forță',
    descriere:
      'Compromisul perfect între full body și split-urile de culturism: fiecare grupă e lucrată de două ori pe săptămână, dar antrenamentele rămân sub o oră. E următorul pas logic după câteva luni de full body, când vrei mai mult volum fără sesiuni interminabile.',
    nivel: 2,
    obiective: ['masa', 'forta'],
    frecventa: '4 zile pe săptămână',
    durata: '55-70 min',
    saptamana: [
      'Luni — Sus A',
      'Marți — Jos A',
      'Miercuri — liber',
      'Joi — Sus B',
      'Vineri — Jos B',
      'Weekend — liber (sau o plimbare lungă)',
    ],
    progresie: [
      'Zilele A sunt „grele": repetări puține (5-8), greutate mare, pauze lungi. Aici adaugi kilograme.',
      'Zilele B sunt „ușoare": repetări multe (10-15), greutate moderată. Aici adaugi repetări și calitate a execuției.',
    ],
    note: [
      'Dacă poți doar 3 zile într-o săptămână, rulează A-B-A / B-A-B în loc să înghesui totul.',
      'Zilele consecutive sus/jos sunt în regulă — lucrează mușchi diferiți.',
    ],
    etichete: ['upper/lower', 'split', 'intermediar'],
    antrenamente: [
      {
        id: 'sus-a',
        nume: 'Sus A · greu',
        descriere: 'Repetări puține, greutăți mari, pauze lungi.',
        items: [
          { exerciseId: 'impins-haltera-banca', seturi: 4, repetari: 6, greutate: 32.5, pauzaSec: 180 },
          { exerciseId: 'ramat-haltera-aplecat', seturi: 4, repetari: 6, greutate: 32.5, pauzaSec: 180 },
          { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 22.5, pauzaSec: 150 },
          { exerciseId: 'tractiuni-supinat', seturi: 3, pauzaSec: 120, notite: AMRAP },
          { exerciseId: 'extensii-triceps-frunte', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 75 },
          { exerciseId: 'flexii-bara-z', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 75 },
        ],
      },
      {
        id: 'jos-a',
        nume: 'Jos A · greu',
        descriere: 'Genuflexiuni și îndreptări. Ziua în care se construiește forța reală.',
        items: [
          { exerciseId: 'genuflexiuni-haltera', seturi: 4, repetari: 6, greutate: 40, pauzaSec: 180 },
          { exerciseId: 'indreptari-romanesti', seturi: 3, repetari: 8, greutate: 35, pauzaSec: 150 },
          { exerciseId: 'presa-picioare', seturi: 3, repetari: 10, greutate: 70, pauzaSec: 120 },
          { exerciseId: 'ridicari-gambe', seturi: 4, repetari: 12, greutate: 45, pauzaSec: 60 },
          { exerciseId: 'ridicari-picioare-atarnat', seturi: 3, repetari: 10, pauzaSec: 60 },
        ],
      },
      {
        id: 'sus-b',
        nume: 'Sus B · volum',
        descriere: 'Repetări multe, greutăți moderate, focus pe simțit mușchiul.',
        items: [
          { exerciseId: 'impins-gantere-inclinat', seturi: 4, repetari: 12, greutate: 12, pauzaSec: 90 },
          { exerciseId: 'tractiuni-helcometru', seturi: 4, repetari: 12, greutate: 35, pauzaSec: 90 },
          { exerciseId: 'presa-umeri-gantere', seturi: 3, repetari: 12, greutate: 10, pauzaSec: 75 },
          { exerciseId: 'ramat-cablu-asezat', seturi: 3, repetari: 12, greutate: 35, pauzaSec: 75 },
          { exerciseId: 'ridicari-laterale', seturi: 4, repetari: 15, greutate: 5, pauzaSec: 45 },
          { exerciseId: 'face-pull', seturi: 3, repetari: 15, greutate: 15, pauzaSec: 45 },
          { exerciseId: 'flexii-ciocan', seturi: 3, repetari: 12, greutate: 8, pauzaSec: 45 },
        ],
      },
      {
        id: 'jos-b',
        nume: 'Jos B · volum',
        descriere: 'Un picior odată, aparate, gambe. Mai puțină coloană, mai mult mușchi.',
        items: [
          { exerciseId: 'fandari-bulgaresti', seturi: 3, repetari: 12, greutate: 8, pauzaSec: 90, notite: '12 pe fiecare picior.' },
          { exerciseId: 'extensii-cvadriceps', seturi: 3, repetari: 15, greutate: 25, pauzaSec: 60 },
          { exerciseId: 'flexii-ischiogambieri', seturi: 3, repetari: 15, greutate: 25, pauzaSec: 60 },
          { exerciseId: 'hip-thrust', seturi: 3, repetari: 12, greutate: 40, pauzaSec: 90 },
          { exerciseId: 'gambe-asezat', seturi: 4, repetari: 15, greutate: 25, pauzaSec: 45 },
          { exerciseId: 'plank-lateral', seturi: 4, durataSec: 30, pauzaSec: 45, notite: 'Două seturi pe fiecare parte.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'wendler-531',
    nume: 'Wendler 5/3/1 (Boring But Big)',
    subtitlu: 'Patru ridicări mari, procente din maximul tău, progres lent și garantat.',
    origine: 'Jim Wendler, 2009 — „5/3/1: The Simplest and Most Effective Training System"',
    descriere:
      'Fiecare antrenament are o singură ridicare principală, executată cu procente calculate dintr-un „maxim de antrenament" (TM). Ciclul durează 4 săptămâni, iar la final adaugi puțin la TM și o iei de la capăt. Varianta „Boring But Big" adaugă 5 seturi × 10 repetări din același exercițiu, cu greutate mică — de acolo vine masa musculară. Progresul e deliberat lent: e programul care te ține sănătos și în creștere ani la rând, nu luni.',
    nivel: 3,
    obiective: ['forta', 'masa'],
    frecventa: '4 zile pe săptămână (sau 3, rotind ridicările)',
    durata: '50-65 min',
    saptamana: [
      'Ziua 1 — Presă militară · Ziua 2 — Îndreptări · Ziua 3 — Împins la piept · Ziua 4 — Genuflexiuni',
      'Săptămâna 1: 3 seturi × 5 repetări (65% · 75% · 85% din TM)',
      'Săptămâna 2: 3 seturi × 3 repetări (70% · 80% · 90% din TM)',
      'Săptămâna 3: 5 / 3 / 1 repetări (75% · 85% · 95% din TM)',
      'Săptămâna 4: deload ușor (40% · 50% · 60%), 5 repetări — obligatoriu, nu opțional.',
    ],
    progresie: [
      'TM (maximul de antrenament) = 90% din maximul tău real la o repetare. Dacă nu-l știi, folosește cea mai grea greutate cu care ai făcut 5 repetări curate.',
      'La finalul fiecărui ciclu de 4 săptămâni: +2,5 kg la TM pentru presă militară și împins, +5 kg pentru genuflexiuni și îndreptări.',
      'Ultimul set din fiecare zi se face „cât poți" (AMRAP) — dar lași mereu o repetare în rezervă.',
      'Nu poți face minimum de repetări cerute? Scazi TM cu 10% și continui. Programul e construit pentru asta.',
    ],
    note: [
      'Șablonul din aplicație e săptămâna 1 (3×5). Reglezi greutățile din editor la fiecare săptămână — procentele stau notate pe fiecare set.',
      'Regula de aur a lui Wendler: „start too light". Toată lumea începe prea greu și se blochează în luna a doua.',
      'Boring But Big = 5 seturi × 10 la 50-60% din TM, după ridicarea principală. Plictisitor. Foarte eficient.',
    ],
    etichete: ['5/3/1', 'forță', 'avansat', 'periodizare'],
    antrenamente: [
      {
        id: 'presa',
        nume: '5/3/1 · Presă militară',
        descriere: 'Ziua umerilor. Ridicarea care crește cel mai lent și te învață răbdarea.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'presa-umeri-haltera', seturi: 1, repetari: 5, greutate: 20, pauzaSec: 120, notite: 'Set 1 principal — 65% din TM.' },
          { exerciseId: 'presa-umeri-haltera', seturi: 1, repetari: 5, greutate: 25, pauzaSec: 150, notite: 'Set 2 principal — 75% din TM.' },
          { exerciseId: 'presa-umeri-haltera', seturi: 1, repetari: 5, greutate: 27.5, pauzaSec: 180, notite: 'Set 3 principal — 85% din TM, ultimul e AMRAP.' },
          { exerciseId: 'presa-umeri-haltera', seturi: 5, repetari: 10, greutate: 17.5, pauzaSec: 90, notite: 'Boring But Big — 50-60% din TM.' },
          { exerciseId: 'tractiuni-helcometru', seturi: 5, repetari: 10, greutate: 30, pauzaSec: 90, notite: 'Accesoriu de tras, echilibrează împinsul.' },
        ],
      },
      {
        id: 'indreptari',
        nume: '5/3/1 · Îndreptări',
        descriere: 'Ziua cea mai grea. Puține seturi, multă concentrare.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 50, pauzaSec: 150, notite: 'Set 1 principal — 65% din TM.' },
          { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 60, pauzaSec: 180, notite: 'Set 2 principal — 75% din TM.' },
          { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 65, pauzaSec: 210, notite: 'Set 3 principal — 85% din TM, ultimul e AMRAP.' },
          { exerciseId: 'indreptari-clasice', seturi: 5, repetari: 10, greutate: 40, pauzaSec: 120, notite: 'Boring But Big — 50-60% din TM. Formă impecabilă sau nimic.' },
          { exerciseId: 'ridicari-picioare-atarnat', seturi: 5, repetari: 10, pauzaSec: 60 },
        ],
      },
      {
        id: 'impins',
        nume: '5/3/1 · Împins la piept',
        descriere: 'Ziua preferată a tuturor. Nu o transforma în competiție.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'impins-haltera-banca', seturi: 1, repetari: 5, greutate: 30, pauzaSec: 120, notite: 'Set 1 principal — 65% din TM.' },
          { exerciseId: 'impins-haltera-banca', seturi: 1, repetari: 5, greutate: 35, pauzaSec: 150, notite: 'Set 2 principal — 75% din TM.' },
          { exerciseId: 'impins-haltera-banca', seturi: 1, repetari: 5, greutate: 40, pauzaSec: 180, notite: 'Set 3 principal — 85% din TM, ultimul e AMRAP.' },
          { exerciseId: 'impins-haltera-banca', seturi: 5, repetari: 10, greutate: 25, pauzaSec: 90, notite: 'Boring But Big — 50-60% din TM.' },
          { exerciseId: 'ramat-cablu-asezat', seturi: 5, repetari: 10, greutate: 35, pauzaSec: 90, notite: 'Accesoriu de tras, echilibrează împinsul.' },
        ],
      },
      {
        id: 'genuflexiuni',
        nume: '5/3/1 · Genuflexiuni',
        descriere: 'Ziua care te face să urci scările altfel.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
          { exerciseId: 'genuflexiuni-haltera', seturi: 1, repetari: 5, greutate: 40, pauzaSec: 150, notite: 'Set 1 principal — 65% din TM.' },
          { exerciseId: 'genuflexiuni-haltera', seturi: 1, repetari: 5, greutate: 45, pauzaSec: 180, notite: 'Set 2 principal — 75% din TM.' },
          { exerciseId: 'genuflexiuni-haltera', seturi: 1, repetari: 5, greutate: 52.5, pauzaSec: 210, notite: 'Set 3 principal — 85% din TM, ultimul e AMRAP.' },
          { exerciseId: 'genuflexiuni-haltera', seturi: 5, repetari: 10, greutate: 32.5, pauzaSec: 120, notite: 'Boring But Big — 50-60% din TM.' },
          { exerciseId: 'flexii-ischiogambieri', seturi: 5, repetari: 10, greutate: 25, pauzaSec: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'calistenice-start',
    nume: 'Calistenice de la zero',
    subtitlu: 'Doar greutatea corpului: acasă, în parc sau în sală. Fără nicio scuză.',
    origine: 'Progresie clasică de calistenice pentru începători',
    descriere:
      'Trei antrenamente pentru tot corpul, construite exclusiv pe greutatea corpului. Fiecare exercițiu are o variantă mai ușoară și una mai grea, așa că programul crește odată cu tine: începi cu flotări pe bancă și ramat orizontal și ajungi la tracțiuni și fondări. Ai nevoie de o bară fixă (parc, sală sau una montată în tocul ușii) și de un pic de spațiu pe podea.',
    nivel: 1,
    obiective: ['forta', 'slabit', 'rezistenta'],
    frecventa: '3 zile pe săptămână',
    durata: '35-50 min',
    saptamana: [
      'Luni — Antrenamentul A (împins)',
      'Miercuri — Antrenamentul B (tras)',
      'Vineri — Antrenamentul C (picioare + abdomen)',
      'În zilele libere: mers pe jos 30-40 de minute.',
    ],
    progresie: [
      'Nu adaugi kilograme, adaugi dificultate. Când faci 3 × 12 curate la o variantă, treci la următoarea mai grea.',
      'Scara la împins: flotări pe perete → pe bancă → pe step → pe sol → cu picioarele ridicate → fondări.',
      'Scara la tras: ramat orizontal cu bara sus → bara joasă → tracțiuni negative → tracțiuni supinate → tracțiuni pronate.',
      'Scara la picioare: genuflexiuni cu greutatea corpului → fandări → fandări bulgărești → genuflexiuni pe un picior.',
    ],
    note: [
      'Calistenicele construiesc forță reală, dar creșterea în masă e mai lentă decât cu greutăți. Ambele sunt valabile — alege ce faci constant.',
      'Poți face acest program 100% acasă, dacă ai o bară de tracțiuni. Fără ea, înlocuiește tracțiunile cu ramat la TRX sau cu bandă elastică.',
    ],
    etichete: ['calistenice', 'greutatea corpului', 'acasă', 'începător'],
    antrenamente: [
      {
        id: 'cal-a',
        nume: 'Calistenice A · Împins',
        descriere: 'Piept, umeri, triceps — plus abdomen la final.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 240, pauzaSec: 45 },
          { exerciseId: 'flotari-inclinate', seturi: 4, repetari: 10, pauzaSec: 90, notite: 'Coboară suportul pe măsură ce devine ușor.' },
          { exerciseId: 'fondari-paralele-libere', seturi: 3, repetari: 6, pauzaSec: 90, notite: 'Prea greu? Fondări pe bancă (dips-banca).' },
          { exerciseId: 'flotari-diamant', seturi: 3, repetari: 8, pauzaSec: 75 },
          { exerciseId: 'plank', seturi: 3, durataSec: 40, pauzaSec: 60 },
          { exerciseId: 'plank-lateral', seturi: 2, durataSec: 30, pauzaSec: 45, notite: 'Pe fiecare parte.' },
        ],
      },
      {
        id: 'cal-b',
        nume: 'Calistenice B · Tras',
        descriere: 'Spate și biceps. Aici se câștigă prima tracțiune.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 240, pauzaSec: 45 },
          { exerciseId: 'atarnare-bara', seturi: 3, durataSec: 30, pauzaSec: 60, notite: 'Încălzire pentru priză și umeri.' },
          { exerciseId: 'tractiuni-negative', seturi: 4, repetari: 4, pauzaSec: 120, notite: 'Coborâre în 5 secunde. Ai deja tracțiuni? Fă-le normale, AMRAP.' },
          { exerciseId: 'ramat-orizontal-bara', seturi: 4, repetari: 10, pauzaSec: 90 },
          { exerciseId: 'superman', seturi: 3, repetari: 12, pauzaSec: 45 },
          { exerciseId: 'birddog', seturi: 3, repetari: 10, pauzaSec: 45, notite: '10 pe fiecare parte.' },
        ],
      },
      {
        id: 'cal-c',
        nume: 'Calistenice C · Picioare & abdomen',
        descriere: 'Picioare, fesieri, trunchi. Zero echipament necesar.',
        items: [
          { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 240, pauzaSec: 45 },
          { exerciseId: 'genuflexiuni-corp', seturi: 4, repetari: 15, pauzaSec: 75 },
          { exerciseId: 'fandari-mers', seturi: 3, repetari: 12, pauzaSec: 75, notite: '12 pași pe fiecare picior.' },
          { exerciseId: 'urcari-banca', seturi: 3, repetari: 12, pauzaSec: 60, notite: '12 pe fiecare picior.' },
          { exerciseId: 'pod-fesier-sol', seturi: 3, repetari: 15, pauzaSec: 60 },
          { exerciseId: 'ridicari-picioare-atarnat', seturi: 3, repetari: 8, pauzaSec: 60, notite: 'Fără bară? Ridicări de picioare la sol.' },
          { exerciseId: 'catarare-frankie', seturi: 3, durataSec: 30, pauzaSec: 60 },
        ],
      },
    ],
  },
];

const programById = new Map(PROGRAME.map((p) => [p.id, p]));

export function getProgram(id: string): ProgramDef | undefined {
  return programById.get(id);
}

/** Numărul total de exerciții planificate într-un program (toate zilele). */
export function numaraExercitii(p: ProgramDef): number {
  return p.antrenamente.reduce((a, w) => a + w.items.length, 0);
}

/** Durata estimată a unui antrenament, în minute (seturi × (lucru + pauză)). */
export function minuteEstimate(items: ProgramDef['antrenamente'][number]['items']): number {
  return Math.round(items.reduce((a, i) => a + i.seturi * ((i.durataSec ?? 40) + i.pauzaSec), 0) / 60);
}
