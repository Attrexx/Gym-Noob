# Gym Noob — project memory for Claude Code

Romanian-language gym PWA for absolute beginners, styled as a '90s "…for Dummies" book
(yellow bg, thick black borders, hard shadows, mascot). Owner: Attrexx — returning to the gym,
tandem goals: weight loss + muscle gain. Everything is **Romanian UI + metric units**.
Deep context, decisions and roadmap: see `docs/CONTEXT.md`. Read it before large changes.

## Commands

- `npm run dev` — dev server at `http://localhost:5173/Gym-Noob/` (note the base path)
- `npm test` — Vitest: domain math + catalog integrity + data-layer/sync tests (fake-indexeddb) +
  the i18n suite in `tests/i18n/` (key/param/plural parity across languages, catalog coverage, and
  the no-Romanian-in-components check), THEN the API suite in `server/` (chained via
  `npm --prefix server test`). First checkout needs a one-time `npm install` inside `server/` too.
  Keep both green.
- `npm run build` — tsc + vite build + service worker → `dist/`
- `npm run api:dev` — run the sync API locally (`node server/src/main.ts`, Node ≥24, port 8787)
- `npm run smoke` — Playwright e2e against the built `dist/` (needs Chromium; set `CHROMIUM_PATH`
  on Windows, e.g. `C:\Program Files\Google\Chrome\Application\chrome.exe`). Also spawns the sync
  API on :8788 with a throwaway DB and runs a TWO-device account/sync flow (second browser context).
  The main pass stays **Romanian** on purpose — its ~75 accessible-name selectors are the proof the
  Romanian app is unchanged. English gets a short 7-step pass (`#limba-en` → back to `#limba-ro`)
  placed before the account block so it cannot perturb the two-device flow.
- `npm run capturi` — UI screenshots of the built `dist/` into a fresh versioned folder
  (`capturi/vNN_YYYY-MM-DD/`, index + per-shot README written automatically). Same `CHROMIUM_PATH`
  requirement as `smoke`; takes ~2.5 min because it waits out the 45 s screensaver.
- `npm run mascota` — re-imports Flexu's artwork from `Images/Vectorized/` into
  `src/assets/mascota/` (+ `public/sticker.svg`). Only needed when the drawings change.
- `npm run iconite` — regenerates the PWA icons from `Icon-Mascot-Large.svg`. Needs `CHROMIUM_PATH`.
- `npm run deploy` — **the publish button**: test + build + commit `dist/` + push

## Deployment model (unusual — do not "fix" it)

Build happens **locally**; `dist/` is **committed** on purpose. The GitHub Actions workflow does
NOT build — it only uploads the committed `dist/` to GitHub Pages (triggers on pushes to `main`
touching `dist/**`). Pushing source without rebuilding leaves the live site stale by design.
Live URL: https://attrexx.github.io/Gym-Noob/ · Vite `base` is `/Gym-Noob/` — never remove it.
Routing is **HashRouter** (GH Pages friendly) — don't switch to BrowserRouter.

