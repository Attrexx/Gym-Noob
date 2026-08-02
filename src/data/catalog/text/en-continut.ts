import type { ArticleId, ProgramId } from '../ids';
import type { TextArticol, TextProgram, TextSablonStart } from './types';
import type { ProgramGoal } from '@/data/types';

/**
 * The English text for the famous programmes, the guide and the tips.
 *
 * Two structural rules that are easy to break here:
 *
 * - `notite` arrays are POSITIONAL. Each entry lines up with the matching item
 *   in the workout structure, so the length and the `undefined` slots have to
 *   match `ro-continut.ts` exactly. A shifted array silently attaches the wrong
 *   note to the wrong exercise.
 * - In the articles, lines beginning with "• " are rendered as list items by
 *   `ArticlePage`, so the marker has to stay in the text.
 *
 * `sfaturi`, `incurajariSet` and `incurajariFinal` are free lists — this is the
 * one place where the languages do not have to be the same length, because
 * `sfatulZilei` indexes modulo the array length.
 */

export const PROGRAME_EN: Record<ProgramId, TextProgram> = {
  'full-body-3x': {
    nume: 'Full Body 3x a week',
    subtitlu: 'The whole body, three times a week. The programme absolutely everybody should start with.',
    origine: 'The classic beginner structure (a cousin of Starting Strength and StrongLifts 5×5)',
    descriere:
      'Two workouts, A and B, alternated: A-B-A one week, B-A-B the next. Every muscle group gets worked three times a week — exactly the frequency at which a beginner grows fastest. Few exercises, all compound, nothing exotic. Boring? Yes. Effective? Enormously.',
    frecventa: '3 days a week, with a rest day between them',
    durata: '45-60 min',
    etichete: ['beginner', 'full body', 'strength'],
    saptamana: [
      'Monday — Workout A',
      'Tuesday — off (a walk, a stroll, any easy movement)',
      'Wednesday — Workout B',
      'Thursday — off',
      'Friday — Workout A',
      'Saturday / Sunday — off. Next week you start with B.',
    ],
    progresie: [
      'Got all the sets with all the reps? Add 2.5 kg to the upper-body lifts (bench, press) and 5 kg to legs and deadlifts, next session.',
      'Missed the reps twice in a row on the same lift? Drop 10% and climb back up. That is called a "deload" and it is part of the plan, not a failure.',
    ],
    note: [
      'For the first 2-3 weeks use ridiculously light weights. You are learning the groove, not impressing anybody.',
      'The warm-up is not optional: 5 minutes of easy cardio plus 1-2 sets with the empty bar on the first exercise.',
    ],
    antrenamente: [
      {
        nume: 'Full Body A',
        descriere: 'Squats and pressing. The day you learn to sit down and push up.',
        notite: [
          undefined,
          'Start with the empty bar (20 kg) until the technique is clean.',
          undefined,
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Full Body B',
        descriere: 'Deadlifts and overhead press. The day you learn to lift off the floor and press over your head.',
        notite: [
          undefined,
          undefined,
          undefined,
          'One heavy set is plenty. Deadlifts take more out of you than they look like they do.',
          undefined,
        ],
      },
    ],
  },
  'powerbuilding-periodizat': {
    nume: 'Periodised powerbuilding (Routine 1 + Routine 2)',
    subtitlu: 'Two full-body routines on rotation: 2 weeks of hypertrophy, 6 of strength, then round again.',
    origine: 'A classic forum programme, in two complementary blocks',
    descriere:
      'The best training programme is the one you do consistently. As a beginner you want the whole body three times a week — and this programme gives you two ways of doing that. Routine 1 leans towards hypertrophy: every muscle group gets hit three times a week, plenty of stimulus for adding size. Routine 2 leans towards strength: more volume on the big lifts, but less total volume per muscle group, so you keep adding weight to the compounds without burning yourself out on accessories. Together they make a periodised powerbuilding programme.',
    frecventa: '3 days a week, with a rest day between sessions',
    durata: '60-75 min',
    etichete: ['powerbuilding', 'full body', 'periodisation'],
    saptamana: [
      'PHASE 1 (weeks 1-2) — hypertrophy: A, B, C, then A, B, C again.',
      'PHASE 2 (weeks 3-8) — strength: alternate A and B (A-B-A, then B-A-B).',
      'After week 8 you start over with Phase 1.',
      'An example week: Monday · Wednesday · Friday, with a rest day between sessions.',
    ],
    progresie: [
      'Phase 1 (hypertrophy): when you hit all 3 sets at the required reps, add 2.5 kg next time.',
      'Phase 2 (strength): on the big lifts (squat, deadlift, bench, overhead press) you climb more aggressively — 2.5 kg upper body, 5 kg legs — as long as every rep stays clean.',
      'On the AMRAP exercises (pull-ups, dips) you progress in reps: once you pass 12 in a set, add weight with a belt.',
    ],
    note: [
      'Phase 2 has fewer accessories on purpose — the idea is to grow on the compounds without tiring your muscles out with volume that does nothing.',
      'The long rests (2-3 min) on the heavy lifts are not wasted time. They are part of the training.',
      '"3 × 20 each side" on the cable twists means 20 left plus 20 right, per set.',
    ],
    antrenamente: [
      {
        nume: 'Routine 1 · Workout A',
        descriere: 'Deadlifts, overhead press, chest press plus arms, calves and abs.',
        faza: 'Phase 1 · Hypertrophy (2 weeks)',
        notite: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
      {
        nume: 'Routine 1 · Workout B',
        descriere: 'Squats, rows, incline press plus arms, shoulders and obliques.',
        faza: 'Phase 1 · Hypertrophy (2 weeks)',
        notite: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          '20 reps on each side.',
        ],
      },
      {
        nume: 'Routine 1 · Workout C',
        descriere: 'One leg at a time, close grip, dumbbells plus back and hard abs.',
        faza: 'Phase 1 · Hypertrophy (2 weeks)',
        notite: [
          '8 reps on each leg.',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          'Too hard? Knee raises on the dip station or on the floor.',
        ],
      },
      {
        nume: 'Routine 2 · Workout A',
        descriere: 'Squats, rows, bench plus pull-ups and dips to failure.',
        faza: 'Phase 2 · Strength (6 weeks)',
        notite: [
          undefined,
          undefined,
          undefined,
          'AMRAP — as many as you can with good form. Stop while you still have one clean rep in reserve.',
          'AMRAP — as many as you can with good form. Stop while you still have one clean rep in reserve.',
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Routine 2 · Workout B',
        descriere: 'Deadlifts, overhead press, pull-ups plus shoulders, traps and obliques.',
        faza: 'Phase 2 · Strength (6 weeks)',
        notite: [
          undefined,
          undefined,
          'AMRAP — as many as you can with good form. Stop while you still have one clean rep in reserve.',
          undefined,
          undefined,
          undefined,
          '20 reps on each side.',
        ],
      },
    ],
  },
  'ppl': {
    nume: 'Push / Pull / Legs (PPL)',
    subtitlu: 'Push, pull, legs. The most popular split in gyms anywhere.',
    origine: 'A classic bodybuilding structure, popularised online (Reddit PPL, Metallicadpa)',
    descriere:
      'You split the body by movement rather than by muscle: one day everything you push (chest, shoulders, triceps), another everything you pull (back, biceps), a third your legs. Every muscle gets to rest completely, and the workouts stay short and logical. You can run it 3 days a week (one rotation) or 6 (two) — start with 3.',
    frecventa: '3 days a week (or 6, once you have a year of training behind you)',
    durata: '55-70 min',
    etichete: ['PPL', 'split', 'size'],
    saptamana: [
      'The beginner version (3 days): Monday Push · Wednesday Pull · Friday Legs.',
      'The advanced version (6 days): Push · Pull · Legs · Push · Pull · Legs · off.',
      'Do not skip leg day. Everybody jokes about it because everybody does it.',
    ],
    progresie: [
      'Keep the reps inside the range (e.g. 8-12). When you hit the top of the range on every set, add 2.5 kg and drop back to the bottom.',
      'The first exercise of each day is the heavy one — that is the one you track progress on first.',
    ],
    note: [
      'On 3 days a week each muscle is trained once — enough at the start, but when you want more, add the second rotation, not more exercises.',
      'If time is short, cut the last accessory, not the compound lift at the beginning.',
    ],
    antrenamente: [
      {
        nume: 'Push',
        descriere: 'Chest, shoulders, triceps — everything that pushes weight away from you.',
        notite: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
      {
        nume: 'Pull',
        descriere: 'Back, biceps, rear delts — everything that pulls weight towards you.',
        notite: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
      {
        nume: 'Legs',
        descriere: 'Quads, glutes, hamstrings, calves. The day that matters most.',
        notite: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
    ],
  },
  'upper-lower': {
    nume: 'Upper / Lower',
    subtitlu: 'Four days: two for the upper body, two for the lower.',
    origine: 'The standard intermediate structure, used by very nearly every strength coach',
    descriere:
      'The perfect compromise between full body and bodybuilding splits: every muscle group is worked twice a week, but the workouts stay under an hour. It is the logical next step after a few months of full body, when you want more volume without endless sessions.',
    frecventa: '4 days a week',
    durata: '55-70 min',
    etichete: ['upper/lower', 'split', 'intermediate'],
    saptamana: [
      'Monday — Upper A',
      'Tuesday — Lower A',
      'Wednesday — off',
      'Thursday — Upper B',
      'Friday — Lower B',
      'Weekend — off (or a long walk)',
    ],
    progresie: [
      'The A days are the heavy ones: low reps (5-8), heavy weight, long rests. This is where you add kilos.',
      'The B days are the lighter ones: high reps (10-15), moderate weight. This is where you add reps and quality of execution.',
    ],
    note: [
      'If you only manage 3 days in a week, run A-B-A / B-A-B rather than cramming everything in.',
      'Back-to-back upper/lower days are fine — they work different muscles.',
    ],
    antrenamente: [
      {
        nume: 'Upper A · heavy',
        descriere: 'Low reps, heavy weights, long rests.',
        notite: [
          undefined,
          undefined,
          undefined,
          'AMRAP — as many as you can with good form. Stop while you still have one clean rep in reserve.',
          undefined,
          undefined,
        ],
      },
      {
        nume: 'Lower A · heavy',
        descriere: 'Squats and deadlifts. The day real strength gets built.',
        notite: [undefined, undefined, undefined, undefined, undefined],
      },
      {
        nume: 'Upper B · volume',
        descriere: 'High reps, moderate weights, focus on feeling the muscle.',
        notite: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      },
      {
        nume: 'Lower B · volume',
        descriere: 'One leg at a time, machines, calves. Less spine, more muscle.',
        notite: [
          '12 on each leg.',
          undefined,
          undefined,
          undefined,
          undefined,
          'Two sets on each side.',
        ],
      },
    ],
  },
  'wendler-531': {
    nume: 'Wendler 5/3/1 (Boring But Big)',
    subtitlu: 'Four big lifts, percentages of your max, slow and guaranteed progress.',
    origine: 'Jim Wendler, 2009 — "5/3/1: The Simplest and Most Effective Training System"',
    descriere:
      'Every workout has a single main lift, done at percentages worked out from a "training max" (TM). The cycle runs 4 weeks, and at the end you add a little to the TM and start again. The "Boring But Big" variant adds 5 sets of 10 reps of the same lift with light weight — that is where the size comes from. The progress is deliberately slow: this is the programme that keeps you healthy and growing for years, not months.',
    frecventa: '4 days a week (or 3, rotating the lifts)',
    durata: '50-65 min',
    etichete: ['5/3/1', 'strength', 'advanced', 'periodisation'],
    saptamana: [
      'Day 1 — Overhead press · Day 2 — Deadlift · Day 3 — Bench press · Day 4 — Squat',
      'Week 1: 3 sets × 5 reps (65% · 75% · 85% of TM)',
      'Week 2: 3 sets × 3 reps (70% · 80% · 90% of TM)',
      'Week 3: 5 / 3 / 1 reps (75% · 85% · 95% of TM)',
      'Week 4: easy deload (40% · 50% · 60%), 5 reps — compulsory, not optional.',
    ],
    progresie: [
      'TM (training max) = 90% of your true one-rep max. If you do not know it, use the heaviest weight you have done 5 clean reps with.',
      'At the end of each 4-week cycle: +2.5 kg on the TM for overhead press and bench, +5 kg for squat and deadlift.',
      'The last set of each day is done as many as you can (AMRAP) — but always leave one rep in reserve.',
      'Cannot hit the minimum reps? Drop the TM by 10% and carry on. The programme is built for that.',
    ],
    note: [
      'The template in the app is week 1 (3×5). You adjust the weights in the editor each week — the percentages are noted on every set.',
      'Wendler’s golden rule: "start too light". Everybody starts too heavy and stalls in the second month.',
      'Boring But Big = 5 sets × 10 at 50-60% of TM, after the main lift. Boring. Very effective.',
    ],
    antrenamente: [
      {
        nume: '5/3/1 · Overhead press',
        descriere: 'Shoulder day. The lift that grows slowest and teaches you patience.',
        notite: [
          undefined,
          'Main set 1 — 65% of TM.',
          'Main set 2 — 75% of TM.',
          'Main set 3 — 85% of TM, the last one is AMRAP.',
          'Boring But Big — 50-60% of TM.',
          'A pulling accessory, to balance out the pressing.',
        ],
      },
      {
        nume: '5/3/1 · Deadlift',
        descriere: 'The hardest day. Few sets, a lot of concentration.',
        notite: [
          undefined,
          'Main set 1 — 65% of TM.',
          'Main set 2 — 75% of TM.',
          'Main set 3 — 85% of TM, the last one is AMRAP.',
          'Boring But Big — 50-60% of TM. Flawless form or nothing.',
          undefined,
        ],
      },
      {
        nume: '5/3/1 · Bench press',
        descriere: 'Everybody’s favourite day. Do not turn it into a competition.',
        notite: [
          undefined,
          'Main set 1 — 65% of TM.',
          'Main set 2 — 75% of TM.',
          'Main set 3 — 85% of TM, the last one is AMRAP.',
          'Boring But Big — 50-60% of TM.',
          'A pulling accessory, to balance out the pressing.',
        ],
      },
      {
        nume: '5/3/1 · Squat',
        descriere: 'The day that changes how you climb stairs.',
        notite: [
          undefined,
          'Main set 1 — 65% of TM.',
          'Main set 2 — 75% of TM.',
          'Main set 3 — 85% of TM, the last one is AMRAP.',
          'Boring But Big — 50-60% of TM.',
          undefined,
        ],
      },
    ],
  },
  'calistenice-start': {
    nume: 'Calisthenics from zero',
    subtitlu: 'Bodyweight only: at home, in the park or at the gym. No excuses left.',
    origine: 'The classic beginner calisthenics progression',
    descriere:
      'Three whole-body workouts built entirely on your own bodyweight. Every exercise has an easier and a harder version, so the programme grows with you: you start with bench push-ups and inverted rows and end up at pull-ups and dips. All you need is a fixed bar (a park, a gym, or one fitted in a doorway) and a bit of floor space.',
    frecventa: '3 days a week',
    durata: '35-50 min',
    etichete: ['calisthenics', 'bodyweight', 'at home', 'beginner'],
    saptamana: [
      'Monday — Workout A (push)',
      'Wednesday — Workout B (pull)',
      'Friday — Workout C (legs + abs)',
      'On the off days: a 30-40 minute walk.',
    ],
    progresie: [
      'You do not add kilos, you add difficulty. When you get 3 × 12 clean at one version, move to the next hardest.',
      'The pushing ladder: wall push-ups → bench → step → floor → feet raised → dips.',
      'The pulling ladder: inverted row with a high bar → low bar → negative pull-ups → chin-ups → pull-ups.',
      'The leg ladder: bodyweight squats → lunges → Bulgarian split squats → single-leg squats.',
    ],
    note: [
      'Calisthenics build real strength, but adding size is slower than with weights. Both are valid — pick the one you will actually keep doing.',
      'You can do this programme 100% at home if you have a pull-up bar. Without one, swap the pull-ups for TRX rows or a resistance band.',
    ],
    antrenamente: [
      {
        nume: 'Calisthenics A · Push',
        descriere: 'Chest, shoulders, triceps — plus abs at the end.',
        notite: [
          undefined,
          'Lower the support as it starts to feel easy.',
          'Too hard? Bench dips instead.',
          undefined,
          undefined,
          'On each side.',
        ],
      },
      {
        nume: 'Calisthenics B · Pull',
        descriere: 'Back and biceps. This is where your first pull-up gets won.',
        notite: [
          undefined,
          'A warm-up for grip and shoulders.',
          'Lower over 5 seconds. Already got pull-ups? Do them normally, AMRAP.',
          undefined,
          undefined,
          '10 on each side.',
        ],
      },
      {
        nume: 'Calisthenics C · Legs & abs',
        descriere: 'Legs, glutes, core. Zero equipment needed.',
        notite: [
          undefined,
          undefined,
          '12 steps on each leg.',
          '12 on each leg.',
          undefined,
          'No bar? Floor leg raises instead.',
          undefined,
        ],
      },
    ],
  },
};

export const OBIECTIVE_EN: Record<ProgramGoal, string> = {
  forta: 'Strength',
  masa: 'Muscle size',
  slabit: 'Weight loss',
  rezistenta: 'Endurance',
  tehnica: 'Technique',
};

export const ARTICOLE_EN: Record<ArticleId, TextArticol> = {
  'eticheta': {
    titlu: 'Gym etiquette — the unwritten rules',
    rezumat: 'What the regulars do without thinking, and what they politely expect from you.',
    continut: [
      'The good news: nobody is looking at you. Genuinely. Everyone is busy with their own training. The even better news: follow a few simple rules and you are already one of the regulars.',
      '• Put the weights back. Rule number 1, 2 and 3. Plates on the tree, dumbbells on the rack, in size order.',
      '• Towel on the bench, and wipe the machine down after you if you have sweated on it.',
      '• Do not sit on a machine scrolling your phone. Do the set, take a reasonable rest, then move off.',
      '• You are allowed to ask "mind if I work in with you?" — it is completely normal.',
      '• Do not give unsolicited advice, and do not panic if you get some — say thanks and carry on.',
      '• Ask for a spot on the bench ("could you spot me, please?") — no reasonable person says no.',
      'That is it. The rest is training.',
    ],
  },
  'incalzire': {
    titlu: 'The warm-up — 10 minutes that save you a 3-month layoff',
    rezumat: 'Why, how long and how to warm up properly before anything.',
    continut: [
      'A cold muscle is like chewing gum out of the fridge: pull it and it snaps. The same gum, warmed up, stretches. Your physics works the same way.',
      '• 5-8 minutes of easy cardio (incline walking, bike) — until you break a light sweat.',
      '• Joint circles: shoulders, arms, hips, knees — 10 each way.',
      '• On every strength exercise, the first set is a warm-up set: half your working weight, 12-15 reps.',
      'The warm-up set does not count towards your sets, and it is not optional. It is your joints’ ticket into the session.',
      'Long static stretching (holds of 30 seconds or more) is for AFTER training, not before — beforehand it temporarily reduces your strength.',
    ],
  },
  'febra': {
    titlu: 'Muscle soreness — why it hurts and when to worry',
    rezumat: 'DOMS by its technical name. It is normal, it passes, and no, it is not lactic acid.',
    continut: [
      'The day after your first workout you will come down the stairs like a rusty robot. Congratulations, that is entirely normal — it is called DOMS (delayed onset muscle soreness) and it turns up 24-72 hours after unfamiliar work.',
      'The cause: micro-damage in the muscle fibres (the part of the process that makes you stronger), NOT lactic acid — that clears within a few hours.',
      '• What helps: easy movement (a walk, gentle cycling), sleep, water, protein.',
      '• What does not help: sitting completely still on the sofa (paradoxically, that makes it worse).',
      '• You can train other muscle groups with no problem — if your legs ache, train your back.',
      'Warning signs (see a doctor): sharp pain at one precise spot that appeared DURING the exercise, visible swelling, or very dark urine after extreme effort.',
      'After 2-3 weeks of regular training the soreness nearly disappears. That does not mean you have stopped progressing — it means you have adapted.',
    ],
  },
  'supraincarcarea': {
    titlu: 'Progressive overload — the only real secret',
    rezumat: 'How muscle grows: ask it for a little bit more every time.',
    continut: [
      'Muscles grow for exactly one reason: you make them do something slightly harder than last time, and they adapt. That is the whole of the science. Everything else is detail.',
      '"A little bit more" can mean, in order of preference:',
      '• one more rep at the same weight;',
      '• 1-2.5 kg more once you reach the top of your rep range;',
      '• one more set;',
      '• cleaner execution, or a slower lowering.',
      'Which is exactly why this app keeps a journal: you cannot beat what you cannot remember. Every set you log is a target for next time.',
      'The practical rule: pick a range (say 8-12 reps). When you can do 12 clean on every set, put the weight up and drop back to 8. Repeat until you are old.',
      'One caveat: indefinite linear progress is mathematically impossible. Weeks without progress are normal — the trend across months is what counts.',
    ],
  },
  'nutritie': {
    titlu: 'Eating for fat loss and muscle — briefly, and without the cults',
    rezumat: 'A moderate calorie deficit, plenty of protein, patience. The rest is marketing.',
    continut: [
      'Losing weight is arithmetic: you eat fewer calories than you burn, and your body makes up the difference from its reserves. The app works out your daily budget for exactly this.',
      'To lose fat and NOT muscle, two things are non-negotiable:',
      '• Protein: about 1.6-2 g per kg of bodyweight a day (at 100 kg: 160-200 g). Meat, fish, eggs, dairy, pulses.',
      '• Strength training: the signal that tells your body "this muscle is in use, burn something else".',
      '• A moderate deficit (0.25-0.5 kg a week at the start; up to 1 kg if you have a lot to lose). Extreme diets lose muscle and end in the yo-yo.',
      'Yes, as a beginner you can build muscle and lose fat at the same time — it is called body recomposition and it is the superpower of your first year. Make the most of it.',
      'The scales lie in the short term (water, glycogen, salt). Weigh yourself often, but judge only the 7-day average — exactly what the app’s chart shows you.',
    ],
  },
  'hidratare': {
    titlu: 'Hydration — why the app keeps nagging you about water',
    rezumat: 'How much to drink, when, and what happens if you do not.',
    continut: [
      'At 2% dehydration your strength and concentration measurably drop. You sweat more at the gym than you think — hence the water counter on every session.',
      '• Across the day: about 33 ml per kg of bodyweight (at 100 kg ≈ 3.3 litres, including what comes from food).',
      '• At the gym: a few mouthfuls (150-250 ml) every 15-20 minutes, not half a litre in one go.',
      '• Straw-yellow urine = you are fine. Dark yellow = drink more.',
      'Isotonic drinks only start to make sense past about 60-90 minutes of hard work, or if you are sweating heavily. For an hour in the gym, water is all you need.',
      'A practical trick: fill the bottle BEFORE you start training and make it your job to empty it by the end. The +250 ml button in the session does the rest.',
    ],
  },
  'somn': {
    titlu: 'Sleep — the gym builds, the bed finishes the job',
    rezumat: 'Muscle grows while you sleep. Literally.',
    continut: [
      'Training gives the signal, food gives the material, but the actual construction happens in your sleep — that is when growth hormone is released and the fibres are repaired.',
      '• 7-9 hours. Chronically under 6: less strength, more hormonal hunger (ghrelin goes up), slower results.',
      '• A famous study: on the same diet, the group sleeping 5.5 hours lost 55% less fat (and more muscle) than the group on 8.5 hours.',
      '• Late-evening training can delay sleep for some people — if that is you, move your sessions earlier.',
      'If you have to choose between an hour of sleep and an hour at the gym when you are wrecked: choose the sleep. Tomorrow’s session will be twice as good.',
    ],
  },
  'primele-saptamani': {
    titlu: 'Your first 4 weeks — what to expect',
    rezumat: 'A realistic calendar of the beginning, so nothing scares you off.',
    continut: [
      'Week 1: everything is hard, everything aches the next day, the numbers in the app look small. Perfectly normal. Your only goal: turn up three times.',
      'Week 2: the soreness drops dramatically. Last week’s weights already feel lighter — that is your nervous system learning, not (yet) new muscle.',
      'Weeks 3-4: the first visible progress in the journal — more reps, the first extra kilos on the machines. The scales may be chaotic (water retention from training) — ignore them, watch the average.',
      'Months 2-3: your clothes sit differently, your day-to-day energy goes up, and the gym starts to feel like your place.',
      '• The golden rule of the beginning: consistency beats intensity. Three average workouts a week, month after month, beat any heroic week followed by giving up.',
      'And if you miss a week? Nothing is lost — you simply come back. The streak restarts, and muscle has memory (literally, it is a real cellular mechanism).',
    ],
  },
};

export const SABLOANE_START_EN: TextSablonStart[] = [
  {
    nume: 'First day at the gym',
    descriere:
      'A settling-in tour: a bit of everything, light weights, zero embarrassment. The aim is to leave smiling, not wrecked.',
    etichete: ['beginner', 'full body'],
  },
  {
    nume: 'Full Body A',
    descriere:
      'The A half of the 3 days/week programme (A-B-A, then B-A-B). Pushing and legs dominant.',
    etichete: ['beginner', 'full body', 'strength'],
  },
  {
    nume: 'Full Body B',
    descriere: 'The B half: pulling and posterior chain dominant. Alternate it with A.',
    etichete: ['beginner', 'full body', 'strength'],
  },
  {
    nume: 'Cardio + Core',
    descriere:
      'A day for burning calories and a solid middle — ideal between strength days, or when you want something lighter.',
    etichete: ['cardio', 'abs', 'weight loss'],
  },
];

export const SFATURI_EN: string[] = [
  'The heaviest weight in the gym is the front door. Have you lifted it today?',
  'Do not compare yourself with the bloke next to you. Compare yourself with you a month ago — that is what the journal is for.',
  'Form first, weight second. One clean set with 10 kg beats three ugly ones with 20.',
  'Muscles have no idea what day it is. Habits do — train on the same days every week.',
  'Water is the most underrated supplement. And the only free one.',
  'One more rep than last time equals progress. It really is that simple.',
  'The rest between sets is not wasted time — that is where the muscle reloads. Respect it.',
  'Soreness is not a medal. The progress in your journal is the medal.',
  'The day you do not fancy it is the day that counts double. Do half a session at least.',
  'The scales are a gossip with a short memory. The 7-day average is the serious friend.',
  'Sleep is your second training session. Sleep 8 hours and you grow in your sleep too.',
  'There is no such thing as "too slow". There is only moving and stopped.',
  'The warm-up set is your joints’ ticket in. Do not go in without a ticket.',
  'Protein at every main meal — muscle is built out of bricks, not promises.',
  'Put the phone down between sets. A 90-second rest becomes 5 minutes without you noticing.',
  'Every regular in this gym was, without exception, a noob. Some of them clumsier than you.',
  'Log your sets the moment you finish them. Memory lies, the journal does not.',
  'A mediocre workout you did beats a perfect workout you planned and postponed.',
];

export const INCURAJARI_SET_EN: string[] = [
  'Set logged. That is how it gets built!',
  'Another one for the collection. Nice.',
  'Ticked off! The muscles got the message.',
  'Solid. Rest up and on we go.',
  'Now that was clean. Next!',
];

export const INCURAJARI_FINAL_EN: string[] = [
  'Session done! Your body thanks you (tomorrow it may thank you with soreness, but it is still thanks).',
  'Finished! You have done what 90% of people only ever plan.',
  'Workout in the bag. Now good food and sleep — that is where today’s work actually finishes.',
];
