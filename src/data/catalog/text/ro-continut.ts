import type { ArticleId, ProgramId } from '../ids';
import type { TextArticol, TextProgram, TextSablonStart } from './types';
import type { ProgramGoal } from '@/data/types';

/**
 * Textul românesc al programelor celebre, al ghidului și al sfaturilor.
 *
 * Mutat verbatim din programs.ts / articles.ts / tips.ts / starterTemplates.ts.
 * Convenția din articole se păstrează: rândurile care încep cu «• » devin
 * liste la afișare, deci marcatorul trebuie să rămână în text.
 */

export const PROGRAME_RO: Record<ProgramId, TextProgram> = {
  'full-body-3x': {
    nume: 'Full Body 3x pe săptămână',
    subtitlu: 'Tot corpul, de trei ori pe săptămână. Programul cu care ar trebui să înceapă absolut oricine.',
    origine: 'Structura clasică de începător (rudă cu Starting Strength și StrongLifts 5×5)',
    descriere: 'Două antrenamente, A și B, alternate: A-B-A într-o săptămână, B-A-B în următoarea. Fiecare grupă musculară e lucrată de trei ori pe săptămână — exact frecvența la care un începător crește cel mai repede. Puține exerciții, toate compuse, nimic exotic. Plictisitor? Da. Funcționează? Extrem.',
    frecventa: '3 zile pe săptămână, cu o zi liberă între ele',
    durata: '45-60 min',
    etichete: [
      'începător',
      'full body',
      'forță',
    ],
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
    antrenamente: [
      {
        nume: 'Full Body A',
        descriere: 'Genuflexiuni + împins. Ziua în care înveți să te lași jos și să împingi în sus.',
        notite: [
          undefined,
          'Începe cu bara goală (20 kg) până tehnica e curată.',
          undefined,
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Full Body B',
        descriere: 'Îndreptări + presă militară. Ziua în care înveți să ridici de jos și să împingi deasupra capului.',
        notite: [
          undefined,
          undefined,
          undefined,
          'Un singur set greu e suficient. Îndreptările obosesc mai mult decât par.',
          undefined,
        ],
      },
    ],
  },
  'powerbuilding-periodizat': {
    nume: 'Powerbuilding periodizat (Rutina 1 + Rutina 2)',
    subtitlu: 'Două rutine full body care se rotesc: 2 săptămâni pe hipertrofie, 6 pe forță, apoi de la capăt.',
    origine: 'Program clasic de forum, în două blocuri complementare',
    descriere: 'Cel mai bun program de antrenament e cel pe care îl faci constant. Ca începător, ai nevoie de tot corpul de trei ori pe săptămână — iar programul ăsta îți dă două moduri de a face asta. Rutina 1 e orientată pe hipertrofie: fiecare grupă musculară e lovită de trei ori pe săptămână, stimul berechet pentru creșterea în volum. Rutina 2 e orientată pe forță: volum mai mare pe ridicările mari, dar mai puțin volum total per grupă, ca să crești constant la compuse fără să te epuizezi cu accesorii. Împreună formează un program periodizat de powerbuilding.',
    frecventa: '3 zile pe săptămână, cu o zi de pauză între sesiuni',
    durata: '60-75 min',
    etichete: [
      'powerbuilding',
      'full body',
      'periodizare',
    ],
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
    antrenamente: [
      {
        nume: 'Rutina 1 · Antrenamentul A',
        descriere: 'Îndreptări, presă militară, împins la piept + brațe, gambe și abdomen.',
        faza: 'Faza 1 · Hipertrofie (2 săptămâni)',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Rutina 1 · Antrenamentul B',
        descriere: 'Genuflexiuni, ramat, împins înclinat + brațe, umeri și oblici.',
        faza: 'Faza 1 · Hipertrofie (2 săptămâni)',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          '20 de repetări pe fiecare parte.',
        ],
      },
      {
        nume: 'Rutina 1 · Antrenamentul C',
        descriere: 'Un picior odată, priză îngustă, gantere + spate și abdomen greu.',
        faza: 'Faza 1 · Hipertrofie (2 săptămâni)',
        notite: [
          '8 repetări pe fiecare picior.',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          'Prea greu? Ridicări de genunchi la paralele sau la sol.',
        ],
      },
      {
        nume: 'Rutina 2 · Antrenamentul A',
        descriere: 'Genuflexiuni, ramat, împins + tracțiuni și fondări la maxim.',
        faza: 'Faza 2 · Forță (6 săptămâni)',
        notite: [
          undefined,
          undefined,
          undefined,
          'AMRAP — cât poți, cu formă bună. Oprește-te când mai ai o repetare curată în rezervă.',
          'AMRAP — cât poți, cu formă bună. Oprește-te când mai ai o repetare curată în rezervă.',
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Rutina 2 · Antrenamentul B',
        descriere: 'Îndreptări, presă militară, tracțiuni + umeri, trapez și oblici.',
        faza: 'Faza 2 · Forță (6 săptămâni)',
        notite: [
          undefined,
          undefined,
          'AMRAP — cât poți, cu formă bună. Oprește-te când mai ai o repetare curată în rezervă.',
          undefined,
          undefined,
          undefined,
          '20 de repetări pe fiecare parte.',
        ],
      },
    ],
  },
  'ppl': {
    nume: 'Push / Pull / Legs (PPL)',
    subtitlu: 'Împingi, tragi, picioare. Cea mai populară împărțire din sălile lumii.',
    origine: 'Structură clasică de culturism, popularizată online (Reddit PPL, Metallicadpa)',
    descriere: 'Împarți corpul după mișcare, nu după mușchi: într-o zi tot ce împingi (piept, umeri, triceps), în alta tot ce tragi (spate, biceps), în a treia picioarele. Fiecare mușchi apucă să se odihnească complet, iar antrenamentele rămân scurte și logice. Poți rula 3 zile pe săptămână (o rotație) sau 6 (două rotații) — începe cu 3.',
    frecventa: '3 zile pe săptămână (sau 6, când ai un an de sală în picioare)',
    durata: '55-70 min',
    etichete: [
      'PPL',
      'split',
      'masă',
    ],
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
    antrenamente: [
      {
        nume: 'Împins (Push)',
        descriere: 'Piept, umeri, triceps — tot ce împinge greutatea departe de tine.',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Tras (Pull)',
        descriere: 'Spate, biceps, umeri posteriori — tot ce trage greutatea spre tine.',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Picioare (Legs)',
        descriere: 'Cvadricepși, fesieri, ischiogambieri, gambe. Ziua care contează cel mai mult.',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
    ],
  },
  'upper-lower': {
    nume: 'Upper / Lower (sus / jos)',
    subtitlu: 'Patru zile: două pentru partea de sus, două pentru partea de jos.',
    origine: 'Structura standard de intermediar, folosită de aproape toți antrenorii de forță',
    descriere: 'Compromisul perfect între full body și split-urile de culturism: fiecare grupă e lucrată de două ori pe săptămână, dar antrenamentele rămân sub o oră. E următorul pas logic după câteva luni de full body, când vrei mai mult volum fără sesiuni interminabile.',
    frecventa: '4 zile pe săptămână',
    durata: '55-70 min',
    etichete: [
      'upper/lower',
      'split',
      'intermediar',
    ],
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
    antrenamente: [
      {
        nume: 'Sus A · greu',
        descriere: 'Repetări puține, greutăți mari, pauze lungi.',
        notite: [
          undefined,
          undefined,
          undefined,
          'AMRAP — cât poți, cu formă bună. Oprește-te când mai ai o repetare curată în rezervă.',
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Jos A · greu',
        descriere: 'Genuflexiuni și îndreptări. Ziua în care se construiește forța reală.',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Sus B · volum',
        descriere: 'Repetări multe, greutăți moderate, focus pe simțit mușchiul.',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Jos B · volum',
        descriere: 'Un picior odată, aparate, gambe. Mai puțină coloană, mai mult mușchi.',
        notite: [
          '12 pe fiecare picior.',
          undefined,
          undefined,
          undefined,
          undefined,
          'Două seturi pe fiecare parte.',
        ],
      },
    ],
  },
  'wendler-531': {
    nume: 'Wendler 5/3/1 (Boring But Big)',
    subtitlu: 'Patru ridicări mari, procente din maximul tău, progres lent și garantat.',
    origine: 'Jim Wendler, 2009 — „5/3/1: The Simplest and Most Effective Training System"',
    descriere: 'Fiecare antrenament are o singură ridicare principală, executată cu procente calculate dintr-un „maxim de antrenament" (TM). Ciclul durează 4 săptămâni, iar la final adaugi puțin la TM și o iei de la capăt. Varianta „Boring But Big" adaugă 5 seturi × 10 repetări din același exercițiu, cu greutate mică — de acolo vine masa musculară. Progresul e deliberat lent: e programul care te ține sănătos și în creștere ani la rând, nu luni.',
    frecventa: '4 zile pe săptămână (sau 3, rotind ridicările)',
    durata: '50-65 min',
    etichete: [
      '5/3/1',
      'forță',
      'avansat',
      'periodizare',
    ],
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
    antrenamente: [
      {
        nume: '5/3/1 · Presă militară',
        descriere: 'Ziua umerilor. Ridicarea care crește cel mai lent și te învață răbdarea.',
        notite: [
          undefined,
          'Set 1 principal — 65% din TM.',
          'Set 2 principal — 75% din TM.',
          'Set 3 principal — 85% din TM, ultimul e AMRAP.',
          'Boring But Big — 50-60% din TM.',
          'Accesoriu de tras, echilibrează împinsul.',
        ],
      },
      {
        nume: '5/3/1 · Îndreptări',
        descriere: 'Ziua cea mai grea. Puține seturi, multă concentrare.',
        notite: [
          undefined,
          'Set 1 principal — 65% din TM.',
          'Set 2 principal — 75% din TM.',
          'Set 3 principal — 85% din TM, ultimul e AMRAP.',
          'Boring But Big — 50-60% din TM. Formă impecabilă sau nimic.',
          undefined,
        ],
      },
      {
        nume: '5/3/1 · Împins la piept',
        descriere: 'Ziua preferată a tuturor. Nu o transforma în competiție.',
        notite: [
          undefined,
          'Set 1 principal — 65% din TM.',
          'Set 2 principal — 75% din TM.',
          'Set 3 principal — 85% din TM, ultimul e AMRAP.',
          'Boring But Big — 50-60% din TM.',
          'Accesoriu de tras, echilibrează împinsul.',
        ],
      },
      {
        nume: '5/3/1 · Genuflexiuni',
        descriere: 'Ziua care te face să urci scările altfel.',
        notite: [
          undefined,
          'Set 1 principal — 65% din TM.',
          'Set 2 principal — 75% din TM.',
          'Set 3 principal — 85% din TM, ultimul e AMRAP.',
          'Boring But Big — 50-60% din TM.',
          undefined,
        ],
      },
    ],
  },
  'calistenice-start': {
    nume: 'Calistenice de la zero',
    subtitlu: 'Doar greutatea corpului: acasă, în parc sau în sală. Fără nicio scuză.',
    origine: 'Progresie clasică de calistenice pentru începători',
    descriere: 'Trei antrenamente pentru tot corpul, construite exclusiv pe greutatea corpului. Fiecare exercițiu are o variantă mai ușoară și una mai grea, așa că programul crește odată cu tine: începi cu flotări pe bancă și ramat orizontal și ajungi la tracțiuni și fondări. Ai nevoie de o bară fixă (parc, sală sau una montată în tocul ușii) și de un pic de spațiu pe podea.',
    frecventa: '3 zile pe săptămână',
    durata: '35-50 min',
    etichete: [
      'calistenice',
      'greutatea corpului',
      'acasă',
      'începător',
    ],
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
    antrenamente: [
      {
        nume: 'Calistenice A · Împins',
        descriere: 'Piept, umeri, triceps — plus abdomen la final.',
        notite: [
          undefined,
          'Coboară suportul pe măsură ce devine ușor.',
          'Prea greu? Fondări pe bancă (dips-banca).',
          undefined,
          undefined,
          'Pe fiecare parte.',
        ],
      },
      {
        nume: 'Calistenice B · Tras',
        descriere: 'Spate și biceps. Aici se câștigă prima tracțiune.',
        notite: [
          undefined,
          'Încălzire pentru priză și umeri.',
          'Coborâre în 5 secunde. Ai deja tracțiuni? Fă-le normale, AMRAP.',
          undefined,
          undefined,
          '10 pe fiecare parte.',
        ],
      },
      {
        nume: 'Calistenice C · Picioare & abdomen',
        descriere: 'Picioare, fesieri, trunchi. Zero echipament necesar.',
        notite: [
          undefined,
          undefined,
          '12 pași pe fiecare picior.',
          '12 pe fiecare picior.',
          undefined,
          'Fără bară? Ridicări de picioare la sol.',
          undefined,
        ],
      },
    ],
  },
};

export const OBIECTIVE_RO: Record<ProgramGoal, string> = {
  forta: 'Forță',
  masa: 'Masă musculară',
  slabit: 'Slăbit',
  rezistenta: 'Rezistență',
  tehnica: 'Tehnică',
};

export const ARTICOLE_RO: Record<ArticleId, TextArticol> = {
  'eticheta': {
    titlu: 'Eticheta la sală — regulile nescrise',
    rezumat: 'Ce fac veteranii fără să se gândească și ce așteaptă (politicos) de la tine.',
    continut: [
      'Vestea bună: nimeni nu se uită la tine. Serios. Toți sunt ocupați cu propriul antrenament. Vestea și mai bună: dacă respecți câteva reguli simple, ești deja „de-al casei".',
      '• Pune greutățile la loc. Regula numărul 1, 2 și 3. Discurile pe suport, ganterele la raft, în ordinea mărimii.',
      '• Prosopul pe bancă și șterge aparatul după tine dacă ai transpirat.',
      '• Nu ocupa un aparat cât stai pe telefon. Setul, pauza rezonabilă, apoi eliberezi.',
      '• Poți cere „lucrez și eu între seturi?" — se cheamă „working in" și e complet normal.',
      '• Nu da sfaturi necerute și nu te speria dacă primești unele — mulțumești și mergi mai departe.',
      '• Cere asigurare la împins („Îmi dai o asigurare, te rog?") — nimeni normal nu refuză.',
      'Atât. Restul e antrenament.',
    ],
  },
  'incalzire': {
    titlu: 'Încălzirea — 10 minute care te feresc de pauze de 3 luni',
    rezumat: 'De ce, cât și cum te încălzești corect înainte de orice.',
    continut: [
      'Mușchiul rece e ca guma de mestecat scoasă din frigider: trage de el și se rupe. Aceeași gumă, încălzită, se întinde. Fizica ta funcționează la fel.',
      '• 5-8 minute de cardio ușor (mers înclinat, bicicletă) — până transpiri fin.',
      '• Mișcări articulare: rotiri de umeri, brațe, șolduri, genunchi — 10 pe sens.',
      '• La fiecare exercițiu de forță, primul set e „de încălzire": jumătate din greutatea de lucru, 12-15 repetări.',
      'Setul de încălzire nu se pune la socoteală și nu e opțional. E biletul de intrare al articulațiilor tale la antrenament.',
      'Stretchingul static lung (întinderi ținute 30+ secunde) e pentru DUPĂ antrenament, nu înainte — înainte reduce temporar forța.',
    ],
  },
  'febra': {
    titlu: 'Febra musculară — de ce te doare și când să te îngrijorezi',
    rezumat: 'DOMS pe numele ei tehnic. E normală, trece, și nu, nu e acid lactic.',
    continut: [
      'A doua zi după primul antrenament vei coborî scările ca un robot ruginit. Felicitări, e complet normal — se numește DOMS (durere musculară cu debut întârziat) și apare la 24-72 de ore după efort nou.',
      'Cauza: micro-leziuni în fibrele musculare (partea din proces care te face mai puternic), NU acidul lactic — acela dispare în câteva ore.',
      '• Ce ajută: mișcare ușoară (plimbare, bicicletă lejeră), somn, apă, proteine.',
      '• Ce nu ajută: statul nemișcat pe canapea (paradoxal, e mai rău).',
      '• Poți antrena alte grupe fără probleme — dacă te dor picioarele, lucrezi spatele.',
      'Semnal de alarmă (mergi la medic): durere ascuțită într-un punct precis apărută ÎN timpul exercițiului, umflătură vizibilă, sau urină foarte închisă la culoare după efort extrem.',
      'După 2-3 săptămâni de antrenament regulat, febra musculară aproape dispare. Nu înseamnă că nu mai progresezi — înseamnă că te-ai adaptat.',
    ],
  },
  'supraincarcarea': {
    titlu: 'Supraîncărcarea progresivă — singurul secret real',
    rezumat: 'Cum crește mușchiul: cere-i de fiecare dată puțin mai mult.',
    continut: [
      'Mușchii cresc dintr-un singur motiv: îi pui să facă ceva puțin mai greu decât data trecută, iar ei se adaptează. Asta e toată știința. Restul sunt detalii.',
      '„Puțin mai mult" poate însemna, în ordinea preferată:',
      '• o repetare în plus la aceeași greutate;',
      '• 1-2,5 kg în plus când atingi capătul intervalului de repetări;',
      '• un set în plus;',
      '• o execuție mai curată sau o coborâre mai lentă.',
      'De aici și rolul jurnalului din aplicația asta: nu poți depăși ce nu ții minte. Fiecare set notat e o țintă pentru data viitoare.',
      'Regula practică: alegi un interval (de exemplu 8-12 repetări). Când poți face 12 curate la toate seturile, crești greutatea și cobori la 8. Repetă până ești bătrân.',
      'Atenție: progresul liniar nedefinit e matematic imposibil. Săptămânile fără progres sunt normale — contează trendul pe luni.',
    ],
  },
  'nutritie': {
    titlu: 'Nutriția pentru slăbit + mușchi — pe scurt și fără secte',
    rezumat: 'Deficit caloric moderat, proteine multe, răbdare. Restul e marketing.',
    continut: [
      'Slăbitul e aritmetică: mănânci mai puține calorii decât consumi, corpul completează diferența din rezerve. Aplicația îți calculează bugetul zilnic exact pentru asta.',
      'Ca să pierzi grăsime și NU mușchi, două lucruri sunt obligatorii:',
      '• Proteine: ~1,6-2 g per kg de greutate corporală pe zi (la 100 kg: 160-200 g). Carne, pește, ouă, lactate, leguminoase.',
      '• Antrenament de forță: semnalul care îi spune corpului „mușchiul e folosit, arde altceva".',
      '• Deficit moderat (0,25-0,5 kg/săptămână la început; până la 1 kg dacă e mult de dat jos). Dietele extreme pierd mușchi și se termină cu efect yo-yo.',
      'Da, poți construi mușchi și slăbi simultan ca începător — se numește „recompoziție corporală" și e superputerea primului an. Profită de ea.',
      'Cântarul minte pe termen scurt (apă, glicogen, sare). Cântărește-te des, dar judecă doar media pe 7 zile — exact ce afișează graficul din aplicație.',
    ],
  },
  'hidratare': {
    titlu: 'Hidratarea — de ce aplicația te bate la cap cu apa',
    rezumat: 'Cât să bei, când, și ce se întâmplă dacă nu.',
    continut: [
      'La 2% deshidratare, forța și concentrarea scad măsurabil. La sală transpiri mai mult decât crezi — de aici contorul de apă pe sesiune.',
      '• Peste zi: ~33 ml per kg corp (la 100 kg ≈ 3,3 litri, incluzând ce vine din mâncare).',
      '• La sală: câteva înghițituri (150-250 ml) la fiecare 15-20 de minute, nu jumătate de litru dintr-o dată.',
      '• Urina galben-pai = ești bine. Galben închis = bea mai mult.',
      'Băuturile izotonice au sens abia peste ~60-90 de minute de efort intens sau la transpirație abundentă. Pentru o oră de sală, apa e tot ce trebuie.',
      'Truc practic: umple sticla ÎNAINTE să începi antrenamentul și propune-ți să fie goală la final. Butonul de +250 ml din sesiune face restul.',
    ],
  },
  'somn': {
    titlu: 'Somnul — sala construiește, patul finalizează',
    rezumat: 'Mușchii cresc când dormi. La propriu.',
    continut: [
      'Antrenamentul dă semnalul, mâncarea dă materialul, dar construcția propriu-zisă se întâmplă în somn — acolo se secretă hormonul de creștere și se repară fibrele.',
      '• 7-9 ore. Sub 6 ore cronic: forță mai mică, foame hormonală mai mare (grelina crește), rezultate mai lente.',
      '• Un studiu celebru: la aceeași dietă, grupul care dormea 5,5 ore a pierdut cu 55% mai puțină grăsime (și mai mult mușchi) decât cel cu 8,5 ore.',
      '• Antrenamentul târziu seara poate întârzia adormirea la unii — dacă e cazul tău, mută sesiunile mai devreme.',
      'Dacă trebuie să alegi între o oră de somn și o oră de sală când ești praf: alege somnul. Sala de mâine va fi de două ori mai bună.',
    ],
  },
  'primele-saptamani': {
    titlu: 'Primele 4 săptămâni — la ce să te aștepți',
    rezumat: 'Calendarul realist al începutului, ca să nu te sperii și să nu te lași.',
    continut: [
      'Săptămâna 1: totul e greu, totul doare a doua zi, cifrele din aplicație par mici. Perfect normal. Obiectivul unic: să apari de 3 ori.',
      'Săptămâna 2: febra musculară scade dramatic. Greutățile de săptămâna trecută par deja mai ușoare — e sistemul nervos care învață, nu (încă) mușchi noi.',
      'Săptămâna 3-4: primele progrese vizibile în jurnal — mai multe repetări, primele kg în plus pe aparate. Cântarul poate fi haotic (retenție de apă de la antrenament) — ignoră-l, urmărește media.',
      'Luna 2-3: hainele se așază altfel, energia zilnică crește, iar la sală începi să te simți „acasă".',
      '• Regula de aur a începutului: consecvența bate intensitatea. 3 antrenamente medii pe săptămână, luni la rând, bat orice săptămână eroică urmată de abandon.',
      'Și dacă ratezi o săptămână? Nimic pierdut — te întorci pur și simplu. Streak-ul se reia, mușchii au memorie (la propriu, e un mecanism celular real).',
    ],
  },
};

export const SABLOANE_START_RO: TextSablonStart[] = [
  {
    nume: 'Prima zi la sală',
    descriere: 'Tur de acomodare: puțin din toate, greutăți mici, zero rușine. Scopul e să pleci zâmbind, nu distrus.',
    etichete: [
      'începător',
      'full body',
    ],
  },
  {
    nume: 'Full Body A',
    descriere: 'Jumătatea A a programului de 3 zile/săptămână (A-B-A, apoi B-A-B). Împins + picioare dominant.',
    etichete: [
      'începător',
      'full body',
      'forță',
    ],
  },
  {
    nume: 'Full Body B',
    descriere: 'Jumătatea B: tras + lanț posterior dominant. Alternează cu A.',
    etichete: [
      'începător',
      'full body',
      'forță',
    ],
  },
  {
    nume: 'Cardio + Core',
    descriere: 'Zi de ars calorii și trunchi solid — ideală între zilele de forță sau când vrei ceva mai lejer.',
    etichete: [
      'cardio',
      'abdomen',
      'slăbit',
    ],
  },
];

export const SFATURI_RO: string[] = [
  'Cea mai grea greutate din sală e ușa de la intrare. Ai ridicat-o deja azi?',
  'Nu te compara cu tipul de lângă tine. Compară-te cu tine cel de acum o lună — pentru asta ai jurnalul.',
  'Formă întâi, greutate după. Un set curat cu 10 kg bate trei seturi urâte cu 20.',
  'Mușchii nu știu ce zi e. Dar obiceiurile da — antrenează-te în aceleași zile în fiecare săptămână.',
  'Apa e cel mai subestimat supliment. Și singurul gratuit.',
  'O repetare în plus față de data trecută = progres. Atât de simplu e.',
  'Pauzele dintre seturi nu sunt timp pierdut — acolo se reîncarcă mușchiul. Respectă-le.',
  'Febra musculară nu e o medalie. Progresul din jurnal e medalia.',
  'Ziua în care n-ai chef e ziua care contează dublu. Fă măcar jumătate de antrenament.',
  'Cântarul e un bârfitor cu memorie scurtă. Media pe 7 zile e prietenul serios.',
  'Somnul e a doua sesiune de antrenament. Cine doarme 8 ore crește și în somn.',
  'Nu există „prea încet". Există doar înainte și oprit.',
  'Setul de încălzire e biletul de intrare al articulațiilor. Nu intra fără bilet.',
  'Proteina la fiecare masă principală — mușchiul se construiește din cărămizi, nu din promisiuni.',
  'Lasă telefonul între seturi. Pauza de 90 de secunde devine 5 minute fără să simți.',
  'Veteranii din sală au fost toți, fără excepție, noobi. Unii chiar mai stângaci decât tine.',
  'Scrie-ți seturile imediat după ce le faci. Memoria minte, jurnalul nu.',
  'Un antrenament mediocru făcut bate un antrenament perfect planificat și amânat.',
];

export const INCURAJARI_SET_RO: string[] = [
  'Set înregistrat. Așa se construiește!',
  'Încă unul la colecție. Bravo!',
  'Bifat! Mușchii au primit mesajul.',
  'Solid! Pauză și mergem mai departe.',
  'Asta da execuție. Următorul!',
];

export const INCURAJARI_FINAL_RO: string[] = [
  'Sesiune încheiată! Corpul tău îți mulțumește (mâine poate cu febră musculară, dar tot mulțumire e).',
  'Gata! Ai făcut ce 90% dintre oameni doar plănuiesc.',
  'Antrenament în sac! Acum mâncare bună și somn — acolo se termină treaba începută azi.',
];
