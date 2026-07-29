/**
 * Capturi de ecran pentru urmărirea evoluției interfeței.
 *
 *   npm run capturi              → capturi/v03_2026-07-29/ (versiune nouă, auto)
 *   npm run capturi -- <dir>     → într-un folder anume
 *
 * Fiecare rulare creează un subfolder versionat în `capturi/`, plus un
 * `README.md` cu data, commit-ul și lista ecranelor — ca să se vadă în timp
 * cum a arătat aplicația la fiecare pas.
 */
import { chromium } from 'playwright-core';
import { spawn, execSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RADACINA = 'capturi';

/** capturi/v01_2026-07-29 — numărul crește singur, data e a rulării */
function folderVersionat() {
  mkdirSync(RADACINA, { recursive: true });
  const existente = readdirSync(RADACINA).filter((d) => /^v\d+_/.test(d));
  const ultima = existente.reduce((max, d) => Math.max(max, Number(d.slice(1, d.indexOf('_')))), 0);
  const azi = new Date().toISOString().slice(0, 10);
  return `${RADACINA}/v${String(ultima + 1).padStart(2, '0')}_${azi}`;
}

const OUT = process.argv[2] ?? folderVersionat();
mkdirSync(OUT, { recursive: true });

const exe = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const PORT = 4174;
const BASE = `http://localhost:${PORT}/Gym-Noob/`;

// Pornim vite direct cu node, nu prin `npx`: pe Windows npx e un .cmd, iar
// kill() ar omorî shell-ul, lăsând serverul orfan și blocând scriptul la final.
const vite = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const server = spawn(process.execPath, [vite, 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
});
const kill = () => {
  try {
    server.kill();
  } catch {
    /* gata deja */
  }
};
process.on('exit', kill);

await new Promise((res, rej) => {
  const t0 = Date.now();
  const tick = async () => {
    try {
      if ((await fetch(BASE)).ok) return res(null);
    } catch {
      /* încă pornește */
    }
    if (Date.now() - t0 > 20000) return rej(new Error('preview nu a pornit'));
    setTimeout(tick, 300);
  };
  void tick();
});

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 2 });

const ecrane = [];

/**
 * Așteaptă ca pagina să nu mai crească. Datele vin din IndexedDB după primul
 * render, așa că o captură `fullPage" luată prea devreme măsoară pagina scurtă
 * și taie tot ce apare între timp.
 */
async function inaltimeStabila() {
  let anterioara = -1;
  for (let i = 0; i < 25; i++) {
    const acum = await page.evaluate(() => document.documentElement.scrollHeight);
    if (acum === anterioara) return acum;
    anterioara = acum;
    await page.waitForTimeout(120);
  }
  return anterioara;
}

/** o captură + o linie în index; `tot: true` prinde toată pagina, nu doar ecranul */
const shot = async (nume, descriere, tot = false) => {
  if (tot) await inaltimeStabila();
  await page.screenshot({ path: `${OUT}/${nume}.png`, fullPage: tot });
  ecrane.push({ nume, descriere, tot });
  console.log('📸', nume);
};

