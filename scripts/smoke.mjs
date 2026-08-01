/**
 * Test de fum end-to-end: pornește build-ul din dist/ cu `vite preview`,
 * parcurge onboarding-ul, pornește o sesiune, înregistrează un set,
 * bea apă, încheie sesiunea și verifică statisticile. La final pornește
 * API-ul de sincronizare LOCAL și verifică fluxul complet pe DOUĂ
 * „dispozitive" (două contexte de browser): creare cont → sincronizare →
 * login pe dispozitiv proaspăt → datele apar.
 *   npm run build && npm run smoke
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const exe = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const PORT = 4173;
const API_PORT = 8788;
const BASE = `http://localhost:${PORT}/Gym-Noob/`;
const API_URL = `http://localhost:${API_PORT}`;

// Pornim vite direct cu node, nu prin `npx`: pe Windows npx e un .cmd, iar
// kill() ar omorî shell-ul, lăsând serverul orfan și blocând scriptul la final.
const vite = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const server = spawn(process.execPath, [vite, 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'pipe',
});

// API-ul de sincronizare, pe o bază SQLite de unică folosință
const apiDir = mkdtempSync(join(tmpdir(), 'gym-noob-smoke-'));
const apiMain = fileURLToPath(new URL('../server/src/main.ts', import.meta.url));
const api = spawn(process.execPath, [apiMain], {
  stdio: 'pipe',
  env: {
    ...process.env,
    PORT: String(API_PORT),
    DB_PATH: join(apiDir, 'smoke.db'),
    JWT_SECRET: 'secret-de-fum-0123456789-0123456789',
    CORS_ORIGINS: `http://localhost:${PORT}`,
    LOG_LEVEL: 'silent',
  },
});
const kill = () => {
  try {
    server.kill();
  } catch {
    /* gata deja */
  }
  try {
    api.kill();
  } catch {
    /* gata deja */
  }
  try {
    rmSync(apiDir, { recursive: true, force: true });
  } catch {
    /* rămâne în temp */
  }
};
process.on('exit', kill);

// așteaptă serverul
await new Promise((res, rej) => {
  const t0 = Date.now();
  const tick = async () => {
    try {
      const r = await fetch(BASE);
      if (r.ok) return res(null);
    } catch {
      /* încă pornește */
    }
    if (Date.now() - t0 > 20000) return rej(new Error('vite preview nu a pornit'));
    setTimeout(tick, 300);
  };
  void tick();
});

// așteaptă și API-ul
await new Promise((res, rej) => {
  const t0 = Date.now();
  const tick = async () => {
    try {
      const r = await fetch(`${API_URL}/health`);
      if (r.ok) return res(null);
    } catch {
      /* încă pornește */
    }
    if (Date.now() - t0 > 20000) return rej(new Error('API-ul de sincronizare nu a pornit'));
    setTimeout(tick, 300);
  };
  void tick();
});

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 400, height: 850 } });
// build-ul de producție arată spre gym-api.lessgo.city — îl îndreptăm spre API-ul local
await page.addInitScript(`localStorage.setItem('gym-noob-api-url', '${API_URL}')`);
page.on('pageerror', (e) => {
  console.error('EROARE PE PAGINĂ:', e.message);
  process.exitCode = 1;
});

const pas = (nume) => console.log('✔', nume);

/**
 * Verifică faptul că toate imaginile de pe ecran chiar s-au încărcat. Desenele lui
 * Flexu vin din `dist/assets/` și din `public/`, cu `base` `/Gym-Noob/` — o cale
 * greșită n-ar strica nimic vizibil în teste, doar ar lăsa pagina fără mascotă.
 */
const imaginiIntregi = async (unde) => {
  const stricate = await page.evaluate(() =>
    [...document.images]
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.currentSrc || i.src),
  );
  if (stricate.length) throw new Error(`imagini neîncărcate (${unde}): ${stricate.join(', ')}`);
};

