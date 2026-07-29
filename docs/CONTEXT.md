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

## 3. Decisions & rationale (don't relitigate casually)

| Decision | Why |
|---|---|
| Local-first, IndexedDB, no accounts | Zero cost/ops, privacy, offline gym basements. `src/data/` isolated so sync can come later. |
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

## 4. Honest limitations (documented to the owner)

- **iOS**: installable + offline OK, but no Web Bluetooth (no live HR) — manual Add to Home Screen.
- **Freefit**: no public API → CSV file import only (parser is deliberately tolerant).
- **Huawei GT4**: live HR only via the watch's workout "Difuzare ritm cardiac" (standard BLE HR
  broadcast). Steps are not available live over BLE — not implemented.
- Notifications for rest timer: only beeps/vibration in-app today (no system notifications yet).
- Screensaver motion-wake needs sensor permission on some Android browsers; touch always works.

## 5. Roadmap / ideas the owner may ask for next

- Sync backend on owner's **Hetzner VPS** (he mentioned it; data layer is ready for a repo-swap).
  Would need auth + conflict strategy; keep export/import as the migration path.
- Weekly recap screen ("săptămâna ta în cifre") + shareable card.
- System notifications (rest end, workout reminders) via Notification API / periodic sync.
- **5/3/1 training-max assistant**: store a TM per main lift, compute the week's percentages and
  auto-advance the cycle (today the percentages are static text in each set's `notite`).
- Program "current week" tracking: which day of PPL / which phase of the powerbuilding wave you're
  on, surfaced on the home page.
- Richer animations for the new lifts (several reuse an existing scene via `anim`), plus
  per-exercise photos of the actual gym machines.
- Progressive-overload assistant: suggest next weight from history (domain/oneRm has
  `greutatePentruReps` ready).
- Steps/daily activity: manual entry or Health Connect (would require a native wrapper — out of
  PWA scope today).
- Body measurements tracking beyond weight (talie/gât already captured; chart them).
- Export/print a workout as PDF "carte de sală".

## 6. Working agreements

- Keep the Dummies aesthetic and Flexu's encouraging, funny, judgement-free voice in ALL copy.
- Romanian only in UI; English OK in code comments/docs.
- Every math change lands with a unit test; every new user flow gets a smoke-test step.
- The owner's real training data lives in his browsers — migrations must be additive
  (Dexie version bump + upgrade fn), and destructive actions always behind a confirm + backup.
