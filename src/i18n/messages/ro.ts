/**
 * SURSA DE ADEVĂR pentru toate textele din interfață.
 *
 * Convenții:
 * - chei plate, cu puncte: `<zonă>.<secțiune>.<rol>` (vezi docs/CONTEXT.md).
 *   Zonele sunt numele rutelor românești: sesiune, setari, biblioteca, realizari, ghid…
 *   Rolurile vin dintr-un set închis: titlu, supratitlu, descriere, eticheta, buton,
 *   placeholder, aria, gol, eroare, confirmare, succes.
 * - interpolare cu `{nume}`; numerele trec automat prin `nr()`, deci
 *   `{greutate} kg` iese „9,5 kg" în română și „9.5 kg" în engleză.
 * - plural: obiect `{ one, few, other }` selectat după `p.n` cu `Intl.PluralRules`.
 *   În română `other` e forma cu „de": 20 DE exerciții.
 * - text bogat: `<0>…</0>` marchează un slot; implicit devine `<b>`. Vezi `rich.tsx`.
 *
 * Cheile sunt în română intenționat — restul codului folosește identificatori
 * românești (greutate, sesiune, realizari), vezi CLAUDE.md.
 */

export const ro = {
  // ── numere de lucruri (plural) ──────────────────────────────────────
  'comun.exercitii': {
    one: '{n} exercițiu',
    few: '{n} exerciții',
    other: '{n} de exerciții',
  },
  'comun.antrenamente': {
    one: '{n} antrenament',
    few: '{n} antrenamente',
    other: '{n} de antrenamente',
  },
  'comun.programeCelebre': {
    one: '{n} program celebru',
    few: '{n} programe celebre',
    other: '{n} de programe celebre',
  },

  // ── timp relativ („data trecută") ───────────────────────────────────
  'timp.aziMaiDevreme': 'azi mai devreme',

  // ── rezumatele de o linie (src/i18n/descrieri.ts) ───────────────────
  // simbolurile SI (kg, km, W, %) stau în cod: sunt aceleași în orice limbă
  'descriere.repetari': { one: '{n} rep.', few: '{n} rep.', other: '{n} rep.' },
  'descriere.maxim': 'maxim',

  // ── etichete venite din domeniu (clasificări, nu propoziții) ────────
  'domeniu.imc.subponderal': 'Subponderal',
  'domeniu.imc.normal': 'Greutate normală',
  'domeniu.imc.supraponderal': 'Supraponderal',
  'domeniu.imc.obezitate1': 'Obezitate gr. I',
  'domeniu.imc.obezitate2': 'Obezitate gr. II',
  'domeniu.imc.obezitate3': 'Obezitate gr. III',

  'domeniu.activitate.sedentar': 'Sedentar (birou, fără mișcare)',
  'domeniu.activitate.usor': 'Ușor activ (plimbări, 1-2 antrenamente/săpt.)',
  'domeniu.activitate.moderat': 'Moderat activ (3-5 antrenamente/săpt.)',
  'domeniu.activitate.activ': 'Activ (muncă fizică sau sport zilnic)',
  'domeniu.activitate.foarte_activ': 'Foarte activ (muncă grea + sport)',

  'domeniu.pr.greutate': 'Greutate maximă',
  'domeniu.pr.volum_set': 'Volum maxim pe set',
  'domeniu.pr.repetari': 'Cele mai multe repetări',
  'domeniu.pr.1rm': '1RM estimat',

  'domeniu.aparat.banda': 'Bandă de alergare',
  'domeniu.aparat.rower': 'Rower',
  'domeniu.aparat.bicicleta': 'Bicicletă',
  'domeniu.aparat.eliptica': 'Eliptică',
  'domeniu.aparat.stepper': 'Stepper',

  // ── sugestiile din sesiune ──────────────────────────────────────────
  // `{grupa}` și `{anti}` primesc deja numele tradus al grupei musculare
  'sugestii.antagonist': 'Ai lucrat {seturi} seturi de {grupa}, dar deloc {anti}. Echilibrul contează!',
  'sugestii.neatins': 'Grupa „{grupa}" nu a mai fost lucrată de ceva vreme.',
  'sugestii.finalAbdomen': 'Final de sesiune — un pic de abdomen și ai închis ziua frumos.',
  'sugestii.finalCardio': '10 minute de cardio ușor la final ajută recuperarea și mai arde ceva calorii.',
  'sugestii.incalzire': 'Începe cu 5-10 minute de încălzire pe cardio ușor.',

  // ── realizări (id-urile și emoji-urile stau în src/domain/achievements.ts) ──
  'realizari.prima-sesiune.nume': 'Primul pas',
  'realizari.prima-sesiune.descriere': 'Ai terminat prima sesiune de antrenament. De aici începe totul!',
  'realizari.trei-sesiuni.nume': 'Nu a fost un accident',
  'realizari.trei-sesiuni.descriere': '3 sesiuni terminate. Începe să semene a obicei.',
  'realizari.zece-sesiuni.nume': 'Abonat serios',
  'realizari.zece-sesiuni.descriere': '10 sesiuni terminate. Recepția te salută deja.',
  'realizari.douazecicinci-sesiuni.nume': 'Mobilier al sălii',
  'realizari.douazecicinci-sesiuni.descriere': '25 de sesiuni. Faci parte din peisaj.',
  'realizari.cincizeci-sesiuni.nume': 'Jumătate de sută',
  'realizari.cincizeci-sesiuni.descriere': '50 de sesiuni terminate. Cine mai e noob acum?',
  'realizari.o-suta-sesiuni.nume': 'Centurion',
  'realizari.o-suta-sesiuni.descriere': '100 de sesiuni. Legendă locală.',
  'realizari.streak-2.nume': 'Două la rând',
  'realizari.streak-2.descriere': '2 săptămâni consecutive cu antrenamente.',
  'realizari.streak-4.nume': 'Luna de foc',
  'realizari.streak-4.descriere': '4 săptămâni consecutive cu antrenamente.',
  'realizari.streak-12.nume': 'Trimestrul de oțel',
  'realizari.streak-12.descriere': '12 săptămâni consecutive. Disciplina bate motivația.',
  'realizari.zile-30.nume': '30 de zile la sală',
  'realizari.zile-30.descriere': '30 de zile distincte cu antrenament.',
  'realizari.ore-24.nume': 'O zi din viață',
  'realizari.ore-24.descriere': '24 de ore cumulate de antrenament activ.',
  'realizari.volum-1t.nume': 'Prima tonă',
  'realizari.volum-1t.descriere': 'Ai ridicat în total 1.000 kg. O tonă întreagă!',
  'realizari.volum-10t.nume': 'Camionagiu',
  'realizari.volum-10t.descriere': '10 tone ridicate în total. Cam cât un camion.',
  'realizari.volum-100t.nume': 'Locomotiva',
  'realizari.volum-100t.descriere': '100 de tone ridicate în total. Șșș-șșș.',
  'realizari.kcal-1000.nume': 'Cuptor pornit',
  'realizari.kcal-1000.descriere': '1.000 kcal arse la antrenamente.',
  'realizari.kcal-10000.nume': 'Furnal',
  'realizari.kcal-10000.descriere': '10.000 kcal arse la antrenamente.',
  'realizari.explorator.nume': 'Explorator',
  'realizari.explorator.descriere': 'Ai încercat 15 exerciții diferite.',
  'realizari.slabit-1.nume': 'Primul kilogram',
  'realizari.slabit-1.descriere': 'Primul kilogram dat jos. S-a urnit trenul!',
  'realizari.slabit-5.nume': 'Minus 5',
  'realizari.slabit-5.descriere': '5 kg date jos. Se vede deja.',
  'realizari.slabit-10.nume': 'Minus 10',
  'realizari.slabit-10.descriere': '10 kg date jos. Garderobă nouă?',
  'realizari.apa-prima.nume': 'Buretele',
  'realizari.apa-prima.descriere': 'Prima sesiune cu ținta de apă atinsă.',
  'realizari.apa-10.nume': 'Fântâna arteziană',
  'realizari.apa-10.descriere': '10 sesiuni cu ținta de apă atinsă.',
  'realizari.apa-total.nume': 'Lacul Vidraru',
  'realizari.apa-total.descriere': '20 de litri de apă băuți la sală, în total.',
  'realizari.pr-primul.nume': 'Recordman',
  'realizari.pr-primul.descriere': 'Primul record personal doborât.',
  'realizari.pr-10.nume': 'Vânător de recorduri',
  'realizari.pr-10.descriere': '10 recorduri personale doborâte.',
  'realizari.pr-25.nume': 'Mașina de PR-uri',
  'realizari.pr-25.descriere': '25 de recorduri personale doborâte.',

  // ── meta ────────────────────────────────────────────────────────────
  'meta.descriere':
    'Ghidul complet al începătorului absolut la sală. Antrenamente, jurnale, calorii și statistici — totul în română.',
};
