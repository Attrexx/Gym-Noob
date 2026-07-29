/**
 * Test de fum end-to-end: pornește build-ul din dist/ cu `vite preview`,
 * parcurge onboarding-ul, pornește o sesiune, înregistrează un set,
 * bea apă, încheie sesiunea și verifică statisticile.
 *   npm run build && npm run smoke
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';

const exe = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const PORT = 4173;
const BASE = `http://localhost:${PORT}/Gym-Noob/`;

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const kill = () => {
  try {
    server.kill();
  } catch {
    /* gata deja */
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

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 400, height: 850 } });
page.on('pageerror', (e) => {
  console.error('EROARE PE PAGINĂ:', e.message);
  process.exitCode = 1;
});

const pas = (nume) => console.log('✔', nume);

try {
  await page.goto(BASE);
  await page.getByText('GYM', { exact: false }).first().waitFor({ timeout: 10000 });
  pas('aplicația se încarcă (coperta)');

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

  // ── sesiune live ──
  await page.goto(BASE + '#/sala');
  await page.getByText('Prima zi la sală').first().click();
  await page.getByRole('button', { name: /START/ }).click();
  await page.getByRole('button', { name: /Pauză/ }).waitFor({ timeout: 10000 });
  pas('sesiunea a pornit');

  // primul exercițiu e cardio (pe timp) → sarim la unul cu repetări
  await page.getByText('Împins la piept la aparat').first().click();
  await page.getByRole('button', { name: /Am terminat setul/ }).click();
  await page.getByText('pauză între seturi', { exact: false }).waitFor({ timeout: 5000 });
  pas('set înregistrat + pauza a pornit');
  await page.getByRole('button', { name: 'Sar peste' }).click();

  await page.getByRole('button', { name: '+250 ml' }).click();
  await page.getByText('250 /', { exact: false }).waitFor();
  pas('apa se contorizează');

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
  await page.getByRole('button', { name: 'Acasă' }).click();

  // ── statistici ──
  await page.goto(BASE + '#/statistici');
  await page.getByText('sesiuni', { exact: false }).first().waitFor();
  await page.getByText('kcal arse', { exact: false }).first().waitFor();
  pas('statisticile se afișează');

  // ── ghid + realizări ──
  await page.goto(BASE + '#/realizari');
  await page.getByText('1 din', { exact: false }).waitFor();
  pas('pagina de realizări arată insigna deblocată');

  // ── manifest + service worker în build ──
  const manifest = await (await fetch(BASE + 'manifest.webmanifest')).json();
  if (manifest.name !== 'Gym Noob') throw new Error('manifest greșit');
  const sw = await fetch(BASE + 'sw.js');
  if (!sw.ok) throw new Error('sw.js lipsește');
  pas('manifest PWA + service worker prezente');

  console.log('\n🎉 SMOKE TEST TRECUT');
} catch (e) {
  console.error('\n❌ SMOKE TEST EȘUAT:', e.message);
  await page.screenshot({ path: 'smoke-failure.png' }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
  kill();
}
