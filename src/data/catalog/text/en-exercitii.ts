import type { ExerciseId } from '../ids';
import type { TextExercitiu } from './types';

/**
 * The English text for all 98 exercises.
 *
 * This is domain knowledge, not translation. The equipment names are what a
 * British gym-goer actually calls the thing — lat pulldown, leg press, pec deck,
 * cross-trainer, EZ bar, preacher curl — rather than a word-for-word rendering
 * of the Romanian (helcometru, presă de picioare, pupitru). Where the Romanian
 * name carries an English term in brackets because that is what people say in
 * the gym, the English drops the bracket and just says it.
 *
 * The numbers, the muscles and the MET values are NOT here: those live once, in
 * the cores (`exercises-*.ts`). Only prose is per-language, which is why they
 * cannot drift apart.
 */
export const EXERCITII_EN: Record<ExerciseId, TextExercitiu> = {
  'mers-inclinat-banda': {
    nume: 'Incline walking on the treadmill',
    echipamentNume: 'Treadmill',
    forma: [
      'Stand tall, do not hang onto the handles — let your arms swing naturally at your sides.',
      'Full stride: heel–sole–toe, eyes forward, not down at your phone.',
      '8-12% incline at 5-6 km/h is the golden combination for burning fat without running.',
    ],
    utilizare: [
      'Step on from the side rails, start the belt with the Start button, then bring the speed up gradually with the arrows.',
      'Set the incline (INCLINE) once you have found your walking rhythm.',
      'Bring the speed down over the last 1-2 minutes — never hop off a moving belt!',
    ],
    greseli: [
      'Holding the handles cancels most of the effort (your body just hangs there).',
      'Leaning forward tires your lower back for nothing.',
    ],
    ponturi: [
      'The safety clip attached to your shirt stops the belt if you slip. Use it.',
      '10 minutes of incline walking is an excellent warm-up before lifting.',
    ],
  },
  'alergare-banda': {
    nume: 'Running on the treadmill',
    echipamentNume: 'Treadmill',
    forma: [
      'Short, quick strides, landing mid-foot underneath your body.',
      'Shoulders relaxed, elbows at about 90°, hands soft.',
      'Breathe in rhythm: two steps in, two steps out.',
    ],
    utilizare: [
      'Start with 2-3 minutes of walking, then build up to running pace.',
      'A 1% incline mimics running outdoors.',
    ],
    greseli: [
      'Starting straight in at high speed — an open invitation to injury.',
      'Overstriding (landing on your heel well ahead of your body) — it jars your knees.',
    ],
    ponturi: [
      'If you are gasping and cannot speak at all, you have left the fat-burning zone. Slow down.',
      'The kind option when you are carrying extra weight: 1:1 walk/run intervals.',
    ],
  },
  'bicicleta-stationara': {
    nume: 'Stationary bike',
    echipamentNume: 'Exercise bike',
    forma: [
      'Saddle at hip height when you stand beside the bike; your knee stays slightly bent at the bottom of the pedal stroke.',
      'Back straight, hands relaxed on the bars.',
      'Steady cadence of 70-90 revolutions a minute.',
    ],
    utilizare: [
      'Adjust the saddle BEFORE you get on — that is the whole secret to comfort.',
      'Turn the resistance up with the dial until you feel it, but can still hold the cadence.',
    ],
    greseli: [
      'Saddle too low — guaranteed knee ache.',
      'Zero resistance and spinning thin air — you burn almost nothing.',
    ],
    ponturi: [
      'The kindest cardio option for your joints — ideal at the start of the road.',
    ],
  },
  'eliptica': {
    nume: 'Cross-trainer workout',
    echipamentNume: 'Cross-trainer',
    forma: [
      'Whole foot stays on the pedal, the movement is smooth, no bouncing.',
      'Push and pull the moving handles too — that brings your upper body in.',
      'Stand tall, without slumping onto the console.',
    ],
    utilizare: [
      'Start pedalling; on most models the console wakes up on its own.',
      'Resistance and, on some machines, incline are set from the console.',
    ],
    greseli: [
      'Resting all your weight on the fixed handles.',
      'Only your toes on the pedals — your feet go numb.',
    ],
    ponturi: [
      'Zero impact on the knees — perfect for days when your legs are already tired.',
    ],
  },
  'vaslit-aparat': {
    nume: 'Rowing machine',
    echipamentNume: 'Rowing machine (ergo)',
    forma: [
      'The right order: push with your LEGS → lean the torso back a little → pull the handle to the bottom of your chest.',
      'Coming back, exactly the reverse: arms → torso → knees.',
      'Back stays straight the whole time, shoulders down.',
    ],
    utilizare: [
      'Strap your feet in properly tight.',
      'A damper setting of 3-5 is plenty — higher is not better.',
    ],
    greseli: [
      'Pulling with your arms before your legs — the legs do 60% of the work.',
      'Rounding your back as you come forward.',
    ],
    ponturi: [
      'Cardio and back in one exercise — the most underrated machine in the gym.',
    ],
  },
  'stepper': {
    nume: 'Stair climbing on the stepper',
    echipamentNume: 'Stepper (stair climber)',
    forma: [
      'Full step onto each stair, driving through the heel.',
      'Hands for balance only, not for support.',
      'Stand tall, no leaning on the console.',
    ],
    utilizare: [
      'Start slow — stairs do not forgive.',
      'The STOP button is right there; use it if you lose the rhythm.',
    ],
    greseli: [
      'Leaning your whole weight on the handles — you cancel half the calories.',
    ],
    ponturi: [
      'The highest calorie burn per minute of any cardio machine at the same perceived effort.',
    ],
  },
  'sarituri-coarda': {
    nume: 'Skipping',
    echipamentNume: 'Skipping rope',
    forma: [
      'Small jumps, on the balls of your feet, knees soft.',
      'The turn comes from your wrists, not your shoulders.',
      'Eyes forward, body tall.',
    ],
    utilizare: [
      'Right length: stand on the middle of the rope and the handles should reach your armpits.',
    ],
    greseli: [
      'Jumping too high — you tire fast and jar your ankles.',
    ],
    ponturi: [
      '30 seconds of skipping is worth a good minute of running in effort. Ideal at the end of a workout.',
    ],
  },
  'impins-piept-aparat': {
    nume: 'Machine chest press',
    echipamentNume: 'Chest press machine',
    forma: [
      'Set the seat so the handles line up with the middle of your chest.',
      'Shoulder blades pinned to the backrest, chest pushed forward.',
      'Press under control to nearly straight arms, come back slowly (2-3 seconds).',
    ],
    utilizare: [
      'The pin in the weight stack picks the load — start light and build up.',
      'Many machines have a foot lever that brings the handles forward so you can get set easily.',
    ],
    greseli: [
      'Snapping your elbows locked at the top.',
      'Shoulders shrugged up to your ears instead of tucked down.',
      'Letting the weight drop back on the way down.',
    ],
    ponturi: [
      'The safest way to start training chest — the path is guided, nothing can fall on you.',
    ],
  },
  'impins-gantere-banca': {
    nume: 'Dumbbell bench press',
    echipamentNume: 'Dumbbells + flat bench',
    forma: [
      'Lying on the bench, feet planted, shoulder blades squeezed together.',
      'Dumbbells start level with your chest, elbows about 45° from your body (not straight out).',
      'Press in a slight arc — the dumbbells come together at the top without clashing.',
    ],
    utilizare: [
      'Sit with the dumbbells on your knees, then kick them one at a time towards your shoulders as you lie back.',
      'To finish, bring the dumbbells to your chest and lift your knees — you come up with them.',
    ],
    greseli: [
      'Elbows straight out from the body — pointless stress on the shoulders.',
      'Arching your back excessively.',
      'Weights too heavy, control gone.',
    ],
    ponturi: [
      'Compared with a barbell, dumbbells let your shoulders move naturally — friendlier at the start.',
      'Each arm works on its own — the strong side cannot cover for the weak one.',
    ],
  },
  'impins-haltera-banca': {
    nume: 'Barbell bench press',
    echipamentNume: 'Barbell + bench with uprights',
    forma: [
      'Grip a little wider than your shoulders, wrists straight.',
      'The bar comes down under control to the bottom of your chest, elbows at about 45-70°.',
      'Press explosively, breathing out at the top. Shoulder blades stay squeezed.',
    ],
    utilizare: [
      'An empty Olympic bar already weighs 20 kg — start with just that.',
      'Collars on the bar, always.',
      'Ask for a hand ("could you spot me?") on heavy sets — nobody ever says no.',
    ],
    greseli: [
      'Bouncing the bar off your chest.',
      'Backside coming off the bench.',
      'No spotter on heavy weights — genuinely dangerous.',
    ],
    ponturi: [
      'Progress by 2.5 kg a session, not 10.',
      'The barbell only makes sense once dumbbell pressing is solid.',
    ],
  },
  'fluturari-aparat': {
    nume: 'Pec deck flyes',
    echipamentNume: 'Pec deck machine',
    forma: [
      'Seat set so the handles are at chest height.',
      'Elbows slightly bent and fixed — the movement comes from the shoulders, like a hug.',
      'Squeeze for a second at the front, come back slowly without letting the plates touch.',
    ],
    utilizare: [
      'Pin in the stack for the weight; some models have a lever that pre-stretches you into the start position.',
    ],
    greseli: [
      'Bending your elbows turns the exercise into a press.',
      'Opening too far back — your shoulder pays for it.',
    ],
    ponturi: [
      'Excellent at the end of a chest session, with higher reps (12-15).',
    ],
  },
  'fluturari-gantere': {
    nume: 'Dumbbell flyes on a bench',
    echipamentNume: 'Dumbbells + flat bench',
    forma: [
      'Arms almost straight (a fixed, slight bend at the elbow) above your chest.',
      'Open wide until you feel the stretch across your chest — no lower than shoulder level.',
      'Close along the same arc, as if you were hugging a barrel.',
    ],
    utilizare: [
      'Use noticeably lighter dumbbells than you press with — half is a good starting point.',
    ],
    greseli: [
      'Going too deep — risky for the shoulders.',
      'Turning it into a press by bending the elbows.',
    ],
    ponturi: [
      'This one is about stretch and control, not weight. Leave the ego in the changing room.',
    ],
  },
  'flotari': {
    nume: 'Push-ups',
    echipamentNume: 'Bodyweight (mat)',
    forma: [
      'Body in one straight plank from head to heels, core braced.',
      'Hands a little wider than your shoulders, elbows at about 45°.',
      'Lower your chest close to the floor, press all the way back up.',
    ],
    utilizare: [
      'Full push-ups not there yet? Do them with your hands on a bench (incline) — that scales the difficulty properly, unlike doing them from your knees.',
    ],
    greseli: [
      'Hips sagging, or arched up like a cat.',
      'Half reps — go all the way down.',
      'Craning your neck at the floor.',
    ],
    ponturi: [
      'Progression: high bench → low bench → floor. When you get 15 on the floor, you have officially left noob level.',
    ],
  },
  'cablu-crossover': {
    nume: 'Cable crossover',
    echipamentNume: 'Cable crossover machine',
    forma: [
      'Pulleys high, one foot forward for stability.',
      'Pull the handles down and forward in an arc until they meet in front of your navel.',
      'Come back slowly, feeling the stretch across your chest.',
    ],
    utilizare: [
      'Set the pulley height with the pin on the side of the column.',
      'Weight from each column stack, matched on both sides.',
    ],
    greseli: [
      'Leaning far forward and throwing the weight.',
      'Elbows that bend as you go.',
    ],
    ponturi: [
      'Constant tension through the whole arc — the pump is guaranteed.',
    ],
  },
  'tractiuni-helcometru': {
    nume: 'Lat pulldown',
    echipamentNume: 'Lat pulldown machine',
    forma: [
      'Grip wider than your shoulders, knees locked under the pads.',
      'Pull the bar to the base of your neck by driving your ELBOWS DOWN, not by pulling with your arms.',
      'Chest up, only a very slight lean back; return slowly and completely.',
    ],
    utilizare: [
      'Adjust the knee pads while you are sitting down.',
      'The pin in the stack picks the weight.',
    ],
    greseli: [
      'Swinging your torso to rip the weight down.',
      'Pulling the bar behind your neck — a recipe for a shoulder injury.',
      'Half reps.',
    ],
    ponturi: [
      'Think "elbows into your back pockets" — the biceps quieten down and your back takes over.',
      'The road to your first pull-up runs through here.',
    ],
  },
  'ramat-cablu-asezat': {
    nume: 'Seated cable row',
    echipamentNume: 'Seated cable row machine',
    forma: [
      'Feet on the plates, knees slightly bent, back straight.',
      'Pull the handle to your navel, squeezing the shoulder blades at the end.',
      'Return with your arms fully extended, without rounding your back.',
    ],
    utilizare: [
      'The narrow triangle handle is the classic; you can vary it with a wide bar.',
    ],
    greseli: [
      'Rocking your torso back and forth as if you were on the rower.',
      'Shoulders shrugged towards your ears.',
    ],
    ponturi: [
      'Keep your chest proud the whole way through — the posture fixes itself.',
    ],
  },
  'ramat-gantera': {
    nume: 'One-arm dumbbell row',
    echipamentNume: 'Dumbbell + flat bench',
    forma: [
      'Knee and hand on the bench, back parallel to the floor and flat.',
      'Pull the dumbbell towards your hip (not your shoulder), elbow close to your body.',
      'Lower slowly, all the way to a fully extended arm.',
    ],
    utilizare: [
      'Finish all the reps on one side, then swap.',
    ],
    greseli: [
      'Twisting your torso to help it up.',
      'Pulling with your biceps instead of your back.',
    ],
    ponturi: [
      'Imagine you are starting a petrol mower — that is exactly the movement.',
    ],
  },
  'ramat-aparat': {
    nume: 'Chest-supported row machine',
    echipamentNume: 'Chest-supported row machine',
    forma: [
      'Chest against the pad for the WHOLE movement.',
      'Pull the handles towards you with your elbows close to your body.',
      'Squeeze the shoulder blades for a second, come back slowly.',
    ],
    utilizare: [
      'Set the seat so the handles are at chest height.',
      'Pin in the stack for the weight.',
    ],
    greseli: [
      'Peeling your chest off the pad to shift heavier weight.',
    ],
    ponturi: [
      'The chest support makes cheating impossible — this is your back’s real strength.',
    ],
  },
  'hiperextensii': {
    nume: 'Back extensions',
    echipamentNume: 'Roman chair (back extension bench)',
    forma: [
      'Pads level with your hips, ankles locked in.',
      'Lower your torso under control, back flat, to about 90°.',
      'Come up until your body is in one straight line — NO higher.',
    ],
    utilizare: [
      'Set the hip pad height so the crease of your hip sits free just above it.',
    ],
    greseli: [
      'Over-extending at the top (arching) — that is where this exercise gets its bad name.',
      'Jerky movements.',
    ],
    ponturi: [
      'A strong lower back built here protects you on every other exercise. Do them weekly.',
    ],
  },
  'indreptari-romanesti': {
    nume: 'Romanian deadlift',
    echipamentNume: 'Barbell',
    forma: [
      'The bar stays almost brushing your legs the whole way.',
      'Push your HIPS back, knees only slightly bent, back perfectly flat.',
      'Go down until you feel the hamstrings stretch (usually just below the knee), then come up squeezing your glutes.',
    ],
    utilizare: [
      'Start with an empty bar or light dumbbells, side-on to a mirror.',
    ],
    greseli: [
      'Rounding your back — the golden rule: better to stop higher with a flat back than go lower hunched.',
      'Letting the bar drift away from your body.',
    ],
    ponturi: [
      'Yes, the exercise really is called "Romanian" the world over. Wear it with pride.',
    ],
  },
  'face-pull': {
    nume: 'Cable face pull',
    echipamentNume: 'Cable machine + rope',
    forma: [
      'Pulley at face height, rope held in both hands.',
      'Pull the ends of the rope towards your ears, flaring your elbows wide.',
      'Squeeze the shoulder blades, come back slowly.',
    ],
    utilizare: [
      'Light weight, high reps (15-20) — this is a health exercise, not a strength one.',
    ],
    greseli: [
      'Too much weight and pulling with your whole body.',
    ],
    ponturi: [
      'The antidote to sitting at a desk. Shoulders that have rolled forward open up within weeks.',
    ],
  },
  'tractiuni-bara': {
    nume: 'Pull-ups (assisted or unassisted)',
    echipamentNume: 'Pull-up bar / assisted pull-up machine',
    forma: [
      'Grip a little wider than your shoulders, hanging fully at the start.',
      'Pull your chest towards the bar by driving your elbows down.',
      'Lower under control, all the way — half reps do not count.',
    ],
    utilizare: [
      'On the assisted machine you kneel on the platform, and the weight you select PUSHES you up (more weight = easier!).',
      'Alternatively: a resistance band looped over the bar and under your knees.',
    ],
    greseli: [
      'Swinging your body (kipping) to get your chin over the bar.',
      'Craning your neck desperately instead of actually pulling.',
    ],
    ponturi: [
      'Your first unassisted pull-up is an official celebration in this app. Work the pulldown and the assisted version until the day comes.',
    ],
  },
  'presa-umeri-gantere': {
    nume: 'Dumbbell shoulder press',
    echipamentNume: 'Dumbbells + upright bench',
    forma: [
      'Backrest nearly vertical, dumbbells at ear height, palms facing forward.',
      'Press up until your arms are almost straight, the dumbbells coming together overhead.',
      'Lower slowly, back to your ears.',
    ],
    utilizare: [
      'Rest the dumbbells on your knees and kick them up to your shoulders one at a time.',
    ],
    greseli: [
      'Arching your back hard (you have turned it into an incline press).',
      'Only coming down a few centimetres.',
    ],
    ponturi: [
      'A braced core protects your lower back — imagine someone is about to punch you in the stomach.',
    ],
  },
  'presa-umeri-aparat': {
    nume: 'Machine shoulder press',
    echipamentNume: 'Shoulder press machine',
    forma: [
      'Seat set so the handles start at shoulder height.',
      'Press straight up, lower under control.',
      'Back flat against the backrest.',
    ],
    utilizare: [
      'Pin in the stack for the weight; many models have start levers within easy reach.',
    ],
    greseli: [
      'Seat too low — you start from a position that punishes your shoulders.',
    ],
    ponturi: [
      'The lowest-risk option for a beginner’s shoulders.',
    ],
  },
  'ridicari-laterale': {
    nume: 'Dumbbell lateral raises',
    echipamentNume: 'Dumbbells',
    forma: [
      'Standing, dumbbells at your sides, elbows very slightly bent.',
      'Raise out to the side to shoulder height — as if you were pouring water from two jugs.',
      'Lower SLOWLY — half the exercise is the way down.',
    ],
    utilizare: [
      'Small dumbbells. Seriously. 2-6 kg is all you need for months.',
    ],
    greseli: [
      'Bouncing from the knees and torso because the dumbbells are too heavy.',
      'Going above shoulder height with your shoulders hunched up to your ears.',
    ],
    ponturi: [
      '"3D" shoulders come from doing this one cleanly, not from heavy weight.',
    ],
  },
  'ridicari-frontale': {
    nume: 'Dumbbell front raises',
    echipamentNume: 'Dumbbells',
    forma: [
      'Raise the dumbbells in front of you, alternating or together, up to shoulder height.',
      'Elbows nearly straight, controlled movement, no swing.',
    ],
    utilizare: [
      'You can also use a single plate held in both hands.',
    ],
    greseli: [
      'Rocking your torso back on every rep.',
    ],
    ponturi: [
      'If you already do shoulder presses, front raises are optional — the front of the shoulder gets plenty of work anyway.',
    ],
  },
  'fluturari-inverse': {
    nume: 'Reverse flyes (rear delts)',
    echipamentNume: 'Pec deck (reversed) or dumbbells',
    forma: [
      'On the machine: chest to the pad, handles in front, open your arms out and back.',
      'With dumbbells: bent over with a flat back, open your arms out to the side like wings.',
      'Squeeze the shoulder blades at the end, come back slowly.',
    ],
    utilizare: [
      'On the pec deck, move the handles into the "reverse" position (facing back) — they have a ratchet adjustment.',
    ],
    greseli: [
      'Heavy weight and jerking — the rear delt is a small muscle.',
    ],
    ponturi: [
      'The most neglected muscle in beginners, and the reason shoulders roll forward. Do not skip it.',
    ],
  },
  'flexii-gantere': {
    nume: 'Dumbbell biceps curls',
    echipamentNume: 'Dumbbells',
    forma: [
      'Elbows pinned to your sides — they are hinges, they do not travel forward.',
      'Curl up, rotating your palm upwards (supination), squeeze for a beat at the top.',
      'Lower slowly and fully — the arm straightens completely.',
    ],
    utilizare: [
      'Alternating or together; alternating lets you handle a bit more weight.',
    ],
    greseli: [
      'Rocking backwards on every rep.',
      'Elbows drifting forward — it becomes a front raise.',
      'Letting the weight drop on the way down.',
    ],
    ponturi: [
      'Want arms? A slow 3-second lowering does more than an extra 5 kg.',
    ],
  },
  'flexii-bara-z': {
    nume: 'EZ bar biceps curls',
    echipamentNume: 'EZ bar',
    forma: [
      'Grip the angled sections of the bar — that bend is exactly why it exists, it spares your wrists.',
      'Same rules: elbows fixed, controlled up, slow down.',
    ],
    utilizare: [
      'Load the plates evenly and lock them with collars.',
    ],
    greseli: [
      'Thrusting your hips forward to help the bar up.',
    ],
    ponturi: [
      'Both arms work together — easier to add weight than with dumbbells.',
    ],
  },
  'flexii-ciocan': {
    nume: 'Hammer curls',
    echipamentNume: 'Dumbbells',
    forma: [
      'Like normal curls, but your palms stay facing each other throughout (as if holding a hammer).',
      'Elbows fixed, no swinging.',
    ],
    utilizare: [
      'Works brilliantly alternating, at the end of an arms day.',
    ],
    greseli: [
      'Same as normal curls: swinging and travelling elbows.',
    ],
    ponturi: [
      'Thickens the forearm and fills out the arm seen from the side.',
    ],
  },
  'flexii-cablu': {
    nume: 'Cable biceps curls',
    echipamentNume: 'Cable machine (low pulley)',
    forma: [
      'Pulley low, short bar attached.',
      'One step back, elbows fixed at your sides, full curl.',
    ],
    utilizare: [
      'Swap the attachment (straight bar, rope) to taste — the clip comes off easily.',
    ],
    greseli: [
      'Standing too close to the machine — you lose all the tension at the bottom.',
    ],
    ponturi: [
      'The cable keeps the muscle under tension at the bottom too, where dumbbells go slack. Maximum pump.',
    ],
  },
  'extensii-cablu-triceps': {
    nume: 'Cable triceps pushdown',
    echipamentNume: 'Cable machine + rope or short bar',
    forma: [
      'Pulley high, elbows pinned to your sides — hinges again.',
      'Push down until your arms are fully straight; with the rope, split the ends apart at the bottom.',
      'Come back slowly until your forearms pass parallel.',
    ],
    utilizare: [
      'The rope is the kindest option for your elbows when starting out.',
    ],
    greseli: [
      'Elbows drifting away from your body — it becomes a chest exercise.',
      'Leaning your whole weight over the cable.',
    ],
    ponturi: [
      'The triceps is two thirds of the thickness of your arm. Want thick arms? Triceps first.',
    ],
  },
  'extensii-ganteră-cap': {
    nume: 'Overhead triceps extension',
    echipamentNume: 'Dumbbell',
    forma: [
      'Held in both hands by the top plate, the dumbbell starts above your head.',
      'Lower it behind your head by bending ONLY your elbows.',
      'Straighten your arms fully — your elbows stay close to your ears.',
    ],
    utilizare: [
      'Standing, or seated on a bench with a backrest; seated is more stable to begin with.',
    ],
    greseli: [
      'Elbows flaring wide out to the sides.',
      'Arching your back because the weight is too heavy.',
    ],
    ponturi: [
      'The only position that fully stretches the long head of the triceps — it earns its place in a programme.',
    ],
  },
  'fondari-paralele': {
    nume: 'Assisted dips',
    echipamentNume: 'Parallel bars / assisted dip machine',
    forma: [
      'Arms straight at the start, body upright (triceps) or leaning slightly forward (chest).',
      'Lower until your arm is at about 90° at the elbow, no further.',
      'Press back up without snapping your elbows locked.',
    ],
    utilizare: [
      'On the assisted machine, knees on the platform; more weight selected = more help.',
    ],
    greseli: [
      'Going too deep — your shoulders will complain.',
      'Shoulders shrugged towards your ears.',
    ],
    ponturi: [
      'The king of bodyweight triceps exercises. Start assisted, no shame in it.',
    ],
  },
  'dips-banca': {
    nume: 'Bench dips (triceps)',
    echipamentNume: 'Flat bench',
    forma: [
      'Palms on the edge of the bench, legs out in front.',
      'Lower your backside alongside the bench, bending your elbows to about 90°.',
      'Press back up through your triceps.',
    ],
    utilizare: [
      'Knees bent is easier; feet up on a second bench is harder.',
    ],
    greseli: [
      'Shoulders hunching up to your ears on the way down.',
      'Backside drifting away from the bench.',
    ],
    ponturi: [
      'An excellent fallback when the machines are all taken.',
    ],
  },
  'presa-picioare': {
    nume: 'Leg press',
    echipamentNume: 'Leg press',
    forma: [
      'Feet on the platform at shoulder width, back and backside PRESSED into the seat.',
      'Lower under control until your knees are at about 90°.',
      'Drive through your heels without locking your knees out at the end.',
    ],
    utilizare: [
      'Release the side safety catches AFTER you have taken the weight on your legs; put them back before you get off.',
      'Plates or a stack, depending on the model. Start modest — the leg press is forgiving, but not that forgiving.',
    ],
    greseli: [
      'Knees touching each other (collapsing inwards).',
      'Going so deep that your backside lifts off the seat — dangerous for your lower back.',
      'Aggressively locking the knees at the top.',
    ],
    ponturi: [
      'A beginner’s best friend for legs: all the load, none of the balance problems.',
    ],
  },
  'genuflexiuni-corp': {
    nume: 'Bodyweight squats',
    echipamentNume: 'Bodyweight',
    forma: [
      'Feet at shoulder width, toes pointed slightly out.',
      'Backside back and down as if sitting into a chair; chest up.',
      'Go as low as you can keeping your heels down, drive back up through your heels.',
    ],
    utilizare: [
      'You can start with a box or bench behind you — sit down briefly and stand back up.',
    ],
    greseli: [
      'Heels lifting off the floor.',
      'Knees collapsing inwards.',
      'Staring at the floor with a hunched back.',
    ],
    ponturi: [
      'Own 20 clean reps before you put a bar on your back. The foundation of all leg strength.',
    ],
  },
  'genuflexiuni-smith': {
    nume: 'Smith machine squats',
    echipamentNume: 'Smith machine (guided bar)',
    forma: [
      'Bar on your traps (not on your neck!), feet slightly in front of the bar.',
      'Lower under control until your thighs are parallel with the floor.',
      'Drive through your heels, twisting the bar at the top to hook it back in.',
    ],
    utilizare: [
      'You rotate the bar to release it from the hooks; the same twist puts it back.',
      'Set the safety stops just below the lowest point of your squat.',
    ],
    greseli: [
      'Feet directly under the bar — it pushes you forwards.',
      'Half reps with a heavy weight for show.',
    ],
    ponturi: [
      'A guided bar means balance is solved for you. The perfect stepping stone to free squats.',
    ],
  },
  'extensii-cvadriceps': {
    nume: 'Leg extensions',
    echipamentNume: 'Leg extension machine',
    forma: [
      'Pad on your ankle, knee lined up with the machine’s pivot.',
      'Straighten your legs fully, hold for a second at the top.',
      'Lower slowly, without letting the stack crash down.',
    ],
    utilizare: [
      'Adjust the backrest so your knee sits right at the edge of the seat, level with the pivot.',
    ],
    greseli: [
      'Yanking the weight up with momentum from your hips.',
      'Lifting your backside off the seat.',
    ],
    ponturi: [
      'The burn at the end is normal and harmless — the quads are dramatic by nature.',
    ],
  },
  'flexii-ischiogambieri': {
    nume: 'Leg curls',
    echipamentNume: 'Leg curl machine',
    forma: [
      'Lying face down (or seated, depending on the model), pad above your heels.',
      'Curl your heels towards your backside under control.',
      'Return slowly, without letting the weight drag you back.',
    ],
    utilizare: [
      'Knees lined up with the machine’s pivot; adjust the pad for the length of your legs.',
    ],
    greseli: [
      'Hips lifting off the pad on the lying version.',
      'Yanked reps.',
    ],
    ponturi: [
      'Hamstrings balance the knee. Do them at every leg session, not just quads.',
    ],
  },
  'fandari-gantere': {
    nume: 'Dumbbell lunges',
    echipamentNume: 'Dumbbells',
    forma: [
      'Big step forward, drop straight down until both knees are at about 90°.',
      'The back knee comes towards the floor without touching it.',
      'Drive through the heel of the front foot to come back up.',
    ],
    utilizare: [
      'Start with no weight at all, just your body, near a wall for balance.',
    ],
    greseli: [
      'Step too short — the front knee travels well past the toes.',
      'Torso leaning forward.',
    ],
    ponturi: [
      'Works your balance and each leg separately — differences between legs show up immediately.',
    ],
  },
  'ridicari-gambe': {
    nume: 'Standing calf raises',
    echipamentNume: 'Calf machine / step + dumbbell',
    forma: [
      'Toes on the edge, heels free.',
      'Drop your heels below the level until you feel the stretch, then rise as high onto your toes as you can.',
      'Short pause at the top, slow on the way down.',
    ],
    utilizare: [
      'On the machine: shoulders under the pads, weight from the stack. Without a machine: a step and a dumbbell in your hand.',
    ],
    greseli: [
      'Fast little bounces over a small range — calves respond to full range.',
    ],
    ponturi: [
      'Calves take a lot of volume: 15-20 reps a set, 2-3 times a week.',
    ],
  },
  'hip-thrust': {
    nume: 'Hip thrust',
    echipamentNume: 'Bench + barbell (or just bodyweight)',
    forma: [
      'Shoulder blades resting on the bench, feet on the floor, bar across your hips (with a pad!).',
      'Drive your hips up until your torso is parallel with the floor, squeezing your glutes.',
      'Chin tucked, eyes forward; lower under control.',
    ],
    utilizare: [
      'Start with no bar at all — just your body, then one plate, then the bar with a protective pad.',
    ],
    greseli: [
      'Arching your lower back at the top instead of squeezing your glutes.',
      'Pushing through your toes instead of your heels.',
    ],
    ponturi: [
      'The single most effective pure glute exercise, full stop. It is not "just for women" — it helps every lift you do.',
    ],
  },
  'abductii-aparat': {
    nume: 'Hip abduction machine',
    echipamentNume: 'Hip abduction machine',
    forma: [
      'Seated, knees against the outer pads.',
      'Open your legs against the resistance, hold for a beat, come back slowly.',
    ],
    utilizare: [
      'Pin in the stack; some models have a lever that brings the pads together for a comfortable start.',
    ],
    greseli: [
      'Momentum and slamming the plates on the way back.',
    ],
    ponturi: [
      'The gluteus medius stabilises your pelvis — useful for healthy knees when running too.',
    ],
  },
  'plank': {
    nume: 'Plank',
    echipamentNume: 'Mat',
    forma: [
      'Elbows under your shoulders, body one perfect line from head to heels.',
      'Core and glutes braced; do not let your hips drop.',
      'Breathe normally — do not hold your breath.',
    ],
    utilizare: [
      'Time it: start at 20-30 seconds, add 5-10 seconds a week.',
    ],
    greseli: [
      'Hips too high (a tent) or too low (a hammock).',
      'Head dropped, or lifted too far.',
    ],
    ponturi: [
      'Better 3×30 perfect seconds than 2 shaky minutes with a sagging back.',
    ],
  },
  'crunch-saltea': {
    nume: 'Crunches on a mat',
    echipamentNume: 'Mat',
    forma: [
      'On your back, knees bent, fingertips at your temples (not behind your head!).',
      'Lift ONLY your shoulder blades off the floor, pressing your lower back into the mat.',
      'Breathe out on the way up, lower slowly.',
    ],
    utilizare: [
      'No equipment needed; a thicker mat is kinder to your back.',
    ],
    greseli: [
      'Pulling on the back of your head with your hands.',
      'Lifting your whole torso (that is a different movement, with different stress on your lower back).',
    ],
    ponturi: [
      'Small range plus maximum contraction equals a proper crunch. Do not count the yanked reps.',
    ],
  },
  'crunch-aparat': {
    nume: 'Machine crunch',
    echipamentNume: 'Ab crunch machine',
    forma: [
      'Chest on the pad or hands on the handles, depending on the model.',
      'Roll your torso down using your abs, not your arms.',
      'Come back slowly, without letting the stack drop.',
    ],
    utilizare: [
      'Moderate weight — abs respond to execution, not tonnage.',
    ],
    greseli: [
      'Pulling with your arms while your abs take a holiday.',
    ],
    ponturi: [
      'The advantage over the mat: you can add weight and measure the progress.',
    ],
  },
  'ridicari-picioare': {
    nume: 'Captain’s chair knee raises',
    echipamentNume: 'Captain’s chair / dip station with a backrest',
    forma: [
      'Forearms on the pads, back against the rest.',
      'Raise your knees towards your chest, curling your pelvis slightly at the top.',
      'Lower slowly, no swinging.',
    ],
    utilizare: [
      'Practically every gym has this station, with a backrest and forearm pads.',
    ],
    greseli: [
      'Swinging your legs like a pendulum.',
      'Lifting only from the hip flexors, without curling the pelvis.',
    ],
    ponturi: [
      'After the "lower abs"? Curling the pelvis at the top is the whole secret.',
    ],
  },
  'russian-twist': {
    nume: 'Russian twists',
    echipamentNume: 'Mat + plate or medicine ball',
    forma: [
      'Seated, torso leaned back to about 45°, heels on the floor (or lifted, which is harder).',
      'Rotate your torso left and right with the weight in your hands.',
      'The movement comes from your torso, not from arms flapping about.',
    ],
    utilizare: [
      'Start with no weight; add a 2.5-5 kg plate when 20 twists start to feel easy.',
    ],
    greseli: [
      'A completely rounded back.',
      'Only the arms moving while the torso stays put.',
    ],
    ponturi: [
      'Obliques worked here tighten your waist visually faster than a thousand crunches.',
    ],
  },
  'mountain-climbers': {
    nume: 'Mountain climbers',
    echipamentNume: 'Mat',
    forma: [
      'Push-up position, shoulders over your hands.',
      'Drive your knees alternately towards your chest at a steady rhythm.',
      'Back flat, hips low.',
    ],
    utilizare: [
      'Intervals: 20-30 seconds of work, 30 seconds rest.',
    ],
    greseli: [
      'Backside up in the air like a mountain (yes, the irony).',
      'Shoulders drifting behind your hands.',
    ],
    ponturi: [
      'Cardio and abs at the same time — efficient when time is short.',
    ],
  },
  'kettlebell-swing': {
    nume: 'Kettlebell swing',
    echipamentNume: 'Kettlebell',
    forma: [
      'This is a HIP movement, not an arm one: the hips go back, the kettlebell passes between your legs.',
      'Snap your hips forward explosively — your arms just follow, up to chest height.',
      'Back flat throughout, core braced.',
    ],
    utilizare: [
      'Start with 8-12 kg; overhand grip, both hands.',
    ],
    greseli: [
      'A squat plus an arm raise — no, it is a hip hinge.',
      'Rounding your back at the bottom.',
      'Swinging overhead without the specific technique for it.',
    ],
    ponturi: [
      'Burns calories like sprinting and strengthens the whole posterior chain. The king of "a lot in very little time".',
    ],
  },
  'farmers-walk': {
    nume: 'Farmer’s walk',
    echipamentNume: 'Heavy dumbbells or kettlebells',
    forma: [
      'A serious weight in each hand, shoulders down and back.',
      'Walk tall, controlled steps, core like stone.',
      'Do not let yourself get pulled to one side.',
    ],
    utilizare: [
      'Find a clear 10-20 metres; walk up and back until the time is up.',
    ],
    greseli: [
      'Weights too light — holding them should be a fight.',
      'Shoulders hunched forward.',
    ],
    ponturi: [
      'The simplest exercise in the world: pick weights up, walk. And still it strengthens everything, grip most of all.',
    ],
  },
  'burpee': {
    nume: 'Burpee',
    echipamentNume: 'Bodyweight',
    forma: [
      'From standing: hands to the floor, feet jump back into a push-up position.',
      'Optionally a push-up, then the feet jump back in to your hands.',
      'Stand up with a small jump and your hands overhead.',
    ],
    utilizare: [
      'The gentle version (no push-up, no jump, stepping instead of hopping) is completely legitimate at the start.',
    ],
    greseli: [
      'Hips sagging in the push-up position.',
      'Speed before form.',
    ],
    ponturi: [
      'Nobody loves burpees. Everybody loves what they do. 5 at the end of a workout is plenty to begin with.',
    ],
  },
  'genuflexiuni-haltera': {
    nume: 'Back squat',
    echipamentNume: 'Barbell + power rack',
    forma: [
      'The bar sits on your trapezius, not on the bone of your neck. Squeeze your shoulder blades and build yourself a cushion of muscle.',
      'Feet at shoulder width, toes turned slightly out; your knees track over your toes.',
      'Descend by pushing your hips back AND your knees forward, until your thigh is at least parallel with the floor.',
      'Come up by driving hard into the floor through the whole foot, chest up, back neutral the whole way.',
    ],
    utilizare: [
      'Set the rack hooks at chest height: you should get under the bar by bending your knees slightly.',
      'ALWAYS set the safety bars just below the lowest point of your squat.',
      'Walk out of the rack in 2-3 steps, not 5 — save the energy for the sets.',
    ],
    greseli: [
      'Heels lifting off the floor — a sign of stiff ankles; use hard-soled shoes for now.',
      'Rounding your lower back at the bottom ("butt wink") because you are going deeper than your mobility allows.',
      'Knees caving inwards as you stand up — actively push them out.',
    ],
    ponturi: [
      'Start with the empty bar (20 kg). Seriously. Technique is easy to learn and hard to correct.',
      'No rack with safeties? Squat on the Smith machine or with dumbbells until one turns up.',
      'Breathing: in at the top, hold on the way down, out once you are past the hard part.',
    ],
  },
  'indreptari-clasice': {
    nume: 'Conventional deadlift',
    echipamentNume: 'Olympic barbell + 20 kg plates',
    forma: [
      'Bar over the middle of your foot, close to your shin. Feet at hip width.',
      'Grip just outside your knees, drop your hips until you feel tension in your hamstrings.',
      'Chest up, back FLAT (not vertical — flat), shoulders slightly ahead of the bar.',
      'Push the floor away with your legs, keep the bar against your body, finish by squeezing your glutes — do not lean back.',
    ],
    utilizare: [
      'With 20 kg plates the bar sits at the right height. With small plates, set it up on two boxes or steps.',
      'Mixed grip (one palm forward, one back) or straps — only once your grip gives out before your back does.',
      'Coming down: hips back until the bar passes your knees, then bend your knees. Do not just drop it on the gym floor.',
    ],
    greseli: [
      'Rounding your back — the most common and the most expensive mistake. Less weight, more technique.',
      'Starting with your hips too low (you turn it into a squat with the bar in your hands).',
      'The bar drifting away from your shin — the lever gets longer and your lower back picks up the bill.',
    ],
    ponturi: [
      'This is the most expensive exercise there is in terms of fatigue: 3-5 sets is plenty, not 8.',
      'Scraped shins are normal — that is why people wear long socks for deadlifts.',
      'If your mobility is not there yet, start with Romanian deadlifts or rack pulls.',
    ],
  },
  'indreptari-sumo': {
    nume: 'Sumo deadlift',
    echipamentNume: 'Olympic barbell',
    forma: [
      'Feet much wider, toes turned out 40-45°, hands gripping the bar INSIDE your knees.',
      'Hips lower and torso more upright than conventional — your back does less of the work.',
      'Actively open your knees outwards and "push the floor apart".',
    ],
    utilizare: [
      'Same bar and same plates; only the stance changes.',
    ],
    greseli: [
      'Hips rising before your chest does.',
      'Knees closing inwards as you start the pull.',
    ],
    ponturi: [
      'With mobile hips and a long torso, sumo can be far more comfortable than conventional.',
      'The first stretch off the floor is the hardest — do not rush, squeeze the bar off the ground.',
    ],
  },
  'impins-haltera-inclinat': {
    nume: 'Incline barbell press',
    echipamentNume: 'Incline bench + barbell',
    forma: [
      'Bench at 30-45°. Any steeper and it works your shoulders, not your chest.',
      'The bar comes down under control towards your collarbone / upper chest, not your sternum.',
      'Shoulder blades squeezed and tucked into your back pockets, feet planted.',
    ],
    utilizare: [
      'Set the bench angle FIRST, then position yourself so the bar clears the uprights.',
      'On serious weights, ask for a spot — that is normal and polite in any gym.',
    ],
    greseli: [
      'Too steep an angle (60°+) — it becomes a shoulder press in practice.',
      'Backside coming off the bench on the last rep.',
    ],
    ponturi: [
      'The upper chest is what gives the "full chest" look — worth prioritising as a beginner.',
    ],
  },
  'impins-priza-ingusta': {
    nume: 'Close-grip bench press',
    echipamentNume: 'Flat bench + barbell',
    forma: [
      'Grip at shoulder width — NOT hands touching. Too narrow only punishes your wrists.',
      'Elbows stay close to your body (30-45°), the bar comes down to your lower chest.',
      'Press by thinking about straightening your elbow, not about your chest.',
    ],
    utilizare: [
      'Same bench and bar as the classic press; only the grip and the elbow path change.',
    ],
    greseli: [
      'Hands touching — your wrists twist painfully.',
      'Elbows flared — it turns into a normal bench press.',
    ],
    ponturi: [
      'The best compound exercise for triceps: it grows your flat bench press too.',
    ],
  },
  'presa-umeri-haltera': {
    nume: 'Overhead press',
    echipamentNume: 'Barbell + rack',
    forma: [
      'Bar on your upper chest, elbows slightly ahead of the bar, grip just outside your shoulders.',
      'Pull your chin back so the bar travels in a straight line past your nose.',
      'At the top your head "goes through the window": the bar finishes above the middle of your head, not in front of it.',
      'Glutes and core squeezed — otherwise you arch your lower back to compensate.',
    ],
    utilizare: [
      'Take the bar out of the rack at chest height, not from the floor. Take 1-2 steps back.',
      'No help from the knees — that is already a different exercise (the push press).',
    ],
    greseli: [
      'Arching your back heavily with the bar pushed out in front.',
      'Stopping halfway down — the bar has to come back to your collarbone.',
    ],
    ponturi: [
      'This is the slowest exercise to progress on: +1.25 kg a week is already excellent.',
      'An empty 20 kg bar is a perfectly legitimate starting point for the overhead press.',
    ],
  },
  'ramat-haltera-aplecat': {
    nume: 'Bent-over barbell row',
    echipamentNume: 'Barbell',
    forma: [
      'Hips pushed back, torso at about 45° or lower, back perfectly flat.',
      'Pull the bar to your navel / lower abdomen, elbows close to your body.',
      'Squeeze the shoulder blades at the top, then lower under control until your arms are fully straight.',
    ],
    utilizare: [
      'Lift the bar off the floor as you would for a deadlift, then settle into the bent-over position.',
    ],
    greseli: [
      'Standing your torso up on every rep (that turns it into a jerky deadlift).',
      'Pulling to your chest with elbows flared wide — that works your rear delts, not your lats.',
    ],
    ponturi: [
      'If your lower back gives out first, switch to the one-arm dumbbell row with the bench for support.',
      'Good rule of thumb: your row weight is roughly 60-70% of your bench press.',
    ],
  },
  'ramat-t-bar': {
    nume: 'T-bar row',
    echipamentNume: 'T-bar row machine (or a bar in a corner)',
    forma: [
      'Chest on the pad (if the machine has one), or bent over the bar with a flat back.',
      'Pull the handles to your abdomen, elbows close to your body, squeeze the shoulder blades.',
      'Lower all the way — you want the maximum stretch across your back.',
    ],
    utilizare: [
      'You add plates straight onto the end of the bar; start with a single 10 kg.',
    ],
    greseli: [
      'Lifting your chest off the pad and pulling with your whole body.',
      'Short reps, half the range.',
    ],
    ponturi: [
      'The chest-supported version takes your lower back out of the equation — perfect on a day you have already deadlifted.',
    ],
  },
  'ridicari-umeri-haltera': {
    nume: 'Shrugs',
    echipamentNume: 'Barbell or heavy dumbbells',
    forma: [
      'Bar in front, arms straight, shoulders relaxed down at the start.',
      'Lift your shoulders STRAIGHT up, towards your ears. Hold for a second at the top.',
      'Lower slowly and fully — the stretch at the bottom does half the work.',
    ],
    utilizare: [
      'Barbell in front or dumbbells at your sides; dumbbells are kinder to the shoulders.',
    ],
    greseli: [
      'Rolling your shoulders in circles — adds nothing, just irritates the joint.',
      'Bending your elbows — that turns it into a bad row.',
    ],
    ponturi: [
      'Traps can handle heavy weight; but if you cannot hold for 2 seconds at the top, it is too heavy.',
    ],
  },
  'genuflexiuni-frontale': {
    nume: 'Front squat',
    echipamentNume: 'Barbell + rack',
    forma: [
      'The bar rests on your front shoulders (front delts), elbows UP and parallel with the floor.',
      'Torso stays vertical; deep, controlled descent.',
      'If your elbows drop, the bar drops. Elbows up is rule number one.',
    ],
    utilizare: [
      'The cross-arm grip (arms in an X) is the easiest for beginners if your wrists are stiff.',
    ],
    greseli: [
      'Elbows dropping.',
      'Trying to use the same weight as your back squat — 20-30% less is normal.',
    ],
    ponturi: [
      'The best exercise for quads and for a strong torso. And the most honest: you cannot cheat it.',
    ],
  },
  'genuflexiuni-goblet': {
    nume: 'Goblet squat',
    echipamentNume: 'Dumbbell or kettlebell',
    forma: [
      'Hold the weight upright at your chest, like a goblet, elbows underneath it.',
      'Squat down between your heels, your elbows passing inside your knees and pushing them out.',
      'Chest up throughout — the weight out in front automatically helps you stay upright.',
    ],
    utilizare: [
      'An 8-16 kg dumbbell is enough for a long time.',
    ],
    greseli: [
      'Holding the weight too far from your chest — your shoulders tire before your legs.',
    ],
    ponturi: [
      'The best way to learn a proper squat. Practically impossible to do wrong.',
    ],
  },
  'fandari-bulgaresti': {
    nume: 'Bulgarian split squats',
    echipamentNume: 'Bench + dumbbells',
    forma: [
      'Back foot on the bench (laces or toes down), front foot about 70 cm forward.',
      'Drop straight down until your back knee nearly touches the floor.',
      'Drive through the heel of the front foot. A slight forward lean means more glute.',
    ],
    utilizare: [
      'No weight at the start. Balance is the challenge, not the load.',
    ],
    greseli: [
      'Step too short — the front knee travels well past the toes and it hurts.',
      'Pushing off the foot that is on the bench.',
    ],
    ponturi: [
      'Called split squats in most English programmes. One leg at a time means imbalances fix themselves.',
      'Hold onto the rack with one hand until you find your balance, no shame in it.',
    ],
  },
  'fandari-mers': {
    nume: 'Walking lunges',
    echipamentNume: 'Dumbbells (or just bodyweight)',
    forma: [
      'Long step forward, drop down until both knees are at about 90°.',
      'Drive off the front heel and bring the back leg straight through into the next step.',
      'Torso upright, eyes forward, core braced.',
    ],
    utilizare: [
      'You need a lane of 8-10 m. Count the reps on each leg.',
    ],
    greseli: [
      'Banging the back knee into the floor.',
      'Small steps, which load only the front knee.',
    ],
    ponturi: [
      'Your glutes will remember this day for 48 hours. That is normal.',
    ],
  },
  'impins-gantere-inclinat': {
    nume: 'Incline dumbbell press',
    echipamentNume: 'Incline bench + dumbbells',
    forma: [
      'Bench at 30-45°, dumbbells starting at upper-chest height.',
      'Press up and slightly inwards; do not clash the dumbbells.',
      'Lower until you feel the stretch across your chest, without forcing your shoulder.',
    ],
    utilizare: [
      'Rest the dumbbells on your thighs, then kick them into position one at a time as you lie back.',
    ],
    greseli: [
      'Going too deep with your shoulders rolled forward.',
      'Holding the dumbbells too far out from your body.',
    ],
    ponturi: [
      'Dumbbells allow a longer range than a barbell — a better stimulus for the muscle.',
    ],
  },
  'flexii-inclinat-gantere': {
    nume: 'Incline bench biceps curls',
    echipamentNume: 'Incline bench + dumbbells',
    forma: [
      'Bench at 45-60°, lie back with your arms hanging completely free behind your body.',
      'Curl without moving your elbow at all; at the top your palms face your shoulder.',
      'Lower until your arm is fully straight — the stretch is the entire point of this variation.',
    ],
    utilizare: [
      'Light dumbbells: this position is much harder than standing.',
    ],
    greseli: [
      'Lifting your elbows forward.',
      'Peeling your shoulders off the backrest on the last few reps.',
    ],
    ponturi: [
      'The stretched position works the long head of the biceps — the part that gives you the peak.',
    ],
  },
  'flexii-predicator': {
    nume: 'Preacher curls',
    echipamentNume: 'Preacher bench + EZ bar',
    forma: [
      'Armpit resting on the top edge of the pad; arms flat against the pad the whole way.',
      'Lower under control, but do not fully relax your elbow at the bottom.',
      'Curl up until you feel the contraction, without lifting off the seat.',
    ],
    utilizare: [
      'Adjust the seat until your shoulders sit below the top edge of the pad.',
    ],
    greseli: [
      'Snapping the elbow fully straight at the bottom — the best way there is to strain a tendon.',
    ],
    ponturi: [
      'Impossible to cheat with a swing — that is exactly why it burns.',
    ],
  },
  'extensii-triceps-frunte': {
    nume: 'Skull crushers',
    echipamentNume: 'Flat bench + EZ bar',
    forma: [
      'Lying down, arms vertical, elbows fixed. Lower the bar towards your forehead or just behind your head.',
      'Only your forearm moves. Your shoulder stays put.',
      'Straighten fully without brutally locking the elbow.',
    ],
    utilizare: [
      'The EZ bar is much kinder to your wrists than a straight bar.',
    ],
    greseli: [
      'Elbows flaring out to the sides.',
      'Lowering towards your chest — that becomes a close-grip press.',
    ],
    ponturi: [
      'The name is grim, but pick the weight sensibly and it is the most effective barbell triceps exercise there is.',
    ],
  },
  'ridicari-trunchi': {
    nume: 'Sit-ups',
    echipamentNume: 'Mat (optionally an ab bench)',
    forma: [
      'Lying down, knees bent, feet on the floor. Arms crossed on your chest (not behind your head).',
      'Come up rolling your spine one vertebra at a time, until your torso is nearly upright.',
      'Lower just as controlled — do not flop back down.',
    ],
    utilizare: [
      'If your feet lift, hook them under a dumbbell or use an ab bench.',
    ],
    greseli: [
      'Hands behind your head, pulling on it — your neck is not an abdominal muscle.',
      'Fast reps with a swing from the arms.',
    ],
    ponturi: [
      'The difference from a crunch: the sit-up lifts the whole torso, a crunch only your shoulders.',
      'When 20 reps get easy, hold a dumbbell on your chest.',
    ],
  },
  'rasuciri-cablu-oblici': {
    nume: 'Oblique cable twist',
    echipamentNume: 'Cable machine (pulley at chest height)',
    forma: [
      'Stand side-on to the pulley, arms straight, handle held in both hands at chest height.',
      'Rotate from your torso, not your arms: shoulders and hips turn together, arms stay straight.',
      'The return is controlled — do not let the cable drag you back.',
    ],
    utilizare: [
      'Set the pulley at chest height and fit a single D-handle or the rope.',
      'Step 2 paces away so there is constant tension on the cable.',
    ],
    greseli: [
      'Moving only your arms while your torso stays still.',
      'Too much weight, which yanks you round and strains your lower back.',
    ],
    ponturi: [
      'Count the reps ON EACH SIDE. 20 on the left plus 20 on the right.',
      'No cable? Exactly the same movement with a resistance band anchored at chest height.',
    ],
  },
  'gambe-asezat': {
    nume: 'Seated calf raises',
    echipamentNume: 'Seated calf raise machine',
    forma: [
      'Toes on the plate, heels free. Pad on your knees, not on your thigh.',
      'Drop your heels as low as you can, then rise all the way onto your toes.',
      'A one-second pause at the top and one at the bottom — calves respond to time under tension.',
    ],
    utilizare: [
      'Release the side lever after you have taken the weight the first time.',
    ],
    greseli: [
      'Short, fast reps like a sewing machine.',
    ],
    ponturi: [
      'Seated works the soleus (the calf underneath) — the perfect complement to standing raises.',
    ],
  },
  'pulover-cablu': {
    nume: 'Straight-arm pulldown',
    echipamentNume: 'Cable machine (high pulley) + straight bar',
    forma: [
      'Arms straight (a fixed slight bend), pull the bar in an arc down to your thighs.',
      'The movement comes from the shoulder, not the elbow. Torso leaning slightly forward, still.',
      'Feel your lats contract — this is a "connection" exercise, not a heavy one.',
    ],
    utilizare: [
      'Pulley high, straight bar or rope; stand about 2 paces from the machine.',
    ],
    greseli: [
      'Bending your elbows — it becomes a triceps extension.',
      'Swinging from the torso.',
    ],
    ponturi: [
      'The best exercise for learning what a working back FEELS like, before you get to pull-ups.',
    ],
  },
  'ramat-cablu-un-brat': {
    nume: 'One-arm cable row',
    echipamentNume: 'Cable machine + single handle',
    forma: [
      'One foot forward for stability, pull the handle to your hip with your elbow against your body.',
      'Let your shoulder stretch fully forward on the return, then pull it back.',
      'Torso stays still — only your arm and shoulder blade work.',
    ],
    utilizare: [
      'Pulley at chest height or low; single D-handle.',
    ],
    greseli: [
      'Twisting your torso on every rep to win a few extra centimetres.',
    ],
    ponturi: [
      'One arm at a time means you spot a weaker side immediately. Start the set with the weak side.',
    ],
  },
  'fluturari-inverse-cablu': {
    nume: 'Cable rear delt fly',
    echipamentNume: 'Cable machine (two pulleys)',
    forma: [
      'Cables crossed in front of you, each hand taking the opposite handle.',
      'Open your arms out to the side in an arc, until they are in line with your shoulders. Elbows nearly straight.',
      'Slow, controlled return — do not let the weight pull you back.',
    ],
    utilizare: [
      'Both pulleys at shoulder height; take the left handle with your right hand and vice versa.',
    ],
    greseli: [
      'Too much weight, so you pull with your traps and back instead of your rear delts.',
    ],
    ponturi: [
      'Rear delts are the most neglected muscle in beginners — and the ones that fix your posture.',
    ],
  },
  'abdomene-roata': {
    nume: 'Ab wheel rollout',
    echipamentNume: 'Ab wheel',
    forma: [
      'From your knees, wheel under your shoulders. Pelvis tucked under you (no arching).',
      'Roll forward as far as you can keep your back FLAT. An extra centimetre with a rounded back does not count.',
      'Pull yourself back with your abs, not your arms.',
    ],
    utilizare: [
      'Knees on a folded towel. Put a cushion in front as a limit to begin with.',
    ],
    greseli: [
      'Letting your hips drop and your lower back arch — that is where the back pain comes from.',
    ],
    ponturi: [
      'If your lower back aches the next day, you went too far. Be patient: a few centimetres a month.',
    ],
  },
  'tractiuni-supinat': {
    nume: 'Chin-ups',
    echipamentNume: 'Fixed pull-up bar',
    forma: [
      'Palms towards you, at shoulder width. Hang with your arms completely straight.',
      'Pull until your chin passes the bar, your elbows driving down alongside your body.',
      'Lower all the way, under control. No swinging from the legs.',
    ],
    utilizare: [
      'Cannot do a single one? Use the assisted machine, a band over the bar, or just slow lowers (negatives).',
      'Jump up, hold with your chin over the bar and lower over 5 seconds — 3-5 reps.',
    ],
    greseli: [
      'Swinging (kipping) — looks spectacular, does not build a back.',
      'Half reps with no stretch at the bottom.',
    ],
    ponturi: [
      'The underhand grip is easier than overhand because the biceps helps a lot. Start with it.',
      'AMRAP ("as many as you can") means exactly that: go until you have one clean rep left in you.',
    ],
  },
  'tractiuni-negative': {
    nume: 'Negative pull-ups (the lowering only)',
    echipamentNume: 'Fixed bar + a box or step to get up',
    forma: [
      'Step up onto the box and start with your chin above the bar.',
      'Take your feet off the box and lower as SLOWLY as you can — aim for 5 seconds.',
      'When you reach the bottom, step back up onto the box. That is one rep.',
    ],
    utilizare: [
      'A box, an aerobic step or even the bench from the chest area — anything that lifts you to the bar.',
    ],
    greseli: [
      'Coming down too fast — the negative is the whole point of the exercise.',
    ],
    ponturi: [
      'The fastest route from 0 pull-ups to your first one. 3 sets × 3-5 negatives, twice a week.',
      'Flexu cried on his first one. By the second week he was laughing.',
    ],
  },
  'ramat-orizontal-bara': {
    nume: 'Inverted row',
    echipamentNume: 'Bar in the rack at hip height (or a TRX)',
    forma: [
      'Hang under the bar with your body straight as a plank, heels on the floor.',
      'Pull until your chest touches the bar, elbows close to your body, squeeze the shoulder blades.',
      'Lower all the way, body still straight from shoulders to heels.',
    ],
    utilizare: [
      'You set the difficulty with the angle: a higher bar is easier, a more horizontal body is harder.',
      'Feet up on a bench is the hard version.',
    ],
    greseli: [
      'Hips sagging towards the floor.',
      'Short reps that never touch the bar.',
    ],
    ponturi: [
      'The best pulling exercise for a beginner who has not got a single pull-up yet.',
    ],
  },
  'fondari-paralele-libere': {
    nume: 'Dips',
    echipamentNume: 'Fixed parallel bars',
    forma: [
      'Supported on straight arms, body leaning slightly forward for chest or upright for triceps.',
      'Lower until your arm is at about 90° — no further if you feel your shoulder.',
      'Press up without brutally locking your elbows.',
    ],
    utilizare: [
      'Not one rep yet? Use the assisted machine or a band across the bars.',
      'When 12 get easy, add weight with a dip belt.',
    ],
    greseli: [
      'Going far too deep with your shoulders shrugged up to your ears — the classic route to a shoulder injury.',
    ],
    ponturi: [
      'The "squat of the upper body" — dips build chest and triceps like nothing else.',
    ],
  },
  'flotari-inclinate': {
    nume: 'Incline push-ups (hands raised)',
    echipamentNume: 'A bench, a step or the bar in the rack',
    forma: [
      'Hands on the bench or bar, body straight, one line from head to heels.',
      'Lower your chest until it touches the support, elbows at about 45° from your body.',
      'Press all the way back, pushing the ground away from you.',
    ],
    utilizare: [
      'The higher the support, the easier it is. Lower the support as you get stronger.',
    ],
    greseli: [
      'Hips sagging or riding up.',
      'Elbows flared to 90° — your shoulders will ache.',
    ],
    ponturi: [
      'The full ladder: wall → bench → step → floor → feet raised. Move up a rung at 15 clean reps.',
    ],
  },
  'flotari-diamant': {
    nume: 'Diamond push-ups (close grip)',
    echipamentNume: 'Bodyweight only',
    forma: [
      'Hands under your chest, thumbs and index fingers forming a diamond.',
      'Elbows stay tucked against your body on the way down.',
      'Body rigid as a plank throughout.',
    ],
    utilizare: [
      'Too hard? Do them with your hands on a bench (the incline version).',
    ],
    greseli: [
      'Elbows flaring out — you lose all the triceps emphasis.',
      'Hips leading the movement.',
    ],
    ponturi: [
      'The most effective bodyweight triceps exercise, measured in EMG studies.',
    ],
  },
  'genuflexiuni-pistol-asistate': {
    nume: 'Assisted pistol squats',
    echipamentNume: 'A post or TRX to hold onto',
    forma: [
      'One leg straight out in front, lower on the other as far as you can control.',
      'Hold a post lightly for balance only, not to pull yourself up.',
      'Heel stays on the floor; your torso leans forward naturally.',
    ],
    utilizare: [
      'Easier version: lower onto a bench and stand back up off it (the box pistol).',
    ],
    greseli: [
      'Dropping down with no control.',
      'Knee caving inwards.',
    ],
    ponturi: [
      'The ultimate single-leg strength test. Not compulsory, but a lovely badge to have.',
    ],
  },
  'ridicari-picioare-atarnat': {
    nume: 'Hanging leg raises',
    echipamentNume: 'Fixed pull-up bar',
    forma: [
      'Hang with straight arms, shoulders active (not collapsed into the joint).',
      'Raise your straight legs to horizontal or above, curling your pelvis at the top.',
      'Lower SLOWLY. Zero swing — if you are swinging, it is too hard.',
    ],
    utilizare: [
      'Too hard with straight legs? Start with bent knees (hanging knee raises).',
    ],
    greseli: [
      'Using momentum — you end up doing a pendulum, not an ab exercise.',
      'Lifting only from the hip flexors, without curling the pelvis at the top.',
    ],
    ponturi: [
      'Grip giving out before your abs? Straps on the bar solve that.',
      'The hardest ab exercise in the gym that needs no machine at all.',
    ],
  },
  'plank-lateral': {
    nume: 'Side plank',
    echipamentNume: 'Mat',
    forma: [
      'On your side, elbow under your shoulder, body in one straight line from head to ankles.',
      'Lift your hip and hold it up. Do not let your pelvis drop back or forward.',
      'Breathe normally — if you are holding your breath, you have already given in.',
    ],
    utilizare: [
      'Easier: rest your knees on the floor. Harder: raise the top arm and leg.',
    ],
    greseli: [
      'Hip sagging towards the floor.',
      'Rotating your body towards the ground.',
    ],
    ponturi: [
      'Obliques trained isometrically protect your back better than a hundred twists.',
    ],
  },
  'pod-fesier-sol': {
    nume: 'Glute bridge',
    echipamentNume: 'Mat',
    forma: [
      'On your back, knees bent, feet about 30 cm from your backside.',
      'Drive through your heels and lift your hips until your body is straight from shoulders to knees.',
      'Squeeze your glutes for 2 seconds at the top. Do not hyperextend your lower back.',
    ],
    utilizare: [
      'When it gets easy, put a dumbbell across your hips or do it on one leg.',
    ],
    greseli: [
      'Pushing through your toes instead of your heels.',
      'Arching your lower back instead of contracting your glutes.',
    ],
    ponturi: [
      'Perfect as a warm-up before squats — it wakes up glutes that have been sitting in a chair all day.',
    ],
  },
  'superman': {
    nume: 'Superman (floor extensions)',
    echipamentNume: 'Mat',
    forma: [
      'Face down, arms stretched out in front.',
      'Lift your arms and legs a few centimetres at the same time; eyes on the floor, neck neutral.',
      'Hold for 2 seconds at the top, lower under control.',
    ],
    utilizare: [
      'Easier version: right arm plus left leg, then swap (a floor-level bird dog).',
    ],
    greseli: [
      'Lifting your head and looking forward — it loads your neck for nothing.',
    ],
    ponturi: [
      'No back extension bench? Superman does the same job at home, with zero equipment.',
    ],
  },
  'urcari-banca': {
    nume: 'Step-ups',
    echipamentNume: 'Bench or plyo box (+ dumbbells)',
    forma: [
      'Whole foot on the bench, step up driving ONLY through the top leg.',
      'Do not swing yourself up with the bottom leg and do not jump.',
      'Lower under control, on the same supporting leg, until the other foot lightly touches the floor.',
    ],
    utilizare: [
      'Bench at knee height. Higher means more glute, but harder to control.',
    ],
    greseli: [
      'Pushing off the bottom leg.',
      'Coming down by simply dropping.',
    ],
    ponturi: [
      'The exercise that translates directly into climbing stairs without getting out of breath.',
    ],
  },
  'jumping-jacks': {
    nume: 'Jumping jacks',
    echipamentNume: 'Bodyweight only',
    forma: [
      'Jump your legs apart while taking your arms overhead.',
      'Land softly, on the whole foot, knees slightly bent.',
      'Steady rhythm, rhythmic breathing.',
    ],
    utilizare: [
      'Zero equipment. 30-60 seconds as a general warm-up.',
    ],
    greseli: [
      'Landing stiff, on your heels.',
    ],
    ponturi: [
      'The fastest warm-up going when every treadmill is taken.',
    ],
  },
  'atarnare-bara': {
    nume: 'Dead hang',
    echipamentNume: 'Fixed pull-up bar',
    forma: [
      'Take the bar at shoulder width and hang relaxed, but with active shoulders.',
      'Breathe deeply. Your shoulders do not collapse up around your ears.',
      'Come down under control, do not drop from height.',
    ],
    utilizare: [
      'All you need is a bar. A chair underneath helps you get up and down.',
    ],
    greseli: [
      'Hanging completely passively, shoulders "out of the socket", if your shoulders are sensitive.',
    ],
    ponturi: [
      'Grip is usually what stops you getting your first pull-up. 3 × 30 seconds fixes that in a few weeks.',
      'Bonus: it decompresses your spine after a day in a chair.',
    ],
  },
  'birddog': {
    nume: 'Bird dog (opposite arm and leg)',
    echipamentNume: 'Mat',
    forma: [
      'On all fours: hands under your shoulders, knees under your hips, back neutral.',
      'Extend your right arm and left leg at the same time, until they are in line with your torso.',
      'Hold for 3 seconds without letting your hip rotate. Swap sides.',
    ],
    utilizare: [
      'A folded towel under your knees if the floor is hard.',
    ],
    greseli: [
      'Rotating your pelvis.',
      'Lifting the leg too high, arching your lower back.',
    ],
    ponturi: [
      'The best warm-up there is before deadlifts and squats.',
      'Imagine a glass of water on your back: if it spills, you rotated.',
    ],
  },
  'catarare-frankie': {
    nume: 'Bear crawl',
    echipamentNume: 'Bodyweight + clear space',
    forma: [
      'On all fours with your knees 5 cm off the floor.',
      'Crawl forward moving the OPPOSITE arm and leg together.',
      'Hips stay low, back flat as a table.',
    ],
    utilizare: [
      'A lane of 6-8 metres. There and back.',
    ],
    greseli: [
      'Hips up in a "V" — you lose all the core work.',
    ],
    ponturi: [
      'Looks ridiculous, burns like anything, works everything. Flexu adores it.',
    ],
  },
  'ramat-trx': {
    nume: 'TRX row (suspension straps)',
    echipamentNume: 'TRX straps',
    forma: [
      'Hold the handles, lean back with your body straight and your heels dug into the floor.',
      'Pull yourself up until the handles reach your ribs, elbows close to your body.',
      'Lower all the way, under control, shoulders active.',
    ],
    utilizare: [
      'You set the difficulty with your feet: the further forward they are, the harder it gets.',
      'The straps attach to any solid anchor — the rack bar works perfectly.',
    ],
    greseli: [
      'Hips sagging towards the floor.',
      'Pulling with your elbows flared far out.',
    ],
    ponturi: [
      'Infinitely adjustable difficulty — practically any beginner can do one proper set.',
    ],
  },
  'impins-sanie': {
    nume: 'Sled push (prowler)',
    echipamentNume: 'Push sled (prowler)',
    forma: [
      'Take the low posts (harder, more legs) or the high ones (more upright, easier).',
      'Torso leaning in line with your arms, short quick steps.',
      'Push continuously — if the sled stops, it is too heavy.',
    ],
    utilizare: [
      'You add plates onto the frame; carpet or artificial turf is harder going than a wooden floor.',
      'A lane of 15-20 m, there and back, 20-30 seconds a go.',
    ],
    greseli: [
      'Too much weight, so you are walking rather than pushing.',
      'Back rounding under the effort.',
    ],
    ponturi: [
      'No lowering phase at all means it burns your lungs but leaves you almost no soreness the next day.',
      'The best cardio there is for someone who hates cardio.',
    ],
  },
  'incalzire-articulara': {
    nume: 'General joint warm-up',
    echipamentNume: 'Bodyweight only',
    forma: [
      'Top to bottom: neck circles (gently), shoulders, elbows, wrists, hips, knees, ankles.',
      '10 circles each way for every joint.',
      'Big movements, but no forcing — you are warming up, not stretching.',
    ],
    utilizare: [
      'Zero equipment. 3-5 minutes before any strength session.',
    ],
    greseli: [
      'Skipping it to save time — then three weeks off because of your shoulder.',
    ],
    ponturi: [
      'Flexu’s rule: if you have time to train, you have time to warm up.',
    ],
  },
  'mobilitate-solduri': {
    nume: 'Hip mobility (lunge with a rotation)',
    echipamentNume: 'Mat',
    forma: [
      'Big step into a lunge, hands on the floor beside the front foot.',
      'Sink your hip towards the floor, then reach the inside arm up to the ceiling, rotating your torso.',
      'Hold for 3 breaths, swap sides.',
    ],
    utilizare: [
      'A mat and 2 minutes. Ideal before squats.',
    ],
    greseli: [
      'Rushing — mobility comes from breathing, not from forcing.',
    ],
    ponturi: [
      'If the butt wink in your squat annoys you, this is the cure.',
    ],
  },
  'intindere-finala': {
    nume: 'Final stretches',
    echipamentNume: 'Mat',
    forma: [
      'After training, hold each stretch for 30 seconds, no bouncing.',
      'The muscle groups you trained that day come first.',
      'Breathe long; it should feel like pleasant tension, not pain.',
    ],
    utilizare: [
      '5 minutes at the end, on a mat.',
    ],
    greseli: [
      'Hard stretching BEFORE lifting — it temporarily reduces your strength. Save it for the end.',
    ],
    ponturi: [
      'It does not prevent soreness (nothing does), but it does make you feel human again.',
    ],
  },
};
