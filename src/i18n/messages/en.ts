import type { Mesaje, Traducere } from '../types';

/**
 * English (en-GB), metric throughout — kg, km, ml, kcal, cm.
 *
 * This is a translation, not a rewrite: same keys, same `{params}`, same `<0>`
 * slots as `ro.ts`, which is the source of truth. `satisfies Traducere<Mesaje>`
 * at the bottom means a missing key, a spare key, or a plain string where
 * Romanian has a plural is a compile error.
 *
 * Two things are deliberately NOT literal:
 *
 * - **Plural categories are English ones.** Romanian needs `one/few/other`
 *   (the "20 DE exerciții" rule); English only has `one/other`. The category
 *   set comes from `Intl.PluralRules` per language, so writing only these two
 *   is correct, not lazy — `tests/i18n/paritate.test.ts` checks it.
 * - **The jokes are English jokes.** Flexu's voice is the point of this app
 *   (encouraging, funny, zero judgement), and translated humour dies. Where a
 *   Romanian line leans on something local — Lacul Vidraru for "you drank a
 *   lot of water", a locomotive going "șșș-șșș" — the English line reaches for
 *   its own reference instead of explaining the Romanian one.
 *
 * Gym vocabulary is the real thing a British gym-goer would say: rest, reps,
 * plates, cross-trainer, weigh-in — not word-for-word Romanian.
 */