try {
  // ── onboarding ──
  await page.goto(BASE);
  await page.getByText('Să începem').waitFor();
  await shot('01-coperta', 'Coperta de bun venit, în stil „…for Dummies"');

  await page.getByRole('button', { name: /Să începem/ }).click();
  await page.locator('#ob-nume').fill('Attrexx');
  await shot('02-onboarding-cine-esti', 'Onboarding 1/4 — nume, sex, vârstă, înălțime');
  await page.getByRole('button', { name: 'Mai departe' }).click();
  await page.locator('#ob-greutate').fill('102');
  await shot('03-onboarding-corp', 'Onboarding 2/4 — greutate și măsurători opționale');
  await page.getByRole('button', { name: 'Mai departe' }).click();
  await page.locator('#ob-tinta').fill('88');
  await page.getByRole('button', { name: 'Mai departe' }).click();
  await shot('04-onboarding-plan', 'Onboarding 4/4 — IMC, BMR, TDEE și bugetul zilnic calculate');
  await page.getByRole('button', { name: /Creează profilul/ }).click();
  await page.getByText('Salut, Attrexx!').waitFor();
  await shot('05-acasa', 'Ecranul „Azi" — bugetul caloric, planul zilei, încurajări');

  // ── biblioteca de exerciții ──
  await page.goto(BASE + '#/biblioteca');
  await page.getByText('Presă de picioare').first().waitFor();
  await shot('06-biblioteca', 'Biblioteca: 98 de exerciții, filtre pe categorie și pe grupă musculară');

  await page.getByRole('button', { name: /Calistenice/ }).click();
  await page.waitForTimeout(300);
  await shot('07-biblioteca-calistenice', 'Subcategoria calistenice — doar exerciții cu greutatea corpului');

  await page.getByRole('button', { name: /Ridicările mari/ }).click();
  await page.waitForTimeout(300);
  await shot('08-biblioteca-ridicarile-mari', 'Subcategoria „ridicările mari" — baza programelor celebre');

  await page.goto(BASE + '#/biblioteca/genuflexiuni-haltera');
  await page.getByText('Execuția corectă').waitFor();
  await shot('09-exercitiu', 'Fișa unui exercițiu — animație, diagramă musculară, formă corectă');
  await shot('10-exercitiu-complet', 'Aceeași fișă, pagină întreagă: greșeli, ponturi, variante înrudite', true);

  // ── programe celebre ──
  await page.goto(BASE + '#/programe');
  await page.getByText('Push / Pull / Legs').first().waitFor();
  await shot('11-programe', 'Programele celebre, filtrabile după obiectiv');
  await shot('12-programe-complet', 'Lista completă: Full Body, powerbuilding, PPL, Upper/Lower, 5/3/1, calistenice', true);

  await page.goto(BASE + '#/programe/powerbuilding-periodizat');
  await page.getByText('Săptămâna arată așa').waitFor();
  await shot('13-program-powerbuilding', 'Powerbuilding periodizat — descriere, săptămână, progresie');
  await shot('14-program-powerbuilding-complet', 'Programul întreg: Faza 1 (A/B/C) și Faza 2 (A/B), cu seturi AMRAP', true);

  await page.goto(BASE + '#/programe/wendler-531');
  await page.getByText('Cum crești greutățile').waitFor();
  await shot('15-program-531', 'Wendler 5/3/1 — procentele din maximul de antrenament, notate pe fiecare set', true);

  await page.goto(BASE + '#/programe/calistenice-start');
  await page.getByText('Săptămâna arată așa').waitFor();
  await shot('16-program-calistenice', 'Programul de calistenice — scări de progresie fără greutăți', true);

  // import în planurile proprii
  await page.getByRole('button', { name: /Adaugă cele 3 antrenamente/ }).click();
  await page.getByRole('button', { name: /Reîmprospătează/ }).waitFor();
  await shot('17-program-importat', 'După import: programul e copiat în planurile tale');

  await page.goto(BASE + '#/antrenamente');
  await page.getByText('Calistenice A').first().waitFor();
  await shot('18-antrenamente', 'Planurile tale — șabloanele proprii și cele venite din programe');

  // editorul, cu notița pe set
  await page.goto(BASE + '#/programe/powerbuilding-periodizat');
  await page.getByRole('button', { name: /Adaugă cele 5 antrenamente/ }).click();
  await page.getByRole('button', { name: /Reîmprospătează/ }).waitFor();
  await page.goto(BASE + '#/antrenamente');
  // țintim cardul după nume, nu după poziție: ordinea depinde de ce s-a importat
  await page
    .locator('.sticker')
    .filter({ hasText: 'Rutina 2 · Antrenamentul A' })
    .getByRole('button', { name: 'Editează' })
    .click();
  // items-ele vin din IndexedDB — așteptăm un exercițiu, nu doar butonul de salvare
  await page.getByText('Tracțiuni cu priză supinată', { exact: false }).waitFor();
  await shot('19-editor-antrenament', 'Editorul de antrenament — seturi AMRAP și notițe pe exercițiu', true);

  // ── sesiune live ──
  await page.goto(BASE + '#/sala');
  await page.getByText('Full Body A').first().click();
  await page.getByRole('button', { name: /START/ }).click();
  await page.getByRole('button', { name: /Pauză/ }).waitFor();
  await page.getByText('Viteză').waitFor();
  await shot('20-sesiune-banda', 'Sesiune live — banda de alergare cu viteză și înclinație reglabile');

  console.log('   (aștept economizorul de ecran, 47 s…)');
  await page.waitForTimeout(47_000);
  await shot('21-economizor', 'Economizorul de ecran, stil ceas, după 45 s de inactivitate');
  await page.mouse.click(200, 400);
  await page.waitForTimeout(400);

  await page.getByText('Presă de picioare').nth(1).click().catch(() => {});
  await page.waitForTimeout(300);
  await shot('22-sesiune-forta', 'Sesiune live — exercițiu de forță: greutate, repetări, RPE');

  // ── restul aplicației ──
  await page.goto(BASE + '#/statistici');
  await page.getByText('kcal arse', { exact: false }).first().waitFor();
  await shot('23-statistici', 'Statistici — volume, calorii, grafice');

  await page.goto(BASE + '#/realizari');
  await page.waitForTimeout(400);
  await shot('24-realizari', 'Colecția de insigne');

  await page.goto(BASE + '#/ghid');
  await page.waitForTimeout(400);
  await shot('25-ghid', 'Ghidul Noobului — lecțiile esențiale');

  await page.goto(BASE + '#/greutate');
  await page.waitForTimeout(400);
  await shot('26-greutate', 'Greutate și obiectiv — cântăriri, țintă, import Freefit');

  await page.goto(BASE + '#/mai-mult');
  await page.waitForTimeout(300);
  await shot('27-mai-mult', 'Meniul „Mai mult", cu intrarea spre programe');

  // ── tema de noapte ──
  await page.goto(BASE + '#/setari');
  await page.getByRole('button', { name: /Noapte/ }).click();
  await page.waitForTimeout(400);
  await shot('28-setari-noapte', 'Setări, pe tema de noapte');
  await page.goto(BASE + '#/');
  await page.waitForTimeout(400);
  await shot('29-acasa-noapte', 'Ecranul „Azi" pe tema de noapte');
  await page.goto(BASE + '#/programe');
  await page.waitForTimeout(400);
  await shot('30-programe-noapte', 'Programele pe tema de noapte');
  await page.goto(BASE + '#/biblioteca');
  await page.waitForTimeout(400);
  await shot('31-biblioteca-noapte', 'Biblioteca pe tema de noapte');

  // ── index pentru urmărirea evoluției ──
  let commit = 'necunoscut';
  try {
    commit = execSync('git log -1 --format="%h %s"', { encoding: 'utf8' }).trim();
  } catch {
    /* fără git, nu-i nimic */
  }
  const kb = (n) => `${Math.round(statSync(`${OUT}/${n}.png`).size / 1024)} KB`;
  writeFileSync(
    `${OUT}/README.md`,
    [
      `# Capturi UI — ${OUT.split('/').pop()}`,
      '',
      `- **Data:** ${new Date().toISOString().slice(0, 10)}`,
      `- **Commit:** \`${commit}\``,
      `- **Viewport:** 400×860, densitate 2× (telefon)`,
      `- **Ecrane:** ${ecrane.length}`,
      '',
      '| # | Fișier | Ce arată | Mărime |',
      '|---|---|---|---|',
      ...ecrane.map(
        (e, i) =>
          `| ${i + 1} | [\`${e.nume}.png\`](${e.nume}.png)${e.tot ? ' *(pagină întreagă)*' : ''} | ${e.descriere} | ${kb(e.nume)} |`,
      ),
      '',
      '> Regenerezi cu `npm run capturi` — se creează automat următorul folder versionat.',
      '',
    ].join('\n'),
  );
  console.log(`\n✅ ${ecrane.length} capturi salvate în ${OUT}`);
} catch (e) {
  console.error('\n❌ capturile au eșuat:', e.message);
  await page.screenshot({ path: `${OUT}/EROARE.png` }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
  kill();
}

// index general peste toate versiunile
if (existsSync(RADACINA)) {
  const versiuni = readdirSync(RADACINA)
    .filter((d) => /^v\d+_/.test(d))
    .sort()
    .reverse();
  writeFileSync(
    `${RADACINA}/README.md`,
    [
      '# Evoluția interfeței Gym Noob',
      '',
      'Câte un folder pe rulare, în ordine cronologică — ca să se vadă cum s-a schimbat aplicația.',
      '',
      ...versiuni.map((v) => {
        const n = readdirSync(`${RADACINA}/${v}`).filter((f) => f.endsWith('.png')).length;
        return `- [\`${v}\`](${v}/README.md) — ${n} ecrane`;
      }),
      '',
      'Generat cu `npm run capturi`.',
      '',
    ].join('\n'),
  );
}
