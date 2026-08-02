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
  'comun.inapoi': 'Înapoi',
  'comun.maiDeparte': 'Mai departe',
  'comun.salveaza': 'Salvează',
  'comun.anuleaza': 'Anulează',
  'comun.optional': 'opțional',
  'comun.optScurt': 'opț.',
  // câmpuri care apar identic în onboarding, setări și pagina de greutate
  'comun.inaltime': 'Înălțime (cm)',
  'comun.talie': 'Talie (cm)',
  'comun.gat': 'Gât (cm)',
  'comun.sold': 'Șold (cm)',
  'comun.greutateTinta': 'Greutatea țintă (kg)',
  'comun.saptamani': {
    one: '{n} săptămână',
    few: '{n} săptămâni',
    other: '{n} de săptămâni',
  },
  'comun.seturi': { one: '{n} set', few: '{n} seturi', other: '{n} de seturi' },
  'comun.sesiuni': { one: '{n} sesiune', few: '{n} sesiuni', other: '{n} de sesiuni' },

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

  // ── planurile mele + programele aplicației (o pagină, două rafturi) ─
  'planuri.supratitlu': 'planuri și programe',
  'planuri.titlu': 'Programe',
  'planuri.descriere':
    'Ale tale sunt cele pe care le-ai creat, importat sau salvate după o sesiune. Ale aplicației sunt {ce}, gata de copiat.',
  'planuri.tab.mele': '📋 Ale mele',
  'planuri.tab.aplicatie': '📖 Ale aplicației',
  'planuri.nou': '+ Plan nou',
  'planuri.deLaFlexu': 'de la Flexu',
  'planuri.copie': '{nume} (copie)',
  'planuri.incepe': '▶ Începe',
  'planuri.editeaza': 'Editează',
  'planuri.copiaza': 'Copiază',
  'planuri.gol':
    'Niciun plan salvat încă. Fă unul, ia-l pe-al aplicației din tabul de alături, sau pornește o sesiune în <0>mod liber</0> și salveaz-o la final. Poți începe și din <1>biblioteca de exerciții</1>.',

  'programe.intro':
    'Cel mai bun program e cel pe care <0>chiar îl faci</0>, săptămână de săptămână. Nu-l alege pe cel mai complicat — alege-l pe cel care îți intră în program și rămâi la el trei luni.',

  // ── pagina unui program celebru ─────────────────────────────────────
  'program.inexistent': 'Programul nu există.',
  'program.inapoi': 'Înapoi la programe',
  'program.supratitlu': 'program · {nivel}',
  'program.durataPe': '{durata} pe antrenament',
  'program.saptamana': 'Săptămâna arată așa',
  'program.progresie': 'Cum crești greutățile',
  'program.note': 'De reținut',
  'program.adauga': {
    one: '+ Adaugă antrenamentul la mine',
    few: '+ Adaugă cele {n} antrenamente la mine',
    other: '+ Adaugă cele {n} de antrenamente la mine',
  },
  'program.reimprospateaza': {
    one: '↻ Reîmprospătează antrenamentul',
    few: '↻ Reîmprospătează cele {n} antrenamente',
    other: '↻ Reîmprospătează cele {n} de antrenamente',
  },
  'program.gata': 'Gata! ',
  'program.gasesti':
    'Le găsești în <0>Planuri</0>. Le poți edita fără să strici programul original.',
  'program.avertisment':
    'Greutățile din șabloane sunt doar un punct de plecare pentru cineva care începe. La prima sesiune reglează-le: ultimele 1-2 repetări trebuie să fie grele, dar curate.',

  // ── rezumatul unui set dintr-un plan („3 × 8 @ 40 kg · pauză 2:30") ─
  'plan.set.linie': '{seturi} × {cantitate}{greutate} · pauză {pauza}',
  'plan.set.amrap': 'maxim (AMRAP)',

  // ── editorul de planuri ─────────────────────────────────────────────
  'editor.supratitlu.nou': 'plan nou',
  'editor.supratitlu.editare': 'editare',
  'editor.titlu.nou': 'Antrenament nou',
  'editor.nume.eticheta': 'Numele antrenamentului',
  'editor.nume.placeholder': 'ex. Ziua de împins',
  'editor.descriere.eticheta': 'Descriere (opțional)',
  'editor.descriere.placeholder': 'scopul planului…',
  'editor.item.seturi': { one: '{n} set', few: '{n} seturi', other: '{n} de seturi' },
  'editor.item.pauza': 'pauză {sec}s',
  'editor.item.tempo': 'tempo',
  'editor.regleaza': 'Reglează',
  'editor.mutaSus': 'Mută mai sus',
  'editor.mutaJos': 'Mută mai jos',
  'editor.stergeExercitiu': 'Șterge exercițiul',
  'editor.adaugaExercitiu': '+ Adaugă exercițiu',
  'editor.salveaza': '💾 Salvează antrenamentul',
  'editor.sterge': 'Șterge',
  'editor.stergeConfirmare': 'Ștergi definitiv acest antrenament?',
  'editor.adaugaInPlan': '+ Adaugă în plan',
  'editor.gata': 'Gata',

  // ── foaia de alegere a exercițiului ─────────────────────────────────
  'alege.titlu': 'Alege exercițiul',
  'alege.actiune': '▶ Începe exercițiul',
  'alege.altExercitiu': '← Alt exercițiu',
  'alege.flexuPropune': 'Flexu propune',
  'alege.cauta.placeholder': 'Caută exercițiul…',
  'alege.gol': 'Nimic găsit. Încearcă alt termen sau altă categorie.',

  // ── parametrii unui exercițiu (steppere) ────────────────────────────
  'parametri.seturi': 'Seturi',
  'parametri.repetari': 'Repetări',
  'parametri.amrap': 'Repetări: maxim (AMRAP)',
  'parametri.puneNumar': 'Pune un număr',
  'parametri.faAmrap': 'Fă-l „cât poți" (AMRAP)',
  'parametri.greutate': 'Greutate',
  'parametri.durata': 'Durată (minute)',
  'parametri.viteza': 'Viteză de pornire',
  'parametri.inclinatie': 'Înclinație de pornire',
  'parametri.pauza': 'Pauză între seturi',
  'parametri.tempo.eticheta': 'Cadență (tempo) — opțional',
  'parametri.tempo.fara': 'fără',
  'parametri.tempo.normal': '2-0-1 (normal)',
  'parametri.tempo.controlat': '3-1-2 (controlat)',
  'parametri.tempo.lent': '4-2-1 (lent, intens)',
  'parametri.notita.eticheta': 'Notiță (apare în sală) — opțional',
  'parametri.notita.placeholder': 'ex. 75% din maxim · 8 pe fiecare picior',

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

  // ── onboarding ──────────────────────────────────────────────────────
  'onboarding.pasul': 'Pasul {pas} din {total}',
  'onboarding.noob': 'Noob',
  'onboarding.intro.supratitlu': 'Ghidul complet al începătorului absolut',
  // „totul în română" e o afirmație despre limbă: fiecare limbă își spune a ei
  'onboarding.intro.text':
    '<0>Eu sunt Flexu</0> — am fost cel mai noob noob din sală, așa că știu exact prin ce treci. Antrenamente, jurnal de greutăți, calorii și încurajări: totul în română, totul pe telefonul tău. Cont opțional, doar dacă vrei datele pe mai multe dispozitive.',
  'onboarding.intro.bula': 'Nu trebuie să fii perfect. Trebuie doar să începi!',
  'onboarding.intro.start': 'Să începem! 💪',
  'onboarding.intro.altProfil': 'Ai mai folosit aplicația pe alt profil? <0>Alege profilul</0>',
  'onboarding.intro.amCont': 'Ai deja cont de sincronizare? <0>Intră și adu-ți datele</0>',

  'onboarding.pas1.supratitlu': 'pasul 1 din 4 · fă cunoștință',
  'onboarding.pas1.titlu': 'Cine ești?',
  'onboarding.pas1.flexu':
    'Datele astea rămân doar pe telefonul tău — le folosesc pentru calorii și recomandări.',
  'onboarding.pas1.nume': 'Cum îți spunem?',
  'onboarding.pas1.numePlaceholder': 'Numele tău',
  'onboarding.pas1.sex': 'Sex (pentru formulele de calorii)',
  'onboarding.pas1.masculin': 'Masculin',
  'onboarding.pas1.feminin': 'Feminin',
  'onboarding.pas1.dataNasterii': 'Data nașterii',

  'onboarding.pas2.supratitlu': 'pasul 2 din 4 · punctul de plecare',
  'onboarding.pas2.titlu': 'Corpul de start',
  'onboarding.pas2.flexu':
    'Măsurătorile cu banda (opționale) îmi permit să estimez procentul de grăsime — un indicator mult mai util decât cântarul singur.',
  'onboarding.pas2.greutate': 'Greutatea actuală (kg)',
  'onboarding.pas2.activitate': 'Cât de activ ești în afara sălii?',
  'onboarding.pas2.grasime': 'Grăsime corporală estimată (formula US Navy): <0>{procent}%</0>',

  'onboarding.pas3.supratitlu': 'pasul 3 din 4 · destinația',
  'onboarding.pas3.titlu': 'Obiectivul',
  // cifra din text are separatorul zecimal al limbii — în engleză „0.5 kg"
  'onboarding.pas3.flexu':
    'Recomand un ritm de <0>0,5 kg pe săptămână</0> — suficient de rapid să se vadă, suficient de blând să păstrezi mușchii și să nu suferi de foame.',
  'onboarding.pas3.ritm': 'Ritm de slăbire: {ritm} kg / săptămână',
  'onboarding.pas3.relaxat': 'relaxat',
  'onboarding.pas3.hotarat': 'hotărât',
  'onboarding.pas3.eta':
    '🗓️ La ritmul ales, ajungi la <0>{tinta} kg</0> în aproximativ <1>{saptamani}</1> ({cand}).',
  'onboarding.pas3.tintaPreaMare':
    'Ținta e egală sau peste greutatea actuală — setează o țintă mai mică pentru slăbit.',

  'onboarding.pas4.supratitlu': 'pasul 4 din 4 · gata de treabă',
  'onboarding.pas4.titlu': 'Planul tău',
  'onboarding.pas4.imc': 'IMC',
  'onboarding.pas4.bmr': 'BMR (kcal)',
  'onboarding.pas4.bmrSub': 'arse doar existând',
  'onboarding.pas4.tdee': 'TDEE (kcal)',
  'onboarding.pas4.tdeeSub': 'consum zilnic total',
  'onboarding.pas4.buget': 'Buget zilnic',
  'onboarding.pas4.bugetSub': 'kcal, în zi fără sală',
  'onboarding.pas4.flexu':
    '<0>{nume}, planul e gata!</0> Ți-am pregătit și 4 antrenamente de start, croite pentru început de drum. În zilele cu sală, bugetul de calorii crește automat cu ce arzi. Ne vedem la aparate!',
  'onboarding.pas4.pregatesc': 'Pregătesc totul…',
  'onboarding.pas4.creeaza': 'Creează profilul 🚀',

  // ── login pe un dispozitiv nou ──────────────────────────────────────
  'login.supratitlu': 'bine ai revenit',
  'login.titlu': 'Adu-ți datele',
  'login.flexu':
    'Ai deja cont? Intră și îți aduc tot ghiozdanul: profil, antrenamente, istoric, realizări. Ca și cum n-ai fi schimbat telefonul.',
  'login.parolaPlaceholder': 'parola ta',
  'login.contGol':
    'Contul există, dar încă n-are date. Fă onboarding-ul normal, apoi leagă contul din Setări.',
  'login.aduc': 'Aduc datele…',
  'login.intra': 'Intră în cont',

  // ── lista de profiluri ──────────────────────────────────────────────
  'profiluri.titlu': 'Profiluri',
  'profiluri.activ': 'activ',
  'profiluri.creat': 'creat {cand}',
  'profiluri.gol': 'Niciun profil încă.',
  'profiluri.nou': '+ Profil nou',

  // ── greutate & obiectiv ─────────────────────────────────────────────
  'greutate.supratitlu': 'cântarul, îmblânzit',
  'greutate.titlu': 'Greutate & obiectiv',
  'greutate.acum': 'acum',
  'greutate.slabite': 'slăbite',
  'greutate.deLaMaxim': 'de la maximul de {kg} kg',
  'greutate.imc': 'IMC',
  'greutate.grasime': 'grăsime est.',
  'greutate.grasimeGol': 'adaugă măsurători',
  'greutate.grasimeFormula': 'formula US Navy',
  'greutate.cantarireNoua': '+ Cântărire nouă',
  'greutate.obiectiv.supratitlu': 'ținta',
  'greutate.obiectiv.titlu': 'Obiectivul activ',
  // două propoziții întregi, nu una cu coada schimbată
  'greutate.obiectiv.cuRest':
    '🎯 <0>{tinta} kg</0> în ritm de <1>{ritm} kg/săpt.</1> — încă <2>{rest} kg</2>, aproximativ <3>{saptamani}</3>.',
  'greutate.obiectiv.atins':
    '🎯 <0>{tinta} kg</0> în ritm de <1>{ritm} kg/săpt.</1> — obiectiv atins! 🎉 Setează unul nou.',
  'greutate.obiectiv.schimba': 'Schimbă obiectivul',
  'greutate.obiectiv.gol': 'Niciun obiectiv activ.',
  'greutate.obiectiv.seteaza': 'Setează un obiectiv',
  'greutate.flexu.progres':
    'De la <0>{maxim} kg</0> la <1>{acum} kg</1> — se mișcă treaba! Ține ritmul, nu graba.',
  'greutate.flexu.sfat':
    'Cântărește-te la aceeași oră (ideal dimineața) și urmărește media pe 7 zile din Statistici, nu fiecare zi în parte.',
  'greutate.istoric.supratitlu': 'istoric',
  'greutate.istoric.titlu': 'Cântăriri',
  'greutate.sursa.freefit': 'import Freefit',
  'greutate.sursa.manual': 'manual',
  'greutate.import.supratitlu': 'date externe',
  'greutate.import.titlu': 'Import din Freefit',
  'greutate.import.explicatie':
    'Folosești un cântar Bluetooth cu aplicația Freefit? Istoricul de greutate poate fi adus aici dintr-un fișier CSV exportat.',
  'greutate.import.buton': '📥 Importă istoric',
  'greutate.import.modal': 'Import Freefit',
  'greutate.adauga.titlu': 'Cântărire nouă',
  'greutate.adauga.kg': 'Greutate (kg)',
  'greutate.adauga.kgPlaceholder': 'ex. 92,4',
  'greutate.editObiectiv.titlu': 'Obiectivul de greutate',
  'greutate.editObiectiv.ritm': 'Ritm: {ritm} kg / săptămână',
  'greutate.editObiectiv.estimare': 'Estimare: ~{saptamani} până la țintă.',
  'greutate.editObiectiv.salveaza': 'Salvează obiectivul',

  // ── importul din Freefit ────────────────────────────────────────────
  'freefit.eroareColoane':
    'Nu am găsit coloane de dată + greutate în fișier. Verifică exportul (trebuie să fie CSV).',
  'freefit.succes': '✅ Import reușit: <0>{n}</0> cântăriri noi adăugate.',
  'freefit.succesCuDubluri':
    '✅ Import reușit: <0>{n}</0> cântăriri noi adăugate ({dubluri} erau deja înregistrate).',
  'freefit.super': 'Super!',
  'freefit.cum': 'Cum scoți datele din Freefit:',
  'freefit.pas1': 'Deschide Freefit → profil / setări → caută „Export date" sau „Istoric măsurători".',
  'freefit.pas2': 'Alege formatul CSV (sau Excel salvat ca CSV) și trimite-ți fișierul (email, Drive etc.).',
  'freefit.pas3': 'Alege fișierul aici — totul se procesează local, nimic nu pleacă de pe telefon.',
  'freefit.oriceCsv':
    'Merge cu orice CSV care are o coloană de dată și una de greutate (kg) — inclusiv exporturi din alte aplicații de cântar.',
  'freefit.amGasit': 'Am găsit <0>{n}</0> cântăriri, între {prima} și {ultima}.',
  'freefit.siIncaN': '…și încă {n}',
  'freefit.importa': 'Importă',
  'freefit.altFisier': 'Alt fișier',

  // ── statistici ──────────────────────────────────────────────────────
  'statistici.supratitlu': 'cifrele nu mint',
  'statistici.titlu': 'Statistici',
  'statistici.tot': 'Tot',
  'statistici.zile': '{n} zile',
  'statistici.sesiuni': 'sesiuni',
  'statistici.timpLaSala': 'timp la sală',
  'statistici.lucrat': '{procent}% lucrat',
  'statistici.timpActiv': 'timp activ',
  'statistici.pauze': 'pauze {timp}',
  'statistici.kcalArse': 'kcal arse',
  'statistici.volum': 'volum ridicat',
  'statistici.seturi': 'seturi',
  'statistici.apa': 'apă la sală',
  'statistici.jurnal.supratitlu': 'jurnal',
  'statistici.jurnal.titlu': 'Ultimele sesiuni',
  'statistici.sesiuneLibera': 'sesiune liberă',
  'statistici.activPauza': 'activ {activ} · pauză {pauza}',
  'statistici.greutate.supratitlu': 'trend',
  'statistici.greutate.titlu': 'Greutatea corporală',
  'statistici.greutate.masurat': 'măsurat',
  'statistici.greutate.medie': 'medie 7 zile',
  'statistici.greutate.nota':
    'Linia groasă = media pe 7 zile. Pe ea o crezi, nu cântarul de dimineață.',
  'statistici.volum.supratitlu': 'muncă depusă',
  'statistici.volum.titlu': 'Volum pe săptămână',
  'statistici.volum.serie': 'kg ridicate',
  'statistici.echilibru.supratitlu': 'echilibru',
  'statistici.echilibru.titlu': 'Seturi pe grupă musculară',
  'statistici.echilibru.nota':
    'Forma rotundă = antrenament echilibrat. Vârfurile singuratice = grupe favorizate.',
  'statistici.forta.supratitlu': 'progresie',
  'statistici.forta.titlu': 'Forța estimată (1RM)',
  'statistici.forta.serie': '1RM estimat (kg)',
  'statistici.forta.gol': 'Înregistrează măcar două sesiuni cu acest exercițiu pentru grafic.',
  'statistici.sesiune.supratitlu': 'pe sesiune',
  'statistici.sesiune.titlu': 'Calorii, apă și timp',
  'statistici.sesiune.apa': 'apă (ml)',
  'statistici.sesiune.minute': 'minute la sală',
  'statistici.calendar.supratitlu': 'consecvență',
  'statistici.calendar.titlu': 'Calendarul antrenamentelor',
  'statistici.export.supratitlu': 'datele tale',
  'statistici.export.titlu': 'Export',
  'statistici.export.explicatie':
    'Descarcă jurnalul complet al seturilor pentru Excel sau orice altă analiză.',
  'statistici.export.buton': '⬇ Export CSV ({ce})',
  'statistici.total': 'Total istoric: {sesiuni} · {tone} tone ridicate.',

  // ── cont și sincronizare ────────────────────────────────────────────
  'cont.supratitlu': 'pe mai multe dispozitive',
  'cont.titlu': 'Cont și sincronizare',
  'cont.email': 'Email',
  'cont.emailPlaceholder': 'tu@exemplu.ro',
  'cont.parola': 'Parolă',
  'cont.parolaPlaceholder': 'minim 8 caractere',
  'cont.parolaScurta': 'Parola trebuie să aibă minim 8 caractere.',
  'cont.intru': 'Intru…',
  'cont.intraDinNou': 'Intră din nou',
  'cont.oClipa': 'O clipă…',
  'cont.creeaza': 'Creează cont',
  'cont.amDejaCont': 'Am deja cont',
  'cont.nuUitaParola': 'Nu uita parola — deocamdată n-avem resetare prin email (serios, n-o uita).',
  'cont.nelegat':
    'Vrei datele pe două telefoane? Fă-ți un cont și car eu ghiozdanul cu date între ele. Fără cont, totul rămâne doar aici — ca până acum.',
  'cont.sincronizez': 'Car ganterele cu date… o secundă.',
  'cont.sincronizat': '✅ Sincronizat',
  'cont.contEste': 'Cont: <0>{email}</0>',
  'cont.ultimaSincronizare': 'Ultima sincronizare: {cand}',
  'cont.spatiu': 'Spațiu folosit: {folosit} MB din {total} MB',
  'cont.sincronizeazaAcum': '🔄 Sincronizează acum',
  'cont.deconecteaza': 'Deconectează',
  'cont.deconecteazaExplicatie': '„Deconectează" doar dezleagă contul — datele rămân pe telefon.',
  'cont.stergeCloud': 'Șterge contul din cloud',
  'cont.sesiuneExpirata': 'Sesiunea a expirat — intră din nou și continuăm de unde am rămas.',
  'cont.cotaPlina': 'Contul e plin (25 MB de gains!). Sincronizarea ia o pauză — scrie-i lui Attrexx.',
  'cont.eroareGenerica':
    'Nu ajung la server acum. Nicio grijă — totul e salvat aici și trimit eu când prind semnal.',
  'cont.maiIncearca': '🔄 Mai încearcă',
  'cont.conflictScurt': 'Contul are alt set de date — alege în fereastra de mai jos.',
  'cont.conflict.titlu': 'Ho! Două seturi de date',
  'cont.conflict.explicatie':
    'Contul <0>{email}</0> are deja un set de date, și telefonul ăsta are altul. Ca la sală: nu punem două discuri pe același cârlig. Pe care îl păstrăm?',
  'cont.conflict.cloud': '☁️ Folosesc varianta din cloud',
  'cont.conflict.cloudExplicatie':
    'Profilul din cloud devine activ. Profilul local NU se șterge — rămâne în lista de profiluri, nelegat.',
  'cont.conflict.local': '📱 Trimit varianta locală',
  'cont.conflict.localExplicatie': 'Datele din cloud se înlocuiesc cu ce e pe telefonul ăsta.',
  'cont.conflict.backup': '⬇ Descarcă întâi un backup',
  'cont.conflict.renunt': 'Renunț',
  'cont.stergere.titlu': 'Ștergi contul din cloud?',
  'cont.stergere.explicatie':
    'Se șterg contul și TOATE datele din cloud. Datele de pe telefon rămân neatinse. Confirmă cu parola.',
  'cont.stergere.parola': 'Parola contului',
  'cont.stergere.sterg': 'Șterg…',
  'cont.stergere.confirma': 'Da, șterge tot din cloud',

  // ── ceas și aparate (BLE) ───────────────────────────────────────────
  'aparate.supratitlu': 'senzori',
  'aparate.titlu': 'Ceas și aparate',
  'aparate.faraBle':
    'Browserul acesta nu are Web Bluetooth, așa că nu pot citi nici pulsul de la ceas, nici datele de pe aparate. Pe iPhone nu există deloc — pe Android, folosește Chrome. Restul aplicației merge normal.',
  'aparate.pulsAuto': '♥ Caută ceasul automat la începutul sesiunii',
  'aparate.aparatAuto': '🔌 Caută aparatul de cardio automat',
  'aparate.tinuteMinte': 'Ținute minte: {lista}',
  'aparate.silentios':
    'Browserul tău îmi permite să mă reconectez singur — nu mai trebuie să apeși nimic.',
  'aparate.cuAtingere':
    'Browserul cere o atingere ca să aleagă dispozitivul, așa că îți pun un buton mare în antetul sesiunii. Odată conectat, dacă pierd semnalul mă reconectez singur.',
  'aparate.scaner.titlu': '🔍 Scanează un aparat',
  'aparate.scaner.explicatie':
    'Dacă un aparat nu se conectează, pornește-i Bluetooth-ul și scanează-l de aici. Îți spun exact ce servicii expune, iar de acolo știm dacă putem citi datele lui.',
  'aparate.scaner.scanez': 'Scanez…',
  'aparate.scaner.scaneaza': '🔍 Scanează',
  'aparate.scaner.uuid': 'UUID-uri suplimentare (opțional)',
  'aparate.scaner.uuidPlaceholder': 'ex. 0000fff0-0000-1000-8000-00805f9b34fb',
  'aparate.scaner.uuidExplicatie':
    'Important de știut: browserul îmi arată <0>doar serviciile pe care le cer dinainte</0>. Un serviciu proprietar necunoscut nu apare până nu-i știm UUID-ul — de aceea există câmpul ăsta.',
  'aparate.scaner.copiat': '✅ Copiat',
  'aparate.scaner.copiaza': '📋 Copiază raportul',
  'aparate.scaner.eroareCopiere': 'Nu am putut copia. Selectează textul de mai jos manual.',
  'aparate.scaner.cauti':
    'Cauți <0>0x1826</0> (Fitness Machine) — dacă apare, aparatul vorbește standardul și îl putem citi.',

  // ── setări ──────────────────────────────────────────────────────────
  'setari.supratitlu': 'reglaje fine',
  'setari.titlu': 'Setări',
  'setari.tema.supratitlu': 'aspect',
  'setari.tema.titlu': 'Temă',
  'setari.tema.zi': '☀️ Zi',
  'setari.tema.noapte': '🌙 Noapte',
  'setari.tema.auto': '🌗 Auto',
  'setari.tema.explicatie':
    '„Noapte" = sală întunecată cu accente galbene — pentru antrenamentele târzii.',
  'setari.sunete.supratitlu': 'în sesiune',
  'setari.sunete.titlu': 'Sunete și indicații',
  'setari.sunete.bipuri': '🔔 Sunete (bipuri, cronometre)',
  'setari.sunete.vocale': '🗣️ Indicații vocale în căști',
  'setari.sunete.vibratii': '📳 Vibrații',
  'setari.sunete.sugestii': '💡 Sugestii automate de exerciții',
  'setari.sunete.economizor': '🌘 Economizor de ecran în sesiune',
  'setari.sunete.economizorExplicatie':
    'Economizorul: după 45 de secunde fără atingeri, ecranul devine negru cu cronometrul estompat — ca pe un ceas. Se trezește la atingere sau la mișcarea telefonului. Ecranul nu se stinge niciodată în sesiune.',
  'setari.profil.supratitlu': 'despre tine',
  'setari.profil.titlu': 'Profil',
  'setari.profil.nume': 'Nume',
  'setari.profil.activitate': 'Nivel de activitate zilnică',
  'setari.profil.schimba': '👥 Schimbă profilul',
  'setari.backup.supratitlu': 'datele tale',
  'setari.backup.titlu': 'Backup',
  'setari.backup.explicatie':
    'Totul stă doar pe acest dispozitiv. Fă periodic un backup — mai ales înainte să schimbi telefonul.',
  'setari.backup.exporta': '⬇ Exportă tot',
  'setari.backup.restaureaza': '⬆ Restaurează',
  'setari.backup.confirmare':
    'Importul ÎNLOCUIEȘTE toate datele actuale ale aplicației cu cele din fișier. Continui?',
  'setari.backup.succes': '✅ Datele au fost restaurate.',
  // versiunea vine din cod, nu din traducere
  'setari.versiune':
    'Gym Noob · v{versiune} · făcută cu 💪 — datele stau la tine, sincronizarea e opțională',
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