export const en = {
  // ── counting things (plurals) ───────────────────────────────────────
  'comun.exercitii': {
    one: '{n} exercise',
    other: '{n} exercises',
  },
  'comun.antrenamente': {
    one: '{n} workout',
    other: '{n} workouts',
  },
  'comun.programeCelebre': {
    one: '{n} famous programme',
    other: '{n} famous programmes',
  },

  // ── navigation and chrome ───────────────────────────────────────────
  'nav.azi': 'Today',
  'nav.programe': 'Plans',
  'nav.sala': 'Gym',
  'nav.exercitii': 'Exercises',
  'nav.maiMult': 'More',
  'nav.aria': 'Main navigation',
  'nav.banner.aria': 'Session in progress',
  // two whole sentences: word order does not survive translation
  'nav.banner.desfasurare': 'Session in progress — tap to go back',
  'nav.banner.pauza': 'Session paused — tap to go back',

  'actualizare.disponibila': 'New version available!',
  'actualizare.acum': 'Update',
  'actualizare.maiTarziu': 'Later',

  // ── common verbs and labels ─────────────────────────────────────────
  'comun.inchide': 'Close',
  'comun.scade': 'Decrease {ce}',
  'comun.creste': 'Increase {ce}',
  'comun.toate': 'All',
  'comun.toateLink': 'all →',
  'comun.detalii': 'details →',
  'comun.inapoi': 'Back',
  'comun.maiDeparte': 'Next',
  'comun.salveaza': 'Save',
  'comun.anuleaza': 'Cancel',
  'comun.optional': 'optional',
  'comun.optScurt': 'opt.',
  // fields that appear identically in onboarding, settings and the weight page
  'comun.inaltime': 'Height (cm)',
  'comun.talie': 'Waist (cm)',
  'comun.gat': 'Neck (cm)',
  'comun.sold': 'Hips (cm)',
  'comun.greutateTinta': 'Target weight (kg)',
  'comun.saptamani': {
    one: '{n} week',
    other: '{n} weeks',
  },
  'comun.seturi': { one: '{n} set', other: '{n} sets' },
  'comun.sesiuni': { one: '{n} session', other: '{n} sessions' },

  // ── alt text for the artwork (screen readers) ───────────────────────
  'flexu.alt.salut': 'Flexu waving',
  'flexu.alt.explica': 'Flexu pointing',
  'flexu.alt.ganditor': 'Flexu thinking',
  'flexu.alt.sarbatoreste': 'Flexu punching the air',
  'flexu.alt.avertizeaza': 'Flexu looking alarmed',
  'flexu.alt.flex': 'Flexu lifting a dumbbell',
  'flexu.alt.obosit': 'Flexu grinding it out',
  'flexu.alt.hidratare': 'Flexu giving a thumbs up',
  'sigla.alt': 'Gym Noob — start small, finish strong',

  // ── "More" ──────────────────────────────────────────────────────────
  'maiMult.supratitlu': 'the rest of the app',
  'maiMult.titlu': 'More',
  'maiMult.profil': 'profile: {nume}',
  'maiMult.statistici.nume': 'Stats',
  'maiMult.statistici.desc': 'charts, volume, records, calendar',
  'maiMult.greutate.nume': 'Weight & goal',
  'maiMult.greutate.desc': 'weigh-ins, target, Freefit import',
  'maiMult.realizari.nume': 'Achievements',
  'maiMult.realizari.desc': 'your badge collection',
  'maiMult.ghid.nume': "The Noob's Guide",
  'maiMult.ghid.desc': 'the essentials, kept short',
  'maiMult.setari.nume': 'Settings',
  'maiMult.setari.desc': 'theme, sounds, profile, backup',

  // ── relative time ("last time") ─────────────────────────────────────
  'timp.aziMaiDevreme': 'earlier today',

  // ── the one-line summaries (src/i18n/descrieri.ts) ──────────────────
  // SI symbols (kg, km, W, %) live in the code: they are the same in any language
  'descriere.repetari': { one: '{n} rep', other: '{n} reps' },
  'descriere.maxim': 'max',

  // ── labels coming out of the domain (classifications, not sentences) ─
  'domeniu.imc.subponderal': 'Underweight',
  'domeniu.imc.normal': 'Healthy weight',
  'domeniu.imc.supraponderal': 'Overweight',
  'domeniu.imc.obezitate1': 'Obesity class I',
  'domeniu.imc.obezitate2': 'Obesity class II',
  'domeniu.imc.obezitate3': 'Obesity class III',

  'domeniu.activitate.sedentar': 'Sedentary (desk job, no exercise)',
  'domeniu.activitate.usor': 'Lightly active (walks, 1-2 workouts/week)',
  'domeniu.activitate.moderat': 'Moderately active (3-5 workouts/week)',
  'domeniu.activitate.activ': 'Active (physical job or daily sport)',
  'domeniu.activitate.foarte_activ': 'Very active (heavy work + sport)',

  'domeniu.pr.greutate': 'Heaviest weight',
  'domeniu.pr.volum_set': 'Best set volume',
  'domeniu.pr.repetari': 'Most reps',
  'domeniu.pr.1rm': 'Estimated 1RM',

  'domeniu.aparat.banda': 'Treadmill',
  'domeniu.aparat.rower': 'Rower',
  'domeniu.aparat.bicicleta': 'Exercise bike',
  'domeniu.aparat.eliptica': 'Cross-trainer',
  'domeniu.aparat.stepper': 'Stepper',

  // ── the in-session suggestions ──────────────────────────────────────
  // `{grupa}` and `{anti}` already arrive as translated muscle-group names
  'sugestii.antagonist':
    "You've done {seturi} sets of {grupa} and nothing at all for {anti}. Balance counts!",
  'sugestii.neatins': '“{grupa}” has not had a look-in for a while.',
  'sugestii.finalAbdomen': 'Nearly done — a bit of core work and you have rounded the day off nicely.',
  'sugestii.finalCardio': '10 minutes of easy cardio at the end helps recovery and burns a few more calories.',
  'sugestii.incalzire': 'Start with 5-10 minutes of easy cardio to warm up.',

  // ── achievements (ids and emoji live in src/domain/achievements.ts) ──
  'realizari.prima-sesiune.nume': 'First Step',
  'realizari.prima-sesiune.descriere': 'You finished your first workout. Everything starts here!',
  'realizari.trei-sesiuni.nume': 'Not a Fluke',
  'realizari.trei-sesiuni.descriere': '3 sessions done. This is starting to look like a habit.',
  'realizari.zece-sesiuni.nume': 'Proper Member',
  'realizari.zece-sesiuni.descriere': '10 sessions done. The front desk knows your name now.',
  'realizari.douazecicinci-sesiuni.nume': 'Part of the Furniture',
  'realizari.douazecicinci-sesiuni.descriere': '25 sessions. You are part of the scenery.',
  'realizari.cincizeci-sesiuni.nume': 'Half Century',
  'realizari.cincizeci-sesiuni.descriere': "50 sessions done. Who's the noob now?",
  'realizari.o-suta-sesiuni.nume': 'Centurion',
  'realizari.o-suta-sesiuni.descriere': '100 sessions. Local legend.',
  'realizari.streak-2.nume': 'Two in a Row',
  'realizari.streak-2.descriere': '2 weeks running with workouts in them.',
  'realizari.streak-4.nume': 'Month on Fire',
  'realizari.streak-4.descriere': '4 weeks running with workouts in them.',
  'realizari.streak-12.nume': 'Quarter of Steel',
  'realizari.streak-12.descriere': '12 weeks running. Discipline beats motivation.',
  'realizari.zile-30.nume': '30 Days In',
  'realizari.zile-30.descriere': '30 separate days with a workout on them.',
  'realizari.ore-24.nume': 'A Day of Your Life',
  'realizari.ore-24.descriere': '24 hours of active training, added up.',
  'realizari.volum-1t.nume': 'First Tonne',
  'realizari.volum-1t.descriere': "You've lifted 1,000 kg in total. A whole tonne!",
  'realizari.volum-10t.nume': 'Lorry Load',
  'realizari.volum-10t.descriere': '10 tonnes lifted in total. About one lorry.',
  'realizari.volum-100t.nume': 'The Freight Train',
  'realizari.volum-100t.descriere': '100 tonnes lifted in total. Choo-choo.',
  'realizari.kcal-1000.nume': 'Oven On',
  'realizari.kcal-1000.descriere': '1,000 kcal burnt in workouts.',
  'realizari.kcal-10000.nume': 'Blast Furnace',
  'realizari.kcal-10000.descriere': '10,000 kcal burnt in workouts.',
  'realizari.explorator.nume': 'Explorer',
  'realizari.explorator.descriere': "You've tried 15 different exercises.",
  'realizari.slabit-1.nume': 'First Kilo',
  'realizari.slabit-1.descriere': 'First kilo gone. The train has left the station!',
  'realizari.slabit-5.nume': 'Minus 5',
  'realizari.slabit-5.descriere': '5 kg gone. You can see it already.',
  'realizari.slabit-10.nume': 'Minus 10',
  'realizari.slabit-10.descriere': '10 kg gone. New wardrobe?',
  'realizari.apa-prima.nume': 'The Sponge',
  'realizari.apa-prima.descriere': 'First session with the water target hit.',
  'realizari.apa-10.nume': 'Human Water Feature',
  'realizari.apa-10.descriere': '10 sessions with the water target hit.',
  'realizari.apa-total.nume': 'Reservoir Dog',
  'realizari.apa-total.descriere': '20 litres of water drunk at the gym, all told.',
  'realizari.pr-primul.nume': 'Record Breaker',
  'realizari.pr-primul.descriere': 'First personal record broken.',
  'realizari.pr-10.nume': 'Record Hunter',
  'realizari.pr-10.descriere': '10 personal records broken.',
  'realizari.pr-25.nume': 'PR Machine',
  'realizari.pr-25.descriere': '25 personal records broken.',

  // ── "Today" (home) ──────────────────────────────────────────────────
  'acasa.salut': 'Hi, {nume}!',
  'acasa.streak': {
    one: '{n} week in a row',
    other: '{n} weeks in a row',
  },
  'acasa.continua': 'Carry on with the session',
  'acasa.incaOSesiune': 'Another one today? 😎',
  'acasa.incepe': 'Start your workout',
  'acasa.buget.supratitlu': 'calories',
  'acasa.buget.titlu': "Today's budget",
  'acasa.buget.consumi': 'you burn',
  'acasa.buget.consumiSub': 'kcal/day estimated',
  'acasa.buget.arse': 'burnt at the gym',
  'acasa.buget.arseSub': 'today',
  'acasa.buget.potiManca': 'you can eat',
  'acasa.buget.potiMancaSub': 'kcal today',
  'acasa.tinta.text': 'Target: {tinta} kg at {ritm} kg/week (deficit {deficit} kcal/day).',
  'acasa.tinta.maiAi': {
    one: '~{n} week to go.',
    other: '~{n} weeks to go.',
  },
  'acasa.tinta.atins': 'Goal reached! 🎉',
  'acasa.tinta.gol': 'No active goal — set one from the Weight page.',
  'acasa.greutateCurenta': 'current weight',
  'acasa.panaLaTinta': 'to target',
  'acasa.tintaKg': 'target {kg} kg',
  'acasa.sfat.supratitlu': 'Flexu says',
  'acasa.sfat.titlu': 'Tip of the day',
  'acasa.progres.supratitlu': 'progress',
  'acasa.progres.titlu': 'This week',
  'acasa.recomandate': '{facute} of {total} recommended workouts',
  // day initials, Monday to Sunday; a language may use its own letters
  'acasa.zi.luni': 'M',
  'acasa.zi.marti': 'Tu',
  'acasa.zi.miercuri': 'W',
  'acasa.zi.joi': 'Th',
  'acasa.zi.vineri': 'F',
  'acasa.zi.sambata': 'Sa',
  'acasa.zi.duminica': 'Su',

  // ── the exercise library ────────────────────────────────────────────
  'biblioteca.supratitlu': 'the movement library',
  'biblioteca.titlu': 'Exercises',
  // `{ce}` already arrives as the spelled-out count ("98 exercises")
  'biblioteca.descriere': '{ce} with form tips, machine how-tos and demos.',
  'biblioteca.cauta.placeholder': '🔍 Search exercise or machine…',
  'biblioteca.cauta.aria': 'Search exercise',
  'biblioteca.filtru.categorie': 'category',
  'biblioteca.filtru.grupa': 'muscle group',
  'biblioteca.gol': 'Nothing found. Try another word, another muscle group or another category.',
  'biblioteca.anim.aria': 'Animated demo of the movement',
  'biblioteca.diagrama.aria': 'Muscle groups worked',
  // drawn onto the diagram — short, they get 11px on screen
  'biblioteca.diagrama.fata': 'FRONT',
  'biblioteca.diagrama.spate': 'BACK',

  // ── a single exercise ───────────────────────────────────────────────
  'exercitiu.inexistent': 'That exercise does not exist.',
  'exercitiu.inapoiLung': '← Back to the library',
  'exercitiu.inapoi': '← Library',
  'exercitiu.forma.supratitlu': 'step by step',
  'exercitiu.forma.titlu': 'How to do it properly',
  'exercitiu.utilizare.supratitlu': 'the machine',
  'exercitiu.utilizare.titlu': 'How to use it',
  'exercitiu.greseli.supratitlu': 'watch out',
  'exercitiu.greseli.titlu': 'Common mistakes',
  'exercitiu.ponturi.supratitlu': 'from Flexu',
  'exercitiu.ponturi.titlu': 'Tips',
  'exercitiu.variante.supratitlu': 'easier, harder, different',
  'exercitiu.variante.titlu': 'Related variations',
  'exercitiu.recorduri.supratitlu': 'yours',
  'exercitiu.recorduri.titlu': 'Personal records',
  'exercitiu.seturiTotal': {
    one: '{n} set logged for this exercise, all told.',
    other: '{n} sets logged for this exercise, all told.',
  },

  // ── my plans + the app's programmes (one page, two shelves) ─────────
  'planuri.supratitlu': 'plans and programmes',
  'planuri.titlu': 'Plans',
  'planuri.descriere':
    "Yours are the ones you made, imported, or saved after a session. The app's are {ce}, ready to copy.",
  'planuri.tab.mele': '📋 Mine',
  'planuri.tab.aplicatie': "📖 The app's",
  'planuri.nou': '+ New plan',
  'planuri.deLaFlexu': 'from Flexu',
  'planuri.copie': '{nume} (copy)',
  'planuri.incepe': '▶ Start',
  'planuri.editeaza': 'Edit',
  'planuri.copiaza': 'Copy',
  'planuri.gol':
    "No saved plans yet. Make one, take one of the app's from the tab next door, or start a session in <0>free mode</0> and save it at the end. You can also start from the <1>exercise library</1>.",

  'programe.intro':
    "The best programme is the one you <0>actually do</0>, week after week. Don't pick the most complicated one — pick the one that fits your week and stay with it for three months.",

  // ── a famous programme ──────────────────────────────────────────────
  'program.inexistent': 'That programme does not exist.',
  'program.inapoi': 'Back to programmes',
  'program.supratitlu': 'programme · {nivel}',
  'program.durataPe': '{durata} per workout',
  'program.saptamana': 'What a week looks like',
  'program.progresie': 'How you add weight',
  'program.note': 'Worth remembering',
  'program.adauga': {
    one: '+ Add the workout to mine',
    other: '+ Add all {n} workouts to mine',
  },
  'program.reimprospateaza': {
    one: '↻ Refresh the workout',
    other: '↻ Refresh all {n} workouts',
  },
  'program.gata': 'Done! ',
  'program.gasesti':
    "You'll find them under <0>Plans</0>. You can edit them without breaking the original programme.",
  'program.avertisment':
    'The weights in the templates are only a starting point for someone new. Adjust them in your first session: the last 1-2 reps should be hard, but clean.',

  // ── one set in a plan ("3 × 8 @ 40 kg · rest 2:30") ─────────────────
  'plan.set.linie': '{seturi} × {cantitate}{greutate} · rest {pauza}',
  'plan.set.amrap': 'as many as you can (AMRAP)',

  // ── the plan editor ─────────────────────────────────────────────────
  'editor.supratitlu.nou': 'new plan',
  'editor.supratitlu.editare': 'editing',
  'editor.titlu.nou': 'New workout',
  'editor.nume.eticheta': 'Workout name',
  'editor.nume.placeholder': 'e.g. Push day',
  'editor.descriere.eticheta': 'Description (optional)',
  'editor.descriere.placeholder': 'what the plan is for…',
  'editor.item.seturi': { one: '{n} set', other: '{n} sets' },
  'editor.item.pauza': 'rest {sec}s',
  'editor.item.tempo': 'tempo',
  'editor.regleaza': 'Adjust',
  'editor.mutaSus': 'Move up',
  'editor.mutaJos': 'Move down',
  'editor.stergeExercitiu': 'Remove exercise',
  'editor.adaugaExercitiu': '+ Add exercise',
  'editor.salveaza': '💾 Save workout',
  'editor.sterge': 'Delete',
  'editor.stergeConfirmare': 'Delete this workout for good?',
  'editor.adaugaInPlan': '+ Add to plan',
  'editor.gata': 'Done',

  // ── the exercise picker sheet ───────────────────────────────────────
  'alege.titlu': 'Pick an exercise',
  'alege.actiune': '▶ Start this exercise',
  'alege.altExercitiu': '← Another exercise',
  'alege.flexuPropune': 'Flexu suggests',
  'alege.cauta.placeholder': 'Search exercises…',
  'alege.gol': 'Nothing found. Try another word or another category.',

  // ── the parameters of an exercise (steppers) ─────────────────────────
  'parametri.seturi': 'Sets',
  'parametri.repetari': 'Reps',
  'parametri.amrap': 'Reps: as many as you can (AMRAP)',
  'parametri.puneNumar': 'Set a number',
  'parametri.faAmrap': 'Make it “as many as you can” (AMRAP)',
  'parametri.greutate': 'Weight',
  'parametri.durata': 'Duration (minutes)',
  'parametri.viteza': 'Starting speed',
  'parametri.inclinatie': 'Starting incline',
  'parametri.pauza': 'Rest between sets',
  'parametri.tempo.eticheta': 'Tempo — optional',
  'parametri.tempo.fara': 'none',
  'parametri.tempo.normal': '2-0-1 (normal)',
  'parametri.tempo.controlat': '3-1-2 (controlled)',
  'parametri.tempo.lent': '4-2-1 (slow, intense)',
  'parametri.notita.eticheta': 'Note (shows up at the gym) — optional',
  'parametri.notita.placeholder': 'e.g. 75% of max · 8 per leg',

  // ── the guide and the articles ──────────────────────────────────────
  'ghid.supratitlu': 'gym school',
  'ghid.titlu': "The Noob's Guide",
  'articol.inexistent': 'That article does not exist.',
  'articol.inapoiScurt': '← Guide',
  'articol.inapoi': "← The Noob's Guide",
  'articol.supratitlu': 'a lesson from Flexu',

  // ── the achievements page (badge names are further down) ────────────
  'realizari.supratitlu': 'the medal collection',
  'realizari.titlu': 'Achievements',
  'realizari.progres': '{nr} of {total} unlocked',
  'realizari.gol':
    'Your first badge is waiting at the end of your first session. Not far off — get to the gym! 💪',
  'realizari.cat.inceput': 'Beginnings',
  'realizari.cat.consecventa': 'Consistency',
  'realizari.cat.volum': 'Volume and calories',
  'realizari.cat.greutate': 'Body weight',
  'realizari.cat.hidratare': 'Hydration',
  'realizari.cat.recorduri': 'Records',

  // ── the session: the start screen ───────────────────────────────────
  'sesiune.start.supratitlu': "it's gym o'clock",
  'sesiune.start.titlu': 'Start a session',
  'sesiune.start.flexu':
    "Got a plan? Pick it. Haven't? <0>Free mode</0> — choose the exercise, put the numbers in and off you go. Add more as you go, and at the end you can save the lot as a plan. I'll keep the clock, the water and the calories.",
  'sesiune.start.modLiber': '🔥 FREE MODE — start now',
  'sesiune.start.modLiberSub': 'pick the exercise on the spot, no plan needed',
  'sesiune.start.planurile': 'Your plans',
  'sesiune.start.buton': '▶ START',
  'sesiune.start.incepeCuAsta': '▶ Start with this one',
  'sesiune.start.pornescGol': "Start empty, I'll decide there",

  // ── the session: the live screen ────────────────────────────────────
  'sesiune.pauzaIntre': 'rest between sets',
  'sesiune.plus30': '+30s',
  'sesiune.sarPeste': 'Skip it',
  'sesiune.sugestie.ceZici': '{motiv} How about <0>{exercitiu}</0>?',
  'sesiune.sugestie.adauga': 'Add it',
  'sesiune.sugestie.nuAcum': 'Not now',
  'sesiune.golFlexu':
    "You haven't picked anything yet. Hit the button below, look up the machine or the exercise and get going — you don't have to know everything you're doing today up front.",
  'sesiune.alegePrimul': '+ Pick your first exercise',
  'sesiune.planAzi': "Today's plan",
  'sesiune.ceUrmeaza': "💡 What's next?",
  'sesiune.activ': '▶ active',
  'sesiune.seturiFacute': '{facute}/{total} sets',
  'sesiune.repMaxim': 'max',
  'sesiune.scoateDinPlan': 'Remove {exercitiu} from the plan',
  'sesiune.adaugaExercitiu': '+ Add exercise',
  'sesiune.notaAdaugare':
    'The exercise you add becomes the active one. You can jump back to another at any time by tapping it in the list.',
  'sesiune.apa.titlu': '💧 Water',
  'sesiune.apa.progres': '{bauti} / {tinta} ml',
  'sesiune.apa.buton': '+{ml} ml',
  'sesiune.ble.titlu': '📡 Watch and machine',
  'sesiune.ble.deconecteaza': 'Disconnect',
  'sesiune.ble.cautCeasul': 'Looking for the watch…',
  'sesiune.ble.ceasIntrebare': 'Watch that broadcasts heart rate (e.g. Huawei GT4)?',
  'sesiune.ble.conecteazaCeas': '♥ Connect',
  'sesiune.ble.ceasExplicatie':
    'On the watch: start a workout and turn on “Broadcast heart rate”. I look for it myself at the start of a session, but if the browser will not let me, one tap here sorts it.',
  'sesiune.ble.cautAparatul': 'Looking for the machine…',
  'sesiune.ble.aparatIntrebare': 'Treadmill or rower with Bluetooth?',
  'sesiune.ble.conecteazaAparat': '🔌 Connect',
  'sesiune.ble.aparatExplicatie':
    "Turn on Bluetooth on the machine's console, then tap here. I take speed, distance and power straight off it. If I cannot find it, Settings has a scanner that tells you what the machine speaks.",
  'sesiune.treciLaEl': '▶ Switch to it now',
  'sesiune.pr.titlu': '🏆 PERSONAL RECORD!',
  'sesiune.pr.linie': '{tip}: <0>{valoare}</0>',
  'sesiune.pr.vechiul': 'old record: {valoare}',
  'sesiune.pr.maiDeparte': 'Onwards! 🚀',
  'sesiune.stop.titlu': 'Finish the session?',
  'sesiune.stop.rezumat': "You've got {timp} of active training and {seturi} logged.",
  'sesiune.stop.da': '✅ Yes, finish — save everything',
  'sesiune.stop.nu': 'No, back to work',
  'sesiune.stop.abandon': 'Abandon the session',
  'sesiune.stop.abandonConfirmare': 'Are you sure? The session will be marked as abandoned.',
  // spoken out loud, not written on screen
  'sesiune.vocal.pauzaTerminata': 'Rest is over. Next set!',
  'sesiune.vocal.record': 'Personal record! Well done!',

  // ── the session: the current exercise card ──────────────────────────
  'sesiune.cumSeFace': 'how do I do it? →',
  'sesiune.setulDin': 'Set {n} of {total} · {echipament}',
  'sesiune.toateSeturile': 'Every set ticked off on this one! Pick the next from your plan. 💪',
  'sesiune.rpe.intrebare': 'How hard was that? (RPE {rpe})',
  'sesiune.rpe.aria': 'Perceived effort',
  'sesiune.rpe.lejer': 'easy',
  'sesiune.rpe.maxim': 'all out',
  'sesiune.rpe.maximCu': 'all out (RPE {rpe})',
  'sesiune.tempo.buton': '🎵 Tempo {tempo}',
  'sesiune.tempo.cuFaza': '🎵 Tempo {tempo} — {faza}',
  'sesiune.discuri': '🏋️ {greutate} kg = bar (20 kg) + <0>{discuri}</0> each side',
  'sesiune.discuriNimic': 'nothing',
  'sesiune.amTerminatSetul': '✔ Set done',
  'sesiune.tinta': 'target: {timp}',
  'sesiune.banda.viteza': 'Speed',
  'sesiune.banda.inclinatie': 'Incline',
  'sesiune.banda.explicatie':
    'Change them as you go, exactly as you do on the treadmill — the calories count every stretch. Intensity right now: <0>{met} MET</0>',
  'sesiune.crono.continua': '▶ Carry on',
  'sesiune.crono.porneste': '▶ Start',
  'sesiune.crono.opreste': '⏸ Stop',
  'sesiune.crono.reset': '↺ Reset',
  'sesiune.amTerminat': '✔ Done ({timp})',

  // ── the session: the final summary ──────────────────────────────────
  'sesiune.rezumat.supratitlu': 'session finished',
  'sesiune.rezumat.titlu': 'NICE ONE! 🎉',
  'sesiune.rezumat.laSala': 'at the gym',
  'sesiune.rezumat.kcal': 'kcal burnt',
  'sesiune.rezumat.timpActiv': 'active time',
  'sesiune.rezumat.pauze': 'rest {timp}',
  'sesiune.rezumat.seturi': 'sets',
  'sesiune.rezumat.apa': 'water drunk',
  'sesiune.rezumat.catAiLucrat': 'how much you worked',
  'sesiune.rezumat.realizari': 'Achievements unlocked!',
  'sesiune.rezumat.acasa': 'Home',
  'sesiune.salvat.titlu': '✅ Saved as a plan!',
  'sesiune.salvat.unde': "You'll find it under Plans → Mine, ready to do again.",
  'sesiune.salveazaPlan.buton': '💾 Save this session as a plan',
  'sesiune.salveazaPlan.titlu': 'Save as a plan?',
  'sesiune.salveazaPlan.explicatie':
    "I'll make a plan out of the exercises and numbers you ticked off today. Next time you start it with one tap, no thinking needed.",
  'sesiune.salveazaPlan.nume': 'What shall we call it?',
  'sesiune.salveazaPlan.salveaza': '💾 Save the plan',
  // these two get written into the database in whatever language was active:
  // the plan becomes the user's, so it is never retranslated
  'sesiune.numePlanImplicit': 'Session {data}',
  'sesiune.salvatDescriere': 'Saved from a session at the gym',

  // ── the sticky session header ───────────────────────────────────────
  'hud.laSalaDe': 'at the gym for',
  'hud.pauza': '⏸ Pause',
  'hud.pauzaAria': 'Pause',
  'hud.reia': '▶ Resume',
  'hud.reiaAria': 'Resume',
  'hud.opresteAria': 'Stop the session',
  'hud.conecteazaAria': 'Connect the heart-rate watch',
  'hud.caut': '♥ looking…',
  'hud.conecteaza': '♥ connect',
  'hud.activ': 'active',
  'hud.pauzaUnitate': '+{timp} rest',
  'hud.asteptDate': 'waiting for data…',
  'hud.inPauza': '⏸ SESSION PAUSED — the work clock is standing still',

  // ── the screensaver ─────────────────────────────────────────────────
  'economizor.aria': 'Tap to come back',
  'economizor.pauza': 'rest',
  'economizor.pauzaScurt': '⏸ paused',
  'economizor.reveni': 'tap or move the phone to come back',

  // ── "last time" ─────────────────────────────────────────────────────
  'ultimaData.cand': 'last time · {cand}',
  'ultimaData.tinta': '🎯 If today feels easy: try {kg} kg × {reps}',
  'ultimaData.reia': '↩ Reuse those settings',

  // ── onboarding ──────────────────────────────────────────────────────
  'onboarding.pasul': 'Step {pas} of {total}',
  'onboarding.noob': 'Noob',
  'onboarding.intro.supratitlu': 'The complete guide for the absolute beginner',
  // "all in plain English" is a claim about the language: each language says its own
  'onboarding.intro.text':
    "<0>I'm Flexu</0> — I was the noobiest noob in the gym, so I know exactly what you're going through. Workouts, a weight journal, calories and encouragement: all in plain English, all on your phone. An account is optional, only if you want your data on more than one device.",
  'onboarding.intro.bula': "You don't have to be perfect. You just have to start!",
  'onboarding.intro.start': "Let's go! 💪",
  'onboarding.intro.altProfil': 'Used the app on another profile before? <0>Pick a profile</0>',
  'onboarding.intro.amCont': 'Already have a sync account? <0>Sign in and bring your data</0>',

  'onboarding.pas1.supratitlu': 'step 1 of 4 · introductions',
  'onboarding.pas1.titlu': 'Who are you?',
  'onboarding.pas1.flexu':
    'This stays on your phone and nowhere else — I use it for calories and recommendations.',
  'onboarding.pas1.nume': 'What shall we call you?',
  'onboarding.pas1.numePlaceholder': 'Your name',
  'onboarding.pas1.sex': 'Sex (for the calorie formulas)',
  'onboarding.pas1.masculin': 'Male',
  'onboarding.pas1.feminin': 'Female',
  'onboarding.pas1.dataNasterii': 'Date of birth',

  'onboarding.pas2.supratitlu': 'step 2 of 4 · the starting point',
  'onboarding.pas2.titlu': 'Your starting body',
  'onboarding.pas2.flexu':
    'The tape measurements (optional) let me estimate your body fat percentage — a far more useful number than the scales on their own.',
  'onboarding.pas2.greutate': 'Current weight (kg)',
  'onboarding.pas2.activitate': 'How active are you outside the gym?',
  'onboarding.pas2.grasime': 'Estimated body fat (US Navy formula): <0>{procent}%</0>',

  'onboarding.pas3.supratitlu': 'step 3 of 4 · the destination',
  'onboarding.pas3.titlu': 'Your goal',
  // the number in the text carries the language's decimal separator
  'onboarding.pas3.flexu':
    'I recommend <0>0.5 kg per week</0> — fast enough to show, gentle enough that you keep your muscle and never feel starved.',
  'onboarding.pas3.ritm': 'Rate of loss: {ritm} kg / week',
  'onboarding.pas3.relaxat': 'relaxed',
  'onboarding.pas3.hotarat': 'determined',
  'onboarding.pas3.eta':
    '🗓️ At that rate you reach <0>{tinta} kg</0> in about <1>{saptamani}</1> ({cand}).',
  'onboarding.pas3.tintaPreaMare':
    'Your target is the same as or above your current weight — set a lower one to lose weight.',

  'onboarding.pas4.supratitlu': 'step 4 of 4 · ready to work',
  'onboarding.pas4.titlu': 'Your plan',
  'onboarding.pas4.imc': 'BMI',
  'onboarding.pas4.bmr': 'BMR (kcal)',
  'onboarding.pas4.bmrSub': 'burnt just existing',
  'onboarding.pas4.tdee': 'TDEE (kcal)',
  'onboarding.pas4.tdeeSub': 'total daily burn',
  'onboarding.pas4.buget': 'Daily budget',
  'onboarding.pas4.bugetSub': 'kcal, on a non-gym day',
  'onboarding.pas4.flexu':
    "<0>{nume}, your plan is ready!</0> I've also lined up 4 starter workouts, cut for the beginning of the road. On gym days your calorie budget goes up automatically by whatever you burn. See you at the machines!",
  'onboarding.pas4.pregatesc': 'Getting everything ready…',
  'onboarding.pas4.creeaza': 'Create my profile 🚀',

  // ── signing in on a new device ──────────────────────────────────────
  'login.supratitlu': 'welcome back',
  'login.titlu': 'Bring your data over',
  'login.flexu':
    "Already have an account? Sign in and I'll fetch the whole bag: profile, workouts, history, achievements. As if you never changed phones.",
  'login.parolaPlaceholder': 'your password',
  'login.contGol':
    'The account exists but has no data in it yet. Do the normal onboarding, then link the account from Settings.',
  'login.aduc': 'Fetching your data…',
  'login.intra': 'Sign in',

  // ── the profile list ────────────────────────────────────────────────
  'profiluri.titlu': 'Profiles',
  'profiluri.activ': 'active',
  'profiluri.creat': 'created {cand}',
  'profiluri.gol': 'No profiles yet.',
  'profiluri.nou': '+ New profile',

  // ── weight & goal ───────────────────────────────────────────────────
  'greutate.supratitlu': 'the scales, tamed',
  'greutate.titlu': 'Weight & goal',
  'greutate.acum': 'now',
  'greutate.slabite': 'lost',
  'greutate.deLaMaxim': 'from a peak of {kg} kg',
  'greutate.imc': 'BMI',
  'greutate.grasime': 'est. body fat',
  'greutate.grasimeGol': 'add measurements',
  'greutate.grasimeFormula': 'US Navy formula',
  'greutate.cantarireNoua': '+ New weigh-in',
  'greutate.obiectiv.supratitlu': 'the target',
  'greutate.obiectiv.titlu': 'Active goal',
  // two whole sentences, not one with a swapped tail
  'greutate.obiectiv.cuRest':
    '🎯 <0>{tinta} kg</0> at <1>{ritm} kg/week</1> — <2>{rest} kg</2> to go, about <3>{saptamani}</3>.',
  'greutate.obiectiv.atins':
    '🎯 <0>{tinta} kg</0> at <1>{ritm} kg/week</1> — goal reached! 🎉 Set a new one.',
  'greutate.obiectiv.schimba': 'Change the goal',
  'greutate.obiectiv.gol': 'No active goal.',
  'greutate.obiectiv.seteaza': 'Set a goal',
  'greutate.flexu.progres':
    "From <0>{maxim} kg</0> down to <1>{acum} kg</1> — that's proper movement! Keep the pace, not the panic.",
  'greutate.flexu.sfat':
    'Weigh yourself at the same time of day (mornings are best) and watch the 7-day average in Stats, not each single day.',
  'greutate.istoric.supratitlu': 'history',
  'greutate.istoric.titlu': 'Weigh-ins',
  'greutate.sursa.freefit': 'Freefit import',
  'greutate.sursa.manual': 'manual',
  'greutate.import.supratitlu': 'outside data',
  'greutate.import.titlu': 'Import from Freefit',
  'greutate.import.explicatie':
    'Using a Bluetooth scale with the Freefit app? Your weight history can come in here from an exported CSV file.',
  'greutate.import.buton': '📥 Import history',
  'greutate.import.modal': 'Freefit import',
  'greutate.adauga.titlu': 'New weigh-in',
  'greutate.adauga.kg': 'Weight (kg)',
  'greutate.adauga.kgPlaceholder': 'e.g. 92.4',
  'greutate.editObiectiv.titlu': 'Weight goal',
  'greutate.editObiectiv.ritm': 'Rate: {ritm} kg / week',
  'greutate.editObiectiv.estimare': 'Estimate: ~{saptamani} to target.',
  'greutate.editObiectiv.salveaza': 'Save the goal',

  // ── the Freefit import ──────────────────────────────────────────────
  'freefit.eroareColoane':
    'I could not find date + weight columns in the file. Check the export (it has to be CSV).',
  'freefit.succes': '✅ Import done: <0>{n}</0> new weigh-ins added.',
  'freefit.succesCuDubluri':
    '✅ Import done: <0>{n}</0> new weigh-ins added ({dubluri} were already on record).',
  'freefit.super': 'Great!',
  'freefit.cum': 'How to get your data out of Freefit:',
  'freefit.pas1': 'Open Freefit → profile / settings → look for “Export data” or “Measurement history”.',
  'freefit.pas2': 'Choose CSV (or Excel saved as CSV) and send yourself the file (email, Drive, etc.).',
  'freefit.pas3': 'Pick the file here — it is all processed locally, nothing leaves your phone.',
  'freefit.oriceCsv':
    'Works with any CSV that has a date column and a weight column (kg) — including exports from other scale apps.',
  'freefit.amGasit': 'Found <0>{n}</0> weigh-ins, between {prima} and {ultima}.',
  'freefit.siIncaN': '…and {n} more',
  'freefit.importa': 'Import',
  'freefit.altFisier': 'Another file',

  // ── stats ───────────────────────────────────────────────────────────
  'statistici.supratitlu': 'the numbers do not lie',
  'statistici.titlu': 'Stats',
  'statistici.tot': 'All',
  'statistici.zile': '{n} days',
  'statistici.sesiuni': 'sessions',
  'statistici.timpLaSala': 'time at the gym',
  'statistici.lucrat': '{procent}% working',
  'statistici.timpActiv': 'active time',
  'statistici.pauze': 'rest {timp}',
  'statistici.kcalArse': 'kcal burnt',
  'statistici.volum': 'volume lifted',
  'statistici.seturi': 'sets',
  'statistici.apa': 'water at the gym',
  'statistici.jurnal.supratitlu': 'journal',
  'statistici.jurnal.titlu': 'Recent sessions',
  'statistici.sesiuneLibera': 'free session',
  'statistici.activPauza': 'active {activ} · rest {pauza}',
  'statistici.greutate.supratitlu': 'trend',
  'statistici.greutate.titlu': 'Body weight',
  'statistici.greutate.masurat': 'measured',
  'statistici.greutate.medie': '7-day average',
  'statistici.greutate.nota':
    'The thick line is the 7-day average. That is the one to believe, not the morning scales.',
  'statistici.volum.supratitlu': 'work done',
  'statistici.volum.titlu': 'Volume per week',
  'statistici.volum.serie': 'kg lifted',
  'statistici.echilibru.supratitlu': 'balance',
  'statistici.echilibru.titlu': 'Sets per muscle group',
  'statistici.echilibru.nota':
    'A round shape means balanced training. Lonely spikes mean favourites.',
  'statistici.forta.supratitlu': 'progression',
  'statistici.forta.titlu': 'Estimated strength (1RM)',
  'statistici.forta.serie': 'estimated 1RM (kg)',
  'statistici.forta.gol': 'Log at least two sessions with this exercise to get a chart.',
  'statistici.sesiune.supratitlu': 'per session',
  'statistici.sesiune.titlu': 'Calories, water and time',
  'statistici.sesiune.apa': 'water (ml)',
  'statistici.sesiune.minute': 'minutes at the gym',
  'statistici.calendar.supratitlu': 'consistency',
  'statistici.calendar.titlu': 'Training calendar',
  'statistici.export.supratitlu': 'your data',
  'statistici.export.titlu': 'Export',
  'statistici.export.explicatie':
    'Download the complete set journal for Excel or any other analysis.',
  'statistici.export.buton': '⬇ Export CSV ({ce})',
  'statistici.total': 'All time: {sesiuni} · {tone} tonnes lifted.',

  // ── account and sync ────────────────────────────────────────────────
  'cont.supratitlu': 'across several devices',
  'cont.titlu': 'Account and sync',
  'cont.email': 'Email',
  'cont.emailPlaceholder': 'you@example.com',
  'cont.parola': 'Password',
  'cont.parolaPlaceholder': 'at least 8 characters',
  'cont.parolaScurta': 'The password needs at least 8 characters.',
  'cont.intru': 'Signing in…',
  'cont.intraDinNou': 'Sign in again',
  'cont.oClipa': 'One moment…',
  'cont.creeaza': 'Create account',
  'cont.amDejaCont': 'I already have one',
  'cont.nuUitaParola': "Don't forget the password — there's no email reset yet (seriously, don't).",
  'cont.nelegat':
    "Want your data on two phones? Make an account and I'll carry the bag of data between them. Without an account everything stays right here — same as it has been.",
  'cont.sincronizez': 'Carrying the data dumbbells… one second.',
  'cont.sincronizat': '✅ Synced',
  'cont.contEste': 'Account: <0>{email}</0>',
  'cont.ultimaSincronizare': 'Last sync: {cand}',
  'cont.spatiu': 'Space used: {folosit} MB of {total} MB',
  'cont.sincronizeazaAcum': '🔄 Sync now',
  'cont.deconecteaza': 'Unlink',
  'cont.deconecteazaExplicatie': '“Unlink” only detaches the account — the data stays on the phone.',
  'cont.stergeCloud': 'Delete the cloud account',
  'cont.sesiuneExpirata': 'Your session expired — sign in again and we pick up where we left off.',
  'cont.cotaPlina': 'The account is full (25 MB of gains!). Sync is taking a breather — drop Attrexx a line.',
  'cont.eroareGenerica':
    "I can't reach the server right now. No panic — everything is saved here and I'll send it up when I get signal.",
  'cont.maiIncearca': '🔄 Try again',
  'cont.conflictScurt': 'The account holds a different set of data — choose in the window below.',
  'cont.conflict.titlu': 'Whoa! Two sets of data',
  'cont.conflict.explicatie':
    "The account <0>{email}</0> already holds one set of data, and this phone holds another. Like at the gym: we don't hang two plates on the same peg. Which one do we keep?",
  'cont.conflict.cloud': '☁️ Use the cloud version',
  'cont.conflict.cloudExplicatie':
    'The cloud profile becomes the active one. The local profile is NOT deleted — it stays in the profile list, unlinked.',
  'cont.conflict.local': '📱 Send the local version up',
  'cont.conflict.localExplicatie': 'The cloud data is replaced by what is on this phone.',
  'cont.conflict.backup': '⬇ Download a backup first',
  'cont.conflict.renunt': 'Leave it',
  'cont.stergere.titlu': 'Delete the cloud account?',
  'cont.stergere.explicatie':
    'This deletes the account and ALL the data in the cloud. The data on your phone is left untouched. Confirm with your password.',
  'cont.stergere.parola': 'Account password',
  'cont.stergere.sterg': 'Deleting…',
  'cont.stergere.confirma': 'Yes, delete everything in the cloud',

  // ── watch and machines (BLE) ────────────────────────────────────────
  'aparate.supratitlu': 'sensors',
  'aparate.titlu': 'Watch and machines',
  'aparate.faraBle':
    "This browser has no Web Bluetooth, so I can't read heart rate off a watch or data off the machines. On iPhone it doesn't exist at all — on Android, use Chrome. The rest of the app works normally.",
  'aparate.pulsAuto': '♥ Look for the watch automatically at the start of a session',
  'aparate.aparatAuto': '🔌 Look for the cardio machine automatically',
  'aparate.tinuteMinte': 'Remembered: {lista}',
  'aparate.silentios':
    "Your browser lets me reconnect on my own — you don't have to press anything any more.",
  'aparate.cuAtingere':
    'The browser wants a tap before it will pick a device, so I put a big button in the session header. Once connected, if I lose the signal I reconnect on my own.',
  'aparate.scaner.titlu': '🔍 Scan a machine',
  'aparate.scaner.explicatie':
    "If a machine won't connect, turn its Bluetooth on and scan it from here. I'll tell you exactly which services it exposes, and from there we know whether we can read its data.",
  'aparate.scaner.scanez': 'Scanning…',
  'aparate.scaner.scaneaza': '🔍 Scan',
  'aparate.scaner.uuid': 'Extra UUIDs (optional)',
  'aparate.scaner.uuidPlaceholder': 'e.g. 0000fff0-0000-1000-8000-00805f9b34fb',
  'aparate.scaner.uuidExplicatie':
    "Worth knowing: the browser only shows me <0>the services I ask for up front</0>. An unknown proprietary service doesn't appear until we know its UUID — which is exactly why this field exists.",
  'aparate.scaner.copiat': '✅ Copied',
  'aparate.scaner.copiaza': '📋 Copy the report',
  'aparate.scaner.eroareCopiere': 'I could not copy it. Select the text below by hand.',
  'aparate.scaner.cauti':
    'You are looking for <0>0x1826</0> (Fitness Machine) — if it shows up, the machine speaks the standard and we can read it.',

  // ── settings ────────────────────────────────────────────────────────
  'setari.supratitlu': 'fine tuning',
  'setari.titlu': 'Settings',
  'setari.tema.supratitlu': 'look',
  'setari.tema.titlu': 'Theme',
  'setari.tema.zi': '☀️ Day',
  'setari.tema.noapte': '🌙 Night',
  'setari.tema.auto': '🌗 Auto',
  'setari.tema.explicatie': '“Night” = a dark gym with yellow accents — for late workouts.',
  'setari.sunete.supratitlu': 'during a session',
  'setari.sunete.titlu': 'Sounds and cues',
  'setari.sunete.bipuri': '🔔 Sounds (beeps, timers)',
  'setari.sunete.vocale': '🗣️ Voice cues in your headphones',
  'setari.sunete.vibratii': '📳 Vibration',
  'setari.sunete.sugestii': '💡 Automatic exercise suggestions',
  'setari.sunete.economizor': '🌘 Screensaver during a session',
  'setari.sunete.economizorExplicatie':
    'The screensaver: after 45 seconds without a touch the screen goes black with the timer dimmed — like a watch. It wakes on a touch or when you move the phone. The screen never switches itself off during a session.',
  'setari.profil.supratitlu': 'about you',
  'setari.profil.titlu': 'Profile',
  'setari.profil.nume': 'Name',
  'setari.profil.activitate': 'Daily activity level',
  'setari.profil.schimba': '👥 Switch profile',
  'setari.backup.supratitlu': 'your data',
  'setari.backup.titlu': 'Backup',
  'setari.backup.explicatie':
    'Everything lives on this device only. Take a backup now and then — especially before you change phones.',
  'setari.backup.exporta': '⬇ Export everything',
  'setari.backup.restaureaza': '⬆ Restore',
  'setari.backup.confirmare':
    "Importing REPLACES all of the app's current data with what is in the file. Continue?",
  'setari.backup.succes': '✅ Your data has been restored.',
  // the version number comes from the code, not from a translation
  'setari.versiune':
    'Gym Noob · v{versiune} · made with 💪 — your data stays with you, sync is optional',
  'setari.limba.supratitlu': 'which language',
  'setari.limba.titlu': 'Language',
  'setari.limba.auto': 'Automatic',
  'setari.limba.explicatie':
    "“Automatic” takes the language of your phone, with Romanian as the fallback. It changes everything: the menus, the exercises, the guide and the voice in your headphones.",
  'setari.vocale.confirmare': 'Voice cues are on. Have a good workout!',

  // ── meta ────────────────────────────────────────────────────────────
  'meta.descriere':
    'The complete guide for the absolute gym beginner. Workouts, journals, calories and stats — all in plain English.',
} satisfies Traducere<Mesaje>;
