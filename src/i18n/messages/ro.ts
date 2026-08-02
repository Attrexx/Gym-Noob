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

  // ── navigare și șasiu ───────────────────────────────────────────────
  'nav.azi': 'Azi',
  'nav.programe': 'Programe',
  'nav.sala': 'Sală',
  'nav.exercitii': 'Exerciții',
  'nav.maiMult': 'Mai mult',
  'nav.aria': 'Navigare principală',
  'nav.banner.aria': 'Sesiune în desfășurare',
  // două propoziții întregi: ordinea cuvintelor nu supraviețuiește traducerii
  'nav.banner.desfasurare': 'Sesiune în desfășurare — apasă pentru a reveni',
  'nav.banner.pauza': 'Sesiune în pauză — apasă pentru a reveni',

  'actualizare.disponibila': 'Versiune nouă disponibilă!',
  'actualizare.acum': 'Actualizează',
  'actualizare.maiTarziu': 'Mai târziu',

  // ── verbe și etichete comune ────────────────────────────────────────
  'comun.inchide': 'Închide',
  'comun.scade': 'Scade {ce}',
  'comun.creste': 'Crește {ce}',
  'comun.toate': 'Toate',
  'comun.toateLink': 'toate →',
  'comun.detalii': 'detalii →',

  // ── textele alternative ale desenelor (cititoarele de ecran) ────────
  'flexu.alt.salut': 'Flexu face cu mâna',
  'flexu.alt.explica': 'Flexu arată cu degetul',
  'flexu.alt.ganditor': 'Flexu se gândește',
  'flexu.alt.sarbatoreste': 'Flexu ridică pumnul de bucurie',
  'flexu.alt.avertizeaza': 'Flexu e alarmat',
  'flexu.alt.flex': 'Flexu ridică o gantere',
  'flexu.alt.obosit': 'Flexu trage din greu',
  'flexu.alt.hidratare': 'Flexu arată degetul mare',
  'sigla.alt': 'Gym Noob — începe încet, ajunge puternic',

  // ── „Mai mult" ──────────────────────────────────────────────────────
  'maiMult.supratitlu': 'restul aplicației',
  'maiMult.titlu': 'Mai mult',
  'maiMult.profil': 'profil: {nume}',
  'maiMult.statistici.nume': 'Statistici',
  'maiMult.statistici.desc': 'grafice, volume, recorduri, calendar',
  'maiMult.greutate.nume': 'Greutate & obiectiv',
  'maiMult.greutate.desc': 'cântăriri, țintă, import Freefit',
  'maiMult.realizari.nume': 'Realizări',
  'maiMult.realizari.desc': 'colecția de insigne',
  'maiMult.ghid.nume': 'Ghidul Noobului',
  'maiMult.ghid.desc': 'lecțiile esențiale, pe scurt',
  'maiMult.setari.nume': 'Setări',
  'maiMult.setari.desc': 'temă, sunete, profil, backup',

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

  // ── „Azi" (acasă) ───────────────────────────────────────────────────
  'acasa.salut': 'Salut, {nume}!',
  'acasa.streak': {
    one: '{n} săpt. consecutivă',
    few: '{n} săpt. consecutive',
    other: '{n} de săpt. consecutive',
  },
  'acasa.continua': 'Continuă sesiunea',
  'acasa.incaOSesiune': 'Încă o sesiune azi? 😎',
  'acasa.incepe': 'Începe antrenamentul',
  'acasa.buget.supratitlu': 'calorii',
  'acasa.buget.titlu': 'Bugetul zilei',
  'acasa.buget.consumi': 'consumi',
  'acasa.buget.consumiSub': 'kcal/zi estimat',
  'acasa.buget.arse': 'arse la sală',
  'acasa.buget.arseSub': 'azi',
  'acasa.buget.potiManca': 'poți mânca',
  'acasa.buget.potiMancaSub': 'kcal azi',
  'acasa.tinta.text': 'Ținta: {tinta} kg în ritm de {ritm} kg/săpt. (deficit {deficit} kcal/zi).',
  'acasa.tinta.maiAi': {
    one: 'Mai ai ~{n} săptămână.',
    few: 'Mai ai ~{n} săptămâni.',
    other: 'Mai ai ~{n} de săptămâni.',
  },
  'acasa.tinta.atins': 'Obiectiv atins! 🎉',
  'acasa.tinta.gol': 'Nu ai un obiectiv activ — setează unul din pagina Greutate.',
  'acasa.greutateCurenta': 'greutatea curentă',
  'acasa.panaLaTinta': 'până la țintă',
  'acasa.tintaKg': 'țintă {kg} kg',
  'acasa.sfat.supratitlu': 'Flexu zice',
  'acasa.sfat.titlu': 'Sfatul zilei',
  'acasa.progres.supratitlu': 'progres',
  'acasa.progres.titlu': 'Săptămâna asta',
  'acasa.recomandate': '{facute} din {total} antrenamente recomandate',
  // inițialele zilelor, de luni la duminică; o limbă poate folosi alte litere
  'acasa.zi.luni': 'L',
  'acasa.zi.marti': 'Ma',
  'acasa.zi.miercuri': 'Mi',
  'acasa.zi.joi': 'J',
  'acasa.zi.vineri': 'V',
  'acasa.zi.sambata': 'S',
  'acasa.zi.duminica': 'D',

  // ── biblioteca de exerciții ─────────────────────────────────────────
  'biblioteca.supratitlu': 'biblioteca de mișcări',
  'biblioteca.titlu': 'Exerciții',
  // `{ce}` primește deja numărul scris în litere („98 de exerciții")
  'biblioteca.descriere': '{ce} cu sfaturi de formă, utilizare a aparatelor și demonstrații.',
  'biblioteca.cauta.placeholder': '🔍 Caută exercițiu sau aparat…',
  'biblioteca.cauta.aria': 'Caută exercițiu',
  'biblioteca.filtru.categorie': 'categorie',
  'biblioteca.filtru.grupa': 'grupă musculară',
  'biblioteca.gol': 'Nimic găsit. Încearcă alt termen, altă grupă sau altă categorie.',
  'biblioteca.anim.aria': 'Demonstrație animată a mișcării',
  'biblioteca.diagrama.aria': 'Grupele musculare lucrate',
  // etichetele desenate pe diagramă — scurte, că au 11px pe ecran
  'biblioteca.diagrama.fata': 'FAȚĂ',
  'biblioteca.diagrama.spate': 'SPATE',

  // ── pagina unui exercițiu ───────────────────────────────────────────
  'exercitiu.inexistent': 'Exercițiul nu există.',
  'exercitiu.inapoiLung': '← Înapoi la bibliotecă',
  'exercitiu.inapoi': '← Biblioteca',
  'exercitiu.forma.supratitlu': 'pas cu pas',
  'exercitiu.forma.titlu': 'Execuția corectă',
  'exercitiu.utilizare.supratitlu': 'aparatul',
  'exercitiu.utilizare.titlu': 'Cum îl folosești',
  'exercitiu.greseli.supratitlu': 'atenție',
  'exercitiu.greseli.titlu': 'Greșeli frecvente',
  'exercitiu.ponturi.supratitlu': 'de la Flexu',
  'exercitiu.ponturi.titlu': 'Ponturi',
  'exercitiu.variante.supratitlu': 'mai ușor, mai greu, altfel',
  'exercitiu.variante.titlu': 'Variante înrudite',
  'exercitiu.recorduri.supratitlu': 'ale tale',
  'exercitiu.recorduri.titlu': 'Recorduri personale',
  'exercitiu.seturiTotal': {
    one: '{n} set înregistrat la acest exercițiu, în total.',
    few: '{n} seturi înregistrate la acest exercițiu, în total.',
    other: '{n} de seturi înregistrate la acest exercițiu, în total.',
  },

  // ── ghidul și articolele ────────────────────────────────────────────
  'ghid.supratitlu': 'școala de sală',
  'ghid.titlu': 'Ghidul Noobului',
  'articol.inexistent': 'Articolul nu există.',
  'articol.inapoiScurt': '← Ghid',
  'articol.inapoi': '← Ghidul Noobului',
  'articol.supratitlu': 'lecție de la Flexu',

  // ── pagina de realizări (numele insignelor sunt mai jos) ────────────
  'realizari.supratitlu': 'colecția de medalii',
  'realizari.titlu': 'Realizări',
  'realizari.progres': '{nr} din {total} deblocate',
  'realizari.gol': 'Prima insignă te așteaptă la prima sesiune terminată. Nu e departe — hai la sală! 💪',
  'realizari.cat.inceput': 'Începuturi',
  'realizari.cat.consecventa': 'Consecvență',
  'realizari.cat.volum': 'Volum și calorii',
  'realizari.cat.greutate': 'Greutate corporală',
  'realizari.cat.hidratare': 'Hidratare',
  'realizari.cat.recorduri': 'Recorduri',

  // ── setări ──────────────────────────────────────────────────────────
  'setari.limba.supratitlu': 'în ce limbă',
  'setari.limba.titlu': 'Limba',
  'setari.limba.auto': 'Automat',
  'setari.limba.explicatie':
    '„Automat" ia limba telefonului, cu româna ca variantă de rezervă. Se schimbă tot: meniurile, exercițiile, ghidul și vocea din căști.',
  'setari.vocale.confirmare': 'Indicațiile vocale sunt active. Spor la antrenament!',

  // ── meta ────────────────────────────────────────────────────────────
  'meta.descriere':
    'Ghidul complet al începătorului absolut la sală. Antrenamente, jurnale, calorii și statistici — totul în română.',
};