try {
  await page.goto(BASE);

  // ecranul de pornire e scris direct în index.html, ca să se vadă înainte de React,
  // și e scos din DOM de App.tsx după ce profilul e citit
  const htmlBrut = await (await fetch(BASE)).text();
  if (!htmlBrut.includes('id="pornire"')) throw new Error('index.html n-are ecranul de pornire');
  if (!htmlBrut.includes('sticker.svg')) throw new Error('ecranul de pornire n-are sigla');
  await page.locator('#pornire').waitFor({ state: 'detached', timeout: 15000 });
  pas('ecranul de pornire apare și se stinge');

  // coperta arată sigla desenată, nu textul „GYM NOOB" cules cu font
  const sigla = page.getByAltText(/Gym Noob/i).first();
  await sigla.waitFor({ timeout: 10000 });
  await imaginiIntregi('coperta');
  pas('aplicația se încarcă (coperta cu sigla și cu Flexu)');

  // ── onboarding ──
  await page.getByRole('button', { name: /Să începem/ }).click();
  await page.locator('#ob-nume').fill('Testel');
  await page.getByRole('button', { name: 'Mai departe' }).click();
  await page.locator('#ob-greutate').fill('100');
  await page.getByRole('button', { name: 'Mai departe' }).click();
  await page.locator('#ob-tinta').fill('90');
  await page.getByRole('button', { name: 'Mai departe' }).click();
  await page.getByRole('button', { name: /Creează profilul/ }).click();
  await page.getByText('Salut, Testel!').waitFor({ timeout: 10000 });
  pas('onboarding complet, profil creat');

  // bugetul zilei apare cu valori
  await page.getByText('Bugetul zilei').waitFor();
  pas('bugetul caloric al zilei e afișat');

  // ── biblioteca ──
  await page.goto(BASE + '#/biblioteca');
  await page.getByText('Presă de picioare', { exact: false }).first().waitFor();
  pas('biblioteca de exerciții se afișează');

  // filtrul de categorie: calistenice
  await page.getByRole('button', { name: /Calistenice/ }).click();
  await page.getByText('Doar greutatea corpului', { exact: false }).waitFor();
  await page.getByText('Tracțiuni cu priză supinată', { exact: false }).first().waitFor();
  if (await page.getByText('Presă de picioare', { exact: false }).first().isVisible()) {
    throw new Error('filtrul „calistenice" nu a exclus exercițiile la aparate');
  }
  pas('filtrul de categorie „calistenice" funcționează');

  // pagina unui exercițiu nou + variantele înrudite
  await page.getByText('Tracțiuni cu priză supinată', { exact: false }).first().click();
  await page.getByText('Variante înrudite', { exact: false }).waitFor();
  pas('pagina exercițiului arată variantele înrudite');

  // ── programe: un singur loc, două rafturi ──
  await page.goto(BASE + '#/programe');
  await page.getByText('Push / Pull / Legs', { exact: false }).first().waitFor();
  await page.getByText('Wendler 5/3/1', { exact: false }).first().waitFor();
  pas('tabul „Ale aplicației" arată programele celebre');

  await page.locator('#tab-mele').click();
  await page.getByRole('button', { name: /Plan nou/ }).waitFor();
  await page.locator('#tab-aplicatie').click();
  await page.getByText('Push / Pull / Legs', { exact: false }).first().waitFor();
  pas('comutarea între „Ale mele" și „Ale aplicației" funcționează');

  await page.getByText('Powerbuilding periodizat', { exact: false }).first().click();
  await page.getByText('Rutina 1 · Antrenamentul A', { exact: false }).first().waitFor();
  await page.getByText('AMRAP', { exact: false }).first().waitFor();
  pas('detaliul programului arată antrenamentele și notițele AMRAP');

  await page.getByRole('button', { name: /Adaugă cele 5 antrenamente/ }).click();
  await page.getByRole('button', { name: /Reîmprospătează cele 5 antrenamente/ }).waitFor({ timeout: 5000 });
  pas('programul a fost importat în antrenamente');

  await page.goto(BASE + '#/antrenamente');
  await page.getByText('Rutina 2 · Antrenamentul B', { exact: false }).first().waitFor();
  pas('antrenamentele importate apar în planuri');

  // ── sesiune live ──
  await page.goto(BASE + '#/sala');
  await page.getByText('Prima zi la sală').first().click();
  await page.getByRole('button', { name: /START/ }).click();
  await page.getByRole('button', { name: /Pauză/ }).waitFor({ timeout: 10000 });
  pas('sesiunea a pornit');

  // antetul live: timp, calorii, apă, activ — toate la vedere de la început
  await page.getByText('la sală de', { exact: false }).waitFor();
  await page.locator('[data-testid="hud-cifre"]').waitFor();
  pas('sumarul live e afișat permanent în antet');

  // primul exercițiu e cardio (pe timp) → sarim la unul cu repetări
  await page.getByText('Împins la piept la aparat').first().click();
  await page.getByRole('button', { name: /Am terminat setul/ }).click();
  await page.getByText('pauză între seturi', { exact: false }).waitFor({ timeout: 5000 });
  pas('set înregistrat + pauza a pornit');
  await page.getByRole('button', { name: 'Sar peste' }).click();

  await page.getByRole('button', { name: '+250 ml' }).click();
  await page.getByText('250 /', { exact: false }).waitFor();
  pas('apa se contorizează');

  // adăugarea unui exercițiu din mers îl face pe el activ
  await page.getByRole('button', { name: /\+ Adaugă exercițiu/ }).click();
  await page.locator('#alege-cauta').fill('Ramat la cablu');
  await page.getByText('Ramat la cablu din așezat', { exact: false }).first().click();
  await page.getByRole('button', { name: /Treci la el acum/ }).click();
  await page.getByRole('heading', { name: /Ramat la cablu din așezat/ }).waitFor({ timeout: 5000 });
  pas('exercițiul adăugat din mers devine cel activ');

  // și te poți întoarce la unul început mai devreme (superseturi)
  await page.getByText('Împins la piept la aparat').first().click();
  await page.getByRole('heading', { name: /Împins la piept/ }).waitFor({ timeout: 5000 });
  await page.getByRole('button', { name: /Am terminat setul/ }).click();
  pas('comutarea liberă înapoi la un exercițiu început funcționează');
  await page.getByRole('button', { name: 'Sar peste' }).click();

  // pauză/reluare
  await page.getByRole('button', { name: /Pauză/ }).click();
  await page.getByText('SESIUNE ÎN PAUZĂ', { exact: false }).waitFor();
  await page.getByRole('button', { name: /Reia/ }).click();
  pas('pauză și reluare funcționează');

  // stop + sumar + realizare
  await page.getByRole('button', { name: 'Oprește sesiunea' }).click();
  await page.getByRole('button', { name: /Da, închei/ }).click();
  await page.getByText('BRAVO!').waitFor({ timeout: 10000 });
  await page.getByText('Primul pas').waitFor();
  pas('sesiune încheiată, sumar + realizarea „Primul pas"');

  // timpul petrecut la sală, cu ora de intrare/ieșire și împărțirea activ/pauză
  await page.getByText('la sală', { exact: false }).first().waitFor();
  await page.getByText('timp activ', { exact: false }).first().waitFor();
  await page.getByText('cât ai lucrat', { exact: false }).waitFor();
  pas('rezumatul arată timpul la sală, activ vs pauză');

  // salvarea sesiunii ca plan
  await page.locator('#salveaza-plan').click();
  await page.locator('#nume-plan').fill('Sesiunea mea liberă');
  await page.getByRole('button', { name: /Salvează planul/ }).click();
  await page.getByText('Salvat ca plan', { exact: false }).waitFor({ timeout: 5000 });
  pas('sesiunea a fost salvată ca plan');
  await page.getByRole('button', { name: 'Acasă' }).click();

  await page.goto(BASE + '#/antrenamente');
  await page.getByText('Sesiunea mea liberă', { exact: false }).first().waitFor();
  pas('planul salvat apare la Programe → Ale mele');

  // ── mod liber, cu aparat Bluetooth simulat ──
  await page.evaluate(() => localStorage.setItem('gym-noob-aparat-fals', 'banda'));
  await page.goto(BASE + '#/sala');
  await page.locator('#mod-liber').click();
  await page.locator('#alege-cauta').fill('Alergare pe bandă');
  await page.getByText('Alergare pe bandă', { exact: false }).first().click();
  await page.getByRole('button', { name: /Începe cu ăsta/ }).click();
  await page.getByRole('button', { name: /Pauză/ }).waitFor({ timeout: 10000 });
  pas('modul liber pornește direct cu exercițiul ales');

  // aparatul simulat trimite telemetrie în antet
  await page.locator('[data-testid="hud-aparat"]').waitFor({ timeout: 10000 });
  await page.getByText('Star Trac 8TR', { exact: false }).first().waitFor({ timeout: 10000 });
  await page.getByText('km/h', { exact: false }).first().waitFor({ timeout: 10000 });
  pas('datele live de la aparat apar în antet');

  // înregistrăm un set de bandă ca să rămână modelul aparatului în jurnal
  await page.getByRole('button', { name: /Pornește/ }).click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: /Am terminat \(/ }).click();
  pas('setul de cardio s-a înregistrat cu datele aparatului');

  await page.getByRole('button', { name: 'Oprește sesiunea' }).click();
  await page.getByRole('button', { name: /Da, închei/ }).click();
  await page.getByText('BRAVO!').waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: 'Acasă' }).click();

  // „data trecută" își amintește aparatul și setările
  await page.goto(BASE + '#/sala');
  await page.locator('#mod-liber').click();
  await page.locator('#alege-cauta').fill('Alergare pe bandă');
  await page.getByText('Alergare pe bandă', { exact: false }).first().click();
  await page.getByRole('button', { name: /Începe cu ăsta/ }).click();
  await page.locator('[data-testid="ultima-data"]').waitFor({ timeout: 10000 });
  await page.getByText('Star Trac 8TR', { exact: false }).first().waitFor();
  pas('„data trecută" îmi amintește aparatul și cifrele de atunci');

  await page.getByRole('button', { name: 'Oprește sesiunea' }).click();
  await page.getByRole('button', { name: /Da, închei/ }).click();
  await page.getByText('BRAVO!').waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: 'Acasă' }).click();
  await page.evaluate(() => localStorage.removeItem('gym-noob-aparat-fals'));

  // ── statistici ──
  await page.goto(BASE + '#/statistici');
  await page.getByText('sesiuni', { exact: false }).first().waitFor();
  await page.getByText('kcal arse', { exact: false }).first().waitFor();
  await page.getByText('timp la sală', { exact: false }).first().waitFor();
  await page.getByText('Ultimele sesiuni', { exact: false }).waitFor();
  pas('statisticile arată timpul la sală și jurnalul sesiunilor');

  // ── ghid + realizări ──
  await page.goto(BASE + '#/realizari');
  // fără număr fix: câte insigne pică depinde de câte sesiuni face testul
  await page.getByText('deblocate', { exact: false }).first().waitFor();
  await page.getByText('Primul pas', { exact: false }).first().waitFor();
  pas('pagina de realizări arată insignele deblocate');

  // ── manifest + service worker în build ──
  const manifest = await (await fetch(BASE + 'manifest.webmanifest')).json();
  if (manifest.name !== 'Gym Noob') throw new Error('manifest greșit');
  const sw = await fetch(BASE + 'sw.js');
  if (!sw.ok) throw new Error('sw.js lipsește');
  pas('manifest PWA + service worker prezente');

  // ── cont + sincronizare: dispozitivul 1 creează contul ──
  await page.goto(BASE + '#/setari');
  await page.getByText('Cont și sincronizare').waitFor();
  await page.locator('#cont-email').fill('smoke@test.ro');
  await page.locator('#cont-parola').fill('parola-smoke-123');
  await page.getByRole('button', { name: 'Creează cont' }).click();
  await page.getByText('✅ Sincronizat').waitFor({ timeout: 15000 });
  pas('cont creat + profilul urcat în cloud (Sincronizat)');

  // ── „dispozitivul 2": context proaspăt, login, datele coboară ──
  const ctx2 = await browser.newContext({ viewport: { width: 400, height: 850 } });
  await ctx2.addInitScript(`localStorage.setItem('gym-noob-api-url', '${API_URL}')`);
  const page2 = await ctx2.newPage();
  page2.on('pageerror', (e) => {
    console.error('EROARE PE PAGINA 2:', e.message);
    process.exitCode = 1;
  });
  await page2.goto(BASE);
  await page2.getByRole('button', { name: 'Intră și adu-ți datele' }).click();
  await page2.locator('#lc-email').fill('smoke@test.ro');
  await page2.locator('#lc-parola').fill('parola-smoke-123');
  await page2.getByRole('button', { name: 'Intră în cont' }).click();
  await page2.getByText('Salut, Testel!').waitFor({ timeout: 20000 });
  pas('login pe al doilea dispozitiv → profilul a coborât din cloud');

  await page2.goto(BASE + '#/antrenamente');
  await page2.getByText('Rutina 2 · Antrenamentul B').first().waitFor({ timeout: 10000 });
  await page2.goto(BASE + '#/statistici');
  await page2.getByText('kcal arse', { exact: false }).first().waitFor({ timeout: 10000 });
  pas('antrenamentele importate și statisticile sesiunii au ajuns pe dispozitivul 2');
  await ctx2.close();

  console.log('\n🎉 SMOKE TEST TRECUT');
} catch (e) {
  console.error('\n❌ SMOKE TEST EȘUAT:', e.message);
  await page.screenshot({ path: 'smoke-failure.png' }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
  kill();
}
