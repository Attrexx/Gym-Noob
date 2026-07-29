# Gym Noob — project memory for Claude Code

Romanian-language gym PWA for absolute beginners, styled as a '90s "…for Dummies" book
(yellow bg, thick black borders, hard shadows, mascot). Owner: Attrexx — returning to the gym,
tandem goals: weight loss + muscle gain. Everything is **Romanian UI + metric units**.
Deep context, decisions and roadmap: see `docs/CONTEXT.md`. Read it before large changes.

## Commands

- `npm run dev` — dev server at `http://localhost:5173/Gym-Noob/` (note the base path)
- `npm test` — Vitest unit tests for `src/domain/` (all math lives there) plus catalog/program
  integrity and text helpers; keep them green
- `npm run build` — tsc + vite build + service worker → `dist/`
- `npm run smoke` — Playwright e2e against the built `dist/` (needs Chromium; set `CHROMIUM_PATH`
  on Windows, e.g. `C:\Program Files\Google\Chrome\Application\chrome.exe`)
- `npm run deploy` — **the publish button**: test + build + commit `dist/` + push

## Deployment model (unusual — do not "fix" it)

Build happens **locally**; `dist/` is **committed** on purpose. The GitHub Actions workflow does
NOT build — it only uploads the committed `dist/` to GitHub Pages (triggers on pushes to `main`
touching `dist/**`). Pushing source without rebuilding leaves the live site stale by design.
Live URL: https://attrexx.github.io/Gym-Noob/ · Vite `base` is `/Gym-Noob/` — never remove it.
Routing is **HashRouter** (GH Pages friendly) — don't switch to BrowserRouter.

## Architecture

- **Local-first, no backend.** All user data in IndexedDB via Dexie (`src/data/db.ts`).
  Only `src/data/` may touch Dexie — this isolation exists so a sync backend (owner may want his
  Hetzner VPS someday) can be added without rewriting features.
- `src/data/types.ts` — all entities. `src/data/repo.ts` — data access. `src/data/backup.ts` —
  JSON export/import (full replace).
- **Exercise catalog is static TS**, not in DB: `src/data/catalog/exercises*.ts` (~100 exercises in
  three files, merged + indexed by `exercises.ts`), plus `programs.ts`, `starterTemplates.ts`,
  `articles.ts`, `tips.ts`.
- **Library categories** (`ExerciseCategory`) are mostly *derived* from `echipament`/`tip` in
  `categoriiExercitiu()`; write `categorii` on an exercise only when derivation isn't enough
  (e.g. tagging the big lifts `powerlifting`). New equipment kinds must land in a category branch
  there — the catalog test fails if an exercise ends up in none.
- **Famous programs** (`src/data/catalog/programs.ts`: Full Body 3x, powerbuilding periodizat,
  PPL, Upper/Lower, Wendler 5/3/1 BBB, calistenice) are static `ProgramDef`s shown at `/programe`.
  Importing one copies its workouts into the user's templates, tagged `program:<id>` in `etichete`
  — re-importing replaces those rows instead of duplicating them.
- A `TemplateItem` with `repetari: undefined` means **AMRAP** ("cât poți") and must carry a
  `notite` explaining it; `notite` is shown in the session and in the plan editor.
- `src/domain/` — pure, unit-tested math (see formulas below). No React/Dexie imports here.
- `src/state/profileStore.ts` — active profile + settings (Zustand); applies theme.
  `src/state/sessionStore.ts` — live workout session; persisted to localStorage so it survives
  reloads; set/water logs still write straight to IndexedDB.
- `src/features/<area>/` — pages. `src/design/` — tokens (`global.css`), shared components
  (`components.tsx`: Sticker, BigButton, Stepper, Modal, StatTile…), and the mascot `Flexu.tsx`.
- `src/services/` — audio beeps/metronome (Web Audio), TTS (ro), wake lock, BLE heart rate,
  achievements aggregation.
- AnalyticsPage is lazy-loaded (Recharts is heavy). Keep it that way.

## Domain formulas (tested in `tests/`)

BMR Mifflin-St Jeor · TDEE activity factors · deficit from rate (7700 kcal/kg, **clamped to
max 1 kg/week**, intake floor = max(1200, 80%·BMR)) · calories = MET×3.5×kg/200×min, RPE scales
±6%/point clamped [0.7,1.3] · **treadmill MET from speed+incline via ACSM equations** (walk <8 km/h,
run ≥8), integrated over segments as the user changes settings mid-run — when this dynamic MET is
used, RPE must NOT also scale it · Keytel HR formula when watch connected (only ≥90 bpm) ·
Epley 1RM · US Navy body fat · PR detection: no PR without prior history, and only vs earlier
sessions (never vs sets from the same session).

## Conventions & gotchas

- UI strings are **inline Romanian** — no i18n framework, single language by design. Domain/UI
  identifiers use Romanian words (greutate, sesiune, realizari); keep that consistent.
- TypeScript strict; path alias `@/` → `src/`; tests only under `tests/`.
- **Dexie schema changes require a version bump** in `db.ts` (`this.version(2).stores(...)` + an
  upgrade fn). Users have real data — never wipe or clear tables outside explicit backup/restore.
- Settings fields added after v1 may be `undefined` on old rows — follow the
  `setari.economizor !== false` fallback pattern.
- localStorage keys: `gym-noob-profil-activ` (active profile id), `gym-noob-sesiune` (live session).
- Session UX invariants: wake lock during session (re-acquired on visibilitychange); screensaver
  after 45 s idle (black, dimmed essentials, wakes on touch/devicemotion, toggle in Setări);
  rest-timer beeps in last 3 s + fanfare + vibration at 0; plate calculator assumes a 20 kg bar.
- Web Bluetooth HR = standard `heart_rate` GATT; works with Huawei GT4's "Difuzare ritm cardiac"
  during a watch workout; **iOS has no Web Bluetooth** — always feature-detect (`bleDisponibil`).
- Freefit has no API; import is a tolerant CSV parser (`src/domain/freefit.ts`) — en/ro headers,
  `dd.MM.yyyy`, decimal commas, per-day dedup.
- New achievements: add def + condition in `src/domain/achievements.ts` (unique id, Romanian,
  humor welcome); evaluation context builds in `src/services/achievementService.ts`.
- Mascot: use `<Flexu poza=… />` / `<FlexuSpune>`; poses: salut, explica, sarbatoreste,
  avertizeaza, obosit, hidratare, flex, ganditor.
- Tone of all copy: encouraging, funny, zero judgement — Flexu was a noob too.

## Definition of done for a change

`npm test` green → `npm run build` clean → `npm run smoke` passes → then `npm run deploy`.
If you add a flow, extend `scripts/smoke.mjs` to cover it.