**The sync API is the one deliberate exception**: `.github/workflows/api.yml` DOES build — it
tests `server/` and pushes a **linux/arm64** Docker image to GHCR on `api-v*` tags (the Hetzner
box is ARM; a local Windows build wouldn't run there). Deploy with `bash ops/deploy.sh api-vX.Y.Z`
(Git Bash). Full server runbook — DNS, Caddy vhost, secrets, backups, restore drill, password
reset: **`docs/OPS.md`**. The API lives at `https://gym-api.lessgo.city` on the SHARED VPS
(rules: no host ports, ≤256 MB, never touch other tenants).

## Architecture

- **Local-first, with an OPTIONAL sync backend.** All user data in IndexedDB via Dexie
  (`src/data/db.ts`, schema **v2**). Only `src/data/` may touch Dexie. The app is fully usable
  offline and without an account — sync is opt-in from Setări.
- `src/data/types.ts` — all entities. `src/data/repo.ts` — data access; **every write here stamps
  sync metadata** (`uid`, `updatedAt`, `dirty:1` + FK-mirror uids `profileUid`/`sessionUid`/
  `templateUid`). NEVER write to Dexie outside `repo.ts`/`src/data/` — the sync engine would miss
  it. Any NEW delete site must also record a `deletions` outbox row (see `deleteTemplate`).
  `src/data/backup.ts` — JSON export/import v2 (full replace; v1 files get uids backfilled via
  `normalize.ts`, shared with the Dexie v1→v2 upgrade). `deletions` + `syncState` tables are
  local-only: never exported, never cleared by restore.
- **Sync** (`src/data/sync/` + `server/` + `shared/wire.ts`): one account = ONE profile
  (email+password, scrypt, rotating JWT refresh). Row-level last-write-wins by `updatedAt`
  (server clamps clocks to now+5 min; ties keep server on upsert, favor deletion on delete).
  Push-pull `POST /sync` with a per-user `seq` cursor stored in Dexie `syncState` — the cursor
  advances IN THE SAME transaction that applies pulled rows. Settings/achievements use DERIVED
  uids (`<profileUid>-settings`, `<profileUid>-ach-<id>`) so both devices address the same row.
  **In-flight sessions (activa/pauza) and their logs never push** — they leave when `opreste()`
  runs. Triggers: app start/profile switch, visibilitychange→visible, online, session end, manual.
  Server: Hono + built-in `node:sqlite` (Node ≥24, zero native deps), generic row store — client
  schema changes need NO server migration. NEVER add the API origin to the service worker's
  `runtimeCaching`.
- **Exercise catalog is static TS**, not in DB, and **split into structure + text**:
  `src/data/catalog/exercises*.ts` hold `ExerciseCore`s (98 exercises in three files, merged +
  indexed by `exercises.ts`) — MET, muscles, equipment kind, difficulty, animation. All the prose
  lives per-language in `catalog/text/<lang>*.ts` and is keyed by id. The numbers exist **once**, so
  they cannot drift between languages; every `Record<XId, …>` is exhaustive, so a new exercise id
  breaks *every* language at compile time until it is filled in. `ids.ts` is the registry.
  `aplicaTextCatalog(pack)` (called by `incarcaLimba`) rebuilds `lista`, the `Map` index and the
  `categoriiExercitiu()` cache — which is why `EXERCITII → exercitii()` and `PROGRAME → programe()`
  are functions: "this depends on the active language" should be visible, not hidden behind an ESM
  live binding.
- **Library categories** (`ExerciseCategory`) are mostly *derived* from `echipament`/`tip` in
  `categoriiExercitiu()`; write `categorii` on an exercise only when derivation isn't enough
  (e.g. tagging the big lifts `powerlifting`). New equipment kinds must land in a category branch
  there — the catalog test fails if an exercise ends up in none.
- **Famous programs** (`src/data/catalog/programs.ts`: Full Body 3x, powerbuilding periodizat,
  PPL, Upper/Lower, Wendler 5/3/1 BBB, calistenice) are static `ProgramDef`s shown at `/programe`.
  Importing one copies its workouts into the user's templates, tagged `program:<id>` in `etichete`
  — re-importing replaces those rows instead of duplicating them.
- A `TemplateItem` with `repetari: undefined` means **AMRAP** ("cât poți") and must carry an
  explanation; `notite` is shown in the session and in the plan editor. Generated AMRAP notes use
  `notaKey` (a catalog id) rather than prose, so they translate — `notite` stays as the fallback.
- **Catalog text copied into user data is resolved, never rewritten.** Templates and sessions born
  from a starter/programme carry `sursaText` (`'starter:<id>'` / `'program:<pid>/<wid>'`); the
  resolver in `catalog/text/rezolva.ts` returns live catalog text for those and the stored `nume`
  for anything the user made or renamed (`textEditat`). **Never retranslate stored rows**: sync is
  row-level last-write-wins, so a Romanian phone and an English tablet would rewrite each other's
  templates forever.
- `src/domain/` — pure, unit-tested math (see formulas below). No React/Dexie imports here, and
  **it never imports `src/i18n/` either**: domain returns ids and numbers, prose lives in messages,
  and string assemblers live outside `domain/` (`descrieSetLog`/`descrieAparat` → `src/i18n/
  descrieri.ts`). Classifiers return union ids (`bmiCategorie()` → `'obezitate1'`), which the UI
  resolves with `` t(`domeniu.imc.${…}`) ``.
- **i18n** (`src/i18n/`): hand-rolled, zero dependencies. `messages/ro.ts` is the SOURCE OF TRUTH;
  `messages/en.ts` ends `satisfies Traducere<Mesaje>`, so a missing key or a string where Romanian
  has a plural is a compile error. Keys are flat and dotted (`<zonă>.<secțiune>.<rol>`) and stay
  Romanian, like the rest of the identifiers. Plural comes from `Intl.PluralRules` per language —
  Romanian needs `one/few/other`, English only `one/other`; never hardcode the category list.
  `<T k="…" />` (`rich.tsx`) is the `<Trans>` replacement for mid-sentence bold or links; a ternary
  must select a **key**, never a sentence fragment. Locale lives in its own Zustand store, not in
  `profileStore`, because ~10 non-React call sites need `t()` synchronously.
  **Adding a language = `messages/<code>.ts` + `data/catalog/text/<code>.ts` + `pachet-<code>.ts` +
  one line each in `LIMBI`, `TAG` and `PACHETE`. Zero component changes.**
  Both packs load as ONE `import()` per language (messages + catalog together), so there is never a
  half-translated frame; `versiune` in the store only bumps after the pack is fully applied.
- `src/state/profileStore.ts` — active profile + settings (Zustand); applies theme.
  `src/state/sessionStore.ts` — live workout session; persisted to localStorage so it survives
  reloads; set/water logs still write straight to IndexedDB.
  `src/state/liveStore.ts` — **not persisted, on purpose**: BLE machine connection, last FTMS
  sample, per-set accumulators (`rezumatSet()` feeds `logSet`) and `kcalParial` (calories accruing
  during a running set, display-only). Never put GATT handles in `sessionStore` — it persists
  everything to `gym-noob-sesiune`.
- `src/features/<area>/` — pages. `src/design/` — tokens (`global.css`), shared components
  (`components.tsx`: Sticker, BigButton, Stepper, Modal, StatTile…), the mascot `Flexu.tsx` and
  the wordmark `Sigla.tsx`.
- **Brand artwork is drawn, not coded.** Flexu and the wordmark are SVG illustrations in
  `src/assets/mascota/`, produced from `Images/Vectorized/` by `scripts/mascota.mjs`. That script
  is the only place they're touched: it adds the missing `viewBox`, strips the opaque background
  (two layers — a `<rect>` *and* a full-canvas `<path>`), and snaps the auto-traced near-black /
  yellow / red / cream fills onto the exact palette codes, deliberately leaving skin shading and
  the yellow splash alone. Don't hand-edit the files in `src/assets/mascota/` — rerun the script.
  They're loaded by URL (`<img>`), never inlined: ~55 KB each, 214 KB gzipped for all ten.
- `src/services/` — audio beeps/metronome (Web Audio), TTS (ro), wake lock, BLE heart rate,
  BLE fitness machines (FTMS), achievements aggregation. `ble.ts` holds the shared reconnect
  logic for both HR and machines.
- **Programe = Planuri**: ONE page (`TemplatesPage`, tabs "Ale mele" / "Ale aplicației") served at
  both `/antrenamente` and `/programe` via a `tabInitial` prop. `ProgramsPage.tsx` exports the tab
  body `ProgrameAplicatie`, not a page. Don't reintroduce a separate programs screen.
- `AlegeExercitiu.tsx` (in `features/builder/`) is the ONE exercise picker + parameter sheet —
  used by the session and the plan editor. Add exercise-choosing UI there, not a third copy.
- AnalyticsPage is lazy-loaded (Recharts is heavy). Keep it that way.

## Domain formulas (tested in `tests/`)

BMR Mifflin-St Jeor · TDEE activity factors · deficit from rate (7700 kcal/kg, **clamped to
max 1 kg/week**, intake floor = max(1200, 80%·BMR)) · calories = MET×3.5×kg/200×min, RPE scales
±6%/point clamped [0.7,1.3] · **treadmill MET from speed+incline via ACSM equations** (walk <8 km/h,
run ≥8), integrated over segments as the user changes settings mid-run — when this dynamic MET is
used, RPE must NOT also scale it · Keytel HR formula when watch connected (only ≥90 bpm) ·
Epley 1RM · US Navy body fat · PR detection: no PR without prior history, and only vs earlier
sessions (never vs sets from the same session) · **MET from machine power** (`metDinPutere`,
22% mechanical efficiency + 1 MET resting) for rower/bike.
**Calorie precedence** (decided at the call site, matching the existing "objective MET ⇒ no RPE"
rule): watch HR ≥ 90 → Keytel · machine-reported MET · treadmill ACSM (`metMediuBanda`, fed by the
steppers *or* the connected machine) · machine power → `metDinPutere` · catalog MET × RPE.
Watch HR beats machine HR.
**Time at the gym** (`src/domain/sesiuni.ts`): `impartireTimp` derives total/activ/pauză from
`inceput`/`sfarsit`/`durataActivaSec` — there is deliberately no stored `pauzaSec` column to drift
out of sync. `planDinSeturi` builds a plan from what was actually logged (median reps/weight).

## Conventions & gotchas

- **Bilingual: Romanian + English (en-GB), metric in both.** No i18n library — a hand-rolled
  runtime under `src/i18n/` (see the i18n section below). There are **no UI strings in components**;
  `tests/i18n/fara-romana-in-cod.test.ts` fails on any Romanian text that reappears in
  `src/features|app|design`. Domain/UI *identifiers* stay Romanian words (greutate, sesiune,
  realizari) — that has not changed and should stay consistent.
- TypeScript strict; path alias `@/` → `src/`; tests only under `tests/`.
- **Dexie schema changes require a version bump** in `db.ts` (`this.version(2).stores(...)` + an
  upgrade fn). Users have real data — never wipe or clear tables outside explicit backup/restore.
  Adding *optional, unindexed* fields to an entity is NOT a schema change (the `stores()` string
  only declares indexes) — that's why the machine fields on `SetLog` landed on v2 with no bump and
  no server work. The moment a new field needs an index, bump to v3.
- Settings fields added after v1 may be `undefined` on old rows — follow the
  `setari.economizor !== false` fallback pattern. Same for sync metadata (`uid?`, `updatedAt?`,
  `dirty?`) — optional in types, backfilled by the v2 upgrade.
- localStorage keys: `gym-noob-profil-activ` (active profile id), `gym-noob-sesiune` (live
  session), `gym-noob-limba` (boot hint for the language, so the first paint is never in the wrong
  one — written by `aplicaLimba`), `gym-noob-api-url` (dev/smoke override of the sync API base URL —
  lets the committed production build talk to a local server without rebuilding).
- Restoring a backup while an account is linked is AUTHORITATIVE for the cloud: same-uid profile →
  `/sync/replace`; missing/re-uid'd profile (v1 files) or replace failure → the link is dropped
  with a clear message (no silent merge). See `dupaRestaurareBackup` in `src/data/sync/engine.ts`.
- Password reset: not self-service yet — owner runs `reset-password` on the server (docs/OPS.md).
  The UI says so; don't promise email reset.
- Session UX invariants: wake lock during session (re-acquired on visibilitychange); screensaver
  after 45 s idle (black, dimmed essentials, wakes on touch/devicemotion, toggle in Setări);
  rest-timer beeps in last 3 s + fanfare + vibration at 0; plate calculator assumes a 20 kg bar.
- Web Bluetooth HR = standard `heart_rate` GATT; works with Huawei GT4's "Difuzare ritm cardiac"
  during a watch workout; **iOS has no Web Bluetooth** — always feature-detect (`bleDisponibil`).
- **BLE gestures**: `requestDevice()` REQUIRES a user gesture — silent first-connect is only
  possible via `getDevices()`+`watchAdvertisements()`, still flag-gated in Chrome, so always
  feature-detect (`bleSilentiosDisponibil()`) and keep the one-tap fallback. Reconnecting a device
  you already hold needs no gesture — that's why auto-retry works everywhere.
- **FTMS parsing gotcha** (`src/domain/ftms.ts`): flag **bit 0 is "More Data" and INVERTED** —
  instantaneous speed (treadmill) and stroke rate/count (rower) are present when bit 0 is **0**.
  Every other bit means "present" when 1. Distance is uint24, inclination is sint16 ×0,1 %, and
  "expended energy" is a triple (total uint16 + per-hour uint16 + per-minute uint8) — reading only
  the first two bytes silently misaligns everything after it. Parsers are pure and byte-fixture
  tested in `tests/ftms.test.ts`; keep them free of Web Bluetooth.
- localStorage `gym-noob-aparat-fals` = `'banda'|'rower'` makes `bleMachine` return a **simulated**
  machine emitting samples on a timer — Playwright can't do Bluetooth, so the smoke test uses this.
  Inert unless the key is set; same trick as `gym-noob-api-url`.
- Freefit has no API; import is a tolerant CSV parser (`src/domain/freefit.ts`) — en/ro headers,
  `dd.MM.yyyy`, decimal commas, per-day dedup.
- New achievements: add def + condition in `src/domain/achievements.ts` (unique id, Romanian,
  humor welcome); evaluation context builds in `src/services/achievementService.ts`.
- Mascot: use `<Flexu poza=… />` / `<FlexuSpune>`; poses: salut, explica, sarbatoreste,
  avertizeaza, obosit, hidratare, flex, ganditor. There are only **six drawings for eight poses** —
  the mapping table at the top of `Flexu.tsx` is the single source of truth (ganditor reuses
  explica's art, obosit reuses flex's). `<FlexuBula text="…">` is the third variant: the *drawn*
  speech bubble with arbitrary text, which shrinks itself until it fits — meant for short lines,
  not paragraphs. `FlexuSpune`'s bubble is CSS, not SVG, on purpose: Romanian body text has to
  reflow at any width.
- **Colour comes from one place.** The six brand codes in `global.css` (#F5C518 / #FFF8E0 /
  #171310 / #D0342C / #2E7D32 / #1565C0) are the same ones baked into the artwork, so the
  mascot's tank top is literally the page's yellow. `--panou` is the cream, not a separate white.
- **Type is two-tier.** `--font-afis` (Rammetto One) is the loud voice — `h1` only, matching the
  drawn logo. `--font-titlu` (Archivo Black) stays on buttons, stat values and h2/h3, where a
  rounded display face would jitter numbers and shout. Rammetto One was picked because it's the
  closest match to the logo lettering that **has Ș and Ț**: Luckiest Guy and Titan One look nearer
  but lack the Romanian comma-below letters, so "Exerciții" would fall back mid-word.
  Its accents are extreme — Î reaches 1.17em above the baseline (cap height is 0.78em) and Ț drops
  0.5em — so `h1` carries `padding-top: .3em` and a roomy `margin-bottom`, and `FlexuBula`'s text
  has vertical padding. Tighten either and "ÎNCEPE SESIUNEA" collides with the supratitlu above it.
- The startup screen lives in `index.html` (`#pornire`), not React, so the logo shows before the
  bundle parses; `App.tsx` fades and removes it once the profile is read. It uses
  `public/sticker.svg` — a fixed path, since pre-hydration HTML can't reference a hashed import.
- Tone of all copy: encouraging, funny, zero judgement — Flexu was a noob too.

## Definition of done for a change

`npm test` green → `npm run build` clean → `npm run smoke` passes → then `npm run deploy`.
If you add a flow, extend `scripts/smoke.mjs` to cover it.
