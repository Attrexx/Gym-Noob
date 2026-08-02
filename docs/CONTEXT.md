# Gym Noob — deep context (history, decisions, roadmap)

Companion to `CLAUDE.md` (which has the operational rules). This file explains *why* things are
the way they are, what was consciously left out, and what the owner wants next.

## 1. Product brief (from the owner)

- Owner: **Attrexx** (attrexx@gmail.com, GitHub `Attrexx`). Returning to the gym after a long
  break, gained weight; goals are **weight loss + muscle gain simultaneously** (recomposition).
- Phone: **Motorola Edge 60 Fusion** (Android, Chrome). Watch: **Huawei GT4** (Huawei Health app).
  Bluetooth scale tracked via the **Freefit** app.
- App must be: fully **Romanian** (including machine/exercise/tool names as used in Romanian
  gyms), **metric**, encouraging/educational, celebrate achievements, run on mobile + desktop.
- Visual identity (owner's explicit wish): '90s "…for Dummies" book covers — yellow background,
  big black chunky titles, cartoonish guide character. Our take: mascot **Flexu** (red-bandana
  noob), Archivo Black titles, hard offset shadows, halftone dots, sticker cards.
- Name: **Gym Noob** (owner corrected an early "GYM pentru NOOBI" — do not reintroduce it).

## 2. Timeline of what was built (3 sessions, July 2026)

1. **v1 full build** — scaffold (Vite+React18+TS, PWA), design system + Flexu, Dexie data layer,
   domain math + 45 tests, onboarding, ~50-exercise Romanian catalog with SMIL stick-figure
   animations + muscle diagrams, workout builder + 4 starter templates, live session (timers,
   RPE, rest countdown, metronome, water, suggestions, TTS), calorie daily budget, analytics,
   25 achievements, guide articles, Freefit CSV import, BLE heart rate, backup, GH Pages deploy.
   Fixed during e2e: session summary vanished on stop (state lived in a component that unmounted
   when the store reset — summary now lives in `SessionPage`).
2. **Feature round** — treadmill speed/incline steppers changeable mid-exercise with per-segment
   ACSM calorie integration; watch-style screensaver (45 s idle → black + dimmed essentials,
   wake on touch/motion); onboarding restyled to match app (coperta headers); rename to Gym Noob.
   Tests now 50.
3. **Workflow switch** — repo went to `main`; Pages source = GitHub Actions; then owner moved
   development to his local Windows machine (`I:\test\Gym-Noob`) and chose the **build-locally,
   commit `dist/`** publishing model. Workflow now only uploads committed `dist/`. `npm run deploy`
   added.
4. **Catalog + programs round** (owner: "the exercises and machines database is too frugal") —
   catalog roughly doubled to ~100 exercises, adding the barbell lifts the famous programs are
   built on (back/front squat, conventional + sumo deadlift, overhead press, bent-over row,
   close-grip & incline bench, shrugs, skull crushers, T-bar row, oblique cable twists, seated
   calf raise, preacher/incline curls, straight-arm pulldown), a **calisthenics** block (chin-ups,
   negatives, inverted rows, free dips, incline/diamond push-ups, hanging leg raises, side plank,
   glute bridge, superman, step-ups, bear crawl, dead hang, ab wheel, TRX row, pistol squats) and
   mobility/warm-up entries. Library gained a **category filter** (calisthenics, free weights,
   machines, big lifts, cardio, mobility) derived from equipment, and exercises now link to
   **related variants**. New `/programe` section ships six programs: Full Body 3x, the owner's
   **powerbuilding periodizat** (Routine 1 A/B/C hypertrophy → Routine 2 A/B strength, 2+6 week
   waves), PPL, Upper/Lower, Wendler 5/3/1 BBB and a calisthenics program; importing one copies
   its workouts into the user's templates. AMRAP sets and per-set notes became first-class.
   Tests 50 → 71; smoke covers the new flows; fixed `npm run smoke` on Windows (it spawned `npx`
   through a shell, so `kill()` orphaned the preview server and the run never exited).
5. **Accounts + multi-device sync round** (July 29, 2026 — the roadmap's "Hetzner someday" item) —
   Dexie **v2** additive migration stamping every row with `uid`/`updatedAt`/`dirty` + FK-mirror
   uids (derived uids for settings/achievements so devices address the same logical row), a
   `deletions` tombstone outbox and a `syncState` table (tokens + pull cursor — in Dexie so the
   cursor advances atomically with applied rows); repo.ts became the single stamped write path
   (fixed 5 stray writes in SettingsPage/OnboardingPage/FreefitImport); backup format v2 (v1
   imports get uids via the shared `normalize.ts`). New `server/` package: Hono + built-in
   `node:sqlite` on Node 24 (zero native deps for the ARM VPS), scrypt passwords, rotating
   refresh-token families, generic `(user, tabel, uid)` row store with per-user `seq`, LWW merge
   with clock clamping, 25 MB quota, in-process rate limits; `shared/wire.ts` is the contract both
   sides import. Client `src/data/sync/`: push-pull engine (re-entrant, chunked, offline backoff),
   linking flows (fresh account → replace up; fresh device → snapshot down via onboarding "Intră
   și adu-ți datele"; fork → explicit conflict dialog, non-destructive), "Cont și sincronizare"
   section in Setări with Flexu in every state. Infra: single 256 MB container on the shared
   Hetzner box behind the communal Caddy (`gym-api.lessgo.city`), GHCR arm64 image built by CI on
   `api-v*` tags (the one deliberate exception to "CI never builds" — that rule is about `dist/`),
   AnyVote-style deploy script, nightly SQLite backups; runbook in `docs/OPS.md`. Tests 71 → 92
   client (+ 33 server); smoke gained a real two-device flow (second browser context logs in and
   receives the first device's data).

6. **Prima sesiune reală la sală** (August 1, 2026) — the owner finally took the app to a gym and
   came back with six concrete complaints; this round is exactly those six, nothing else.
   **Mod liber**: a shared `AlegeExercitiu` picker (search + category chips + Flexu's suggestions)
   with a parameter sheet, reused by the session AND the plan editor (which lost its duplicated
   search modal and `ItemEditor` form body); the start screen leads with "🔥 MOD LIBER", an
   exercise added mid-session becomes the active one, and the summary can save the whole thing as
   a plan built from what was *actually done* (`planDinSeturi`, median reps/weight), not what was
   planned. **HUD** (`SumarHud`): the big timer now shows wall-clock time at the gym, with
   kcal / bpm / ml / activ-vs-pauză underneath and an inverted telemetry bar when a machine is
   connected; calories accrue *during* a set (`liveStore.kcalParial`) instead of jumping at the end.
   **Ceas automat**: `reconectareSilentioasa()` via `getDevices()`+`watchAdvertisements()` when the
   browser allows it, a remembered device name, and gesture-free auto-retry after a dropped link.
   **Programe = Planuri**: the owner's own words; `/antrenamente` and `/programe` are now one page
   with two tabs, "Programe celebre" left the Mai mult menu, and the nav tab is "Programe".
   **Timp la sală**: `impartireTimp` derives total/activ/pauză from fields that already existed
   (no schema change), surfaced in the summary, in new analytics tiles, on the per-session chart,
   and in a new "Ultimele sesiuni" journal card. **Aparate FTMS**: `domain/ftms.ts` parses
   treadmill / rower / bike / cross-trainer / stair-climber packets, `services/bleMachine.ts`
   connects and reads the model from Device Information, machine speed/incline feeds the existing
   `SegmentBanda` ACSM math, power becomes calories via `metDinPutere`, and a "data trecută" strip
   reminds you of last time's machine and numbers with a one-tap "reia setările". A diagnostic
   scanner in Setări reports what a machine actually exposes. Tests 92 → 141 client; smoke covers
   mod liber, free switching, a simulated Bluetooth treadmill, save-as-plan and the program tabs.

7. **Engleză + arhitectură multilingvă** (August 2, 2026) — the owner asked for English, which
   deliberately reverses the old "single language by design" decision. Built as ten stages, each
   shipped green on its own, and the first seven were pure refactors with **byte-identical Romanian
   output** — provable by the existing Romanian suite and smoke run before a single English word
   existed. `src/i18n/` is a hand-rolled runtime (~250 lines, zero new dependencies): a Zustand
   store separate from `profileStore` (because ~10 non-React call sites need `t()` synchronously,
   and `profileStore → repo → catalog → i18n` would close an import cycle), `Intl` for every locale
   rule (plurals, numbers, dates, relative time), and a 35-line `<T>` instead of `<Trans>`. The
   catalogue split into **structure + text**: MET/muscles/equipment exist once in the cores, prose
   comes per-language keyed by id, and every `Record<XId, …>` is exhaustive, so a new exercise
   breaks all languages at compile time until filled. `messages/ro.ts` is the source of truth and
   `en.ts` ends `satisfies Traducere<Mesaje>` — it compiled first try, which was the whole point of
   the type. Frozen catalogue text in user data is **resolved, not rewritten** (`sursaText` +
   `textEditat`), because row-level last-write-wins sync would otherwise have a Romanian phone and
   an English tablet overwriting each other's templates forever. Content: 637 message keys and
   ~11,900 words of catalogue — 98 exercises in real British gym vernacular (lat pulldown, leg
   press, pec deck, cross-trainer) and ~80 Flexu lines written as English jokes rather than
   translated ones. Tests 141 → 237 client, in a new `tests/i18n/` suite: parity of keys, params,
   `<0>` slots and plural categories (computed from `Intl`, not hardcoded); catalogue coverage with
   four anti-laziness checks (no Romanian diacritics left, names actually differ, no Romanian
   decimal commas, positional `notite` aligned with the structure); and
   `fara-romana-in-cod.test.ts`, which reads the component tree with `node:fs` and fails on any
   Romanian text that reappears — the check that drove the extraction to completion and now guards
   it. Smoke keeps its Romanian pass byte-identical (those ~75 accessible-name selectors are the
   proof nothing changed for Romanian) and adds a 7-step English pass. Two live bugs surfaced on the
   way: `bmiCategorie` had started returning ids in stage 3 but two screens still printed them raw
   ("obezitate1" instead of "Obezitate gr. I"), and `UltimaData` was hand-rolling a Romanian decimal
   comma with `String(x).replace('.', ',')`.

## 3. Decisions & rationale (don't relitigate casually)

| Decision | Why |
|---|---|
| Local-first, IndexedDB, accounts OPTIONAL | Zero-cost/offline stays the default; sync is opt-in. The `src/data/` isolation paid off — the backend arrived without rewriting features. |
| One account = one profile | Profiles exist for shared phones; binding the account to a single profile keeps merges small and "profile = person" true. Each profile can link its own account. |
| Row-level LWW by `updatedAt`, server clamps clocks +5 min | Simplest correct merge for append-mostly data; a wrong phone clock can't create unbeatable rows. Ties: upsert keeps server, deletion wins. |
| Generic row store on the server (payload JSON, no schema) | Client schema evolves without server migrations; the server only knows `(user, tabel, uid, seq)`. |
| SQLite via `node:sqlite` in ONE container (no Postgres) | The shared 8 GB box is memory-tight; a 256 MB budget fits Hono+SQLite comfortably, and users' phones hold full replicas anyway (worst-case reseed via `/sync/replace`). |
| Derived uids for settings/achievements | Two devices generate the SAME uid for the same logical row → LWW converges with zero duplicate-singleton logic. |
| Deletions = separate outbox table, not `deletedAt` columns | 3 delete sites vs 11 `useLiveQuery` readers that would each need tombstone filters forever. |
| In-flight sessions never sync | The live session is device-local by design (localStorage store); rows leave the moment `opreste()` runs. |
| Restore-while-linked is authoritative (replace or unlink) | A backup restore must never silently MERGE with the cloud; either the cloud becomes the restored data or the link drops with a message. |
| HashRouter | GH Pages has no SPA rewrites; hash routing is bulletproof there and offline. |
| Static TS exercise catalog (not DB) | Content ships with code, versioned in git, no migrations for content edits. |
| SMIL/CSS SVG animations, no video/lottie | Tiny, offline, self-contained, theme-aware. |
| Sounds generated with Web Audio | No audio assets to precache; works offline. |
| RPE modulates MET ±6%/pt, but never on top of ACSM treadmill MET | Objective MET would be double-counted. |
| Max 1 kg/week rate, intake floor max(1200, 0.8·BMR) | Safety rails for an enthusiastic returner. |
| PRs need prior history & only vs previous sessions | First attempt ≠ record; no intra-session PR spam. |
| Committed `dist/` + publish-only CI | Owner's explicit choice: build locally, push the dist. Revertible (old workflow in git history, commit `3707320`). |
| Fonts via @fontsource (bundled) | No CDN → offline + no external requests. |
| Programs are static `ProgramDef`s, imported into templates | Content ships with code (same reason as the exercise catalog), but once imported the user owns and can edit his copy without breaking the original. Re-import replaces the `program:<id>`-tagged rows so the list can't fill with duplicates. |
| Categories derived from equipment, not hand-tagged | ~100 exercises would rot if each carried a manual category list; explicit `categorii` only where derivation can't know (the big lifts). A test asserts nothing falls through. |
| 5/3/1 ships week 1 with percentages in `notite`, not computed | Would need a stored training max per lift + a cycle counter; the honest MVP is the printed percentages. Candidate for a later feature. |
| Screensaver instead of just wake lock | Owner asked for watch-like dimmed black screen; saves OLED battery vs full-brightness yellow. |
| Programe and Planuri are ONE page with two tabs, not two entities | The owner's answer when asked what a "custom program" should be: *"Programe = Planuri. same stuff."* No new grouping entity, no schema change — just stop pretending they're different things. |
| The big session timer shows WALL-CLOCK time, not active time | Req was literally "time elapsed since session start". Activ/pauză moved to the row below, where the split is more useful than the raw number. |
| Machine fields on `SetLog`, no Dexie bump, no server change | They're optional and unindexed, so Dexie's `stores()` string is untouched; `payloadDin()` strips a denylist, so new keys sync for free. Caveat: LWW is whole-row, so a device left on an old build can push a stale row and drop them — update both devices together. |
| Hand-rolled i18n, zero new dependencies | The catalogue is *structured data* (objects with `string[]` fields), which fits a locale-keyed overlay far better than 1,180 flat i18next keys; each pack is ~70 KB and must lazy-load, which one `import()` gives free; and `satisfies` buys compile-time key parity at zero runtime cost. The repo has 11 runtime deps and hand-rolls everything else. |
| Message keys stay Romanian (`sesiune.stop.da`) | The rest of the codebase already uses Romanian identifiers, the zones *are* the Romanian route names, and `ro.ts` is the source of truth — so the keys sit next to their own prose. |
| Adopt CLDR plurals wholesale, including n=0 | `Intl.PluralRules('ro')` reproduces the old `pluralRo` exactly for every integer except 0, where CLDR says `"0 exerciții"` and the old code said `"0 de exerciții"`. One word on one screen, and it keeps `Intl` an unmodified single source of truth — which is what makes "add a language = add a file" actually true. |
| English = en-GB, metric. Imperial explicitly out of scope | Imperial needs a second setting plus conversion *inside* `src/domain/`, which breaks the goals/calories/strength tests and the 20 kg-bar plate calculator. Unit symbols come from the packs so a future locale can localise them; there is no conversion layer and none should be built. |
| Both locales extracted, Romanian included — not "English overlays Romanian" | Symmetry is what makes adding a language a file rather than a refactor, and it collapses the definition files to pure structured data. |
| Language names are autonyms, never translated | "Română" stays "Română" in the English UI. That is what lets someone who switched by accident find their way back. Same reason the selector uses `#limba-<code>` ids: the button has to be usable by someone who cannot read the screen. |
| CSV export headers stay untranslated | It is a machine-interchange schema and already writes `exerciseId` slugs; a locale-dependent header would break anyone's spreadsheet on language switch. |
| One manifest, bilingual `description` line | A manifest has a single `lang`, and Chrome snapshots it at install time, so two manifests buy nothing. The in-app `<meta name="description">` is swapped at runtime instead. |
| A connected treadmill feeds the EXISTING `SegmentBanda` list | The machine just replaces the thumb on the steppers; ACSM integration, tests and calorie math stay exactly as they were. Steppers remain authoritative when nothing is connected. |
| Rower/bike calories from power at 22% efficiency, +1 MET resting | Concept2's own formula (4×W + 300 kcal/h) is markedly more generous. We'd rather under-promise calories than inflate them. Machine-reported MET wins when the machine sends one; the watch's HR still beats everything. |
| Generic FTMS + a diagnostic scanner, not a Star Trac driver | The StairMaster rower is confirmed FTMS; the Star Trac 8TR is confirmed Bluetooth but NOT confirmed FTMS. Writing a proprietary decoder blind is guesswork — the scanner brings back facts first. |
| "Data trecută" is generic, not machine-only | Same component, same query (`setLogsForExercise`, already indexed); making it barbell-aware too costs nothing and delivers the roadmap's progressive-overload nudge. |
| BLE state lives in a separate, non-persisted `liveStore` | `sessionStore` persists its whole state to localStorage; GATT handles and 3-second-old telemetry have no business surviving a refresh. |

## 4. Honest limitations (documented to the owner)

- **iOS**: installable + offline OK, but no Web Bluetooth (no live HR) — manual Add to Home Screen.
- **Freefit**: no public API → CSV file import only (parser is deliberately tolerant).
- **Huawei GT4**: live HR only via the watch's workout "Difuzare ritm cardiac" (standard BLE HR
  broadcast). Steps are not available live over BLE — not implemented.
- **Truly silent BLE auto-connect is not guaranteed by the platform.** `requestDevice()` always
  needs a user gesture; the gesture-free path (`getDevices()` + `watchAdvertisements()`) is still
  behind `chrome://flags/#enable-experimental-web-platform-features`. We feature-detect and use it
  when present; otherwise the session shows a one-tap ♥ chip. Re-connecting after a *dropped*
  link needs no gesture and is automatic everywhere.
- **Star Trac 8TR is unproven.** It pairs over Bluetooth, but nothing we found confirms it speaks
  FTMS. The StairMaster HIIT Rower is confirmed FTMS. Setări → "Scanează un aparat" exists to
  settle this at the gym; note it can only reveal services declared up front, hence the
  custom-UUID field.
- Notifications for rest timer: only beeps/vibration in-app today (no system notifications yet).
- Screensaver motion-wake needs sensor permission on some Android browsers; touch always works.
- **No self-service password reset yet** (needs an email sender) — stopgap is the owner-run
  `reset-password` script on the server (docs/OPS.md); the UI is honest about it.
- Sync accounts are open-signup, guarded by per-IP auth rate limits + a 25 MB/account quota
  (~15+ years of sets) — a DoS guard more than a real limit.
- **An existing profile with no `limba` setting follows the phone, which can mean it switches to
  English on first load after the update.** `limba` is deliberately absent from `SETARI_IMPLICITE`
  (`undefined ?? 'auto'`, same as `pulsAuto`/`aparatAuto`), and "auto" negotiates with
  `navigator.languages` — correct for a new user, but every profile that existed before this change
  never actually chose Romanian, it was simply the only option. On a phone set to English the app
  will now open in English. The fix, if it is unwanted, is one tap in Setări → Limba → 🇷🇴 Română,
  which then syncs to every device like `tema`. Deliberately not migrated: writing a language into
  everyone's settings row would be a sync write on behalf of a user who never asked for it. This is
  also why `scripts/smoke.mjs` runs its contexts with `locale: 'ro-RO'` — otherwise Chromium's
  `en-US` default makes the Romanian pass boot in English, which is the app behaving correctly.

## 5. Roadmap / ideas the owner may ask for next

- ~~Sync backend on owner's Hetzner VPS~~ — **built (timeline #5)**. Follow-ups it opened:
  password reset by email (Resend or similar), account e-mail change, per-device session list
  ("deloghează telefonul vechi"), maybe periodic background sync when the PWA gets notifications.
- Weekly recap screen ("săptămâna ta în cifre") + shareable card.
- System notifications (rest end, workout reminders) via Notification API / periodic sync.
- **5/3/1 training-max assistant**: store a TM per main lift, compute the week's percentages and
  auto-advance the cycle (today the percentages are static text in each set's `notite`).
- Program "current week" tracking: which day of PPL / which phase of the powerbuilding wave you're
  on, surfaced on the home page.
- Richer animations for the new lifts (several reuse an existing scene via `anim`), plus
  per-exercise photos of the actual gym machines.
- ~~Progressive-overload assistant~~ — **partly done**: the "data trecută" strip nudges +2,5% on
  the best set. A full per-exercise progression scheme is still open.
- **Star Trac follow-up**: run the diagnostic at the gym; if the treadmill isn't FTMS, decode
  whatever its report shows.
- Steps/daily activity: manual entry or Health Connect (would require a native wrapper — out of
  PWA scope today).
- Body measurements tracking beyond weight (talie/gât already captured; chart them).
- Export/print a workout as PDF "carte de sală".
- ~~English + multilingual architecture~~ — **built (timeline #7)**. Follow-ups it opened:
  a third language is now genuinely one message file + one catalogue file + one registry line
  (Hungarian would be the obvious candidate for Romania); English screenshots via a
  `GYM_NOOB_LIMBA=en` hook in `scripts/screenshots.mjs` (noted, not built — `npm run capturi`
  stays Romanian because those feed the owner's own docs); and a `lang`-aware TTS voice picker if
  a device turns out to have no en-GB voice (the `Map` keyed by BCP-47 tag is already in place).

## 6. Working agreements

- Keep the Dummies aesthetic and Flexu's encouraging, funny, judgement-free voice in ALL copy.
- Romanian only in UI; English OK in code comments/docs.
- Every math change lands with a unit test; every new user flow gets a smoke-test step.
- The owner's real training data lives in his browsers — migrations must be additive
  (Dexie version bump + upgrade fn), and destructive actions always behind a confirm + backup.
