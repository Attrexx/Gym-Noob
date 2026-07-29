/** Capturi de ecran pentru documentare: node scripts/screenshots.mjs <dirIesire> */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] ?? 'shots';
mkdirSync(OUT, { recursive: true });
const exe = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const PORT = 4174;
const BASE = `http://localhost:${PORT}/Gym-Noob/`;

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
const kill = () => { try { server.kill(); } catch { /* */ } };
process.on('exit', kill);
await new Promise((res, rej) => {
  const t0 = Date.now();
  const tick = async () => {
    try { if ((await fetch(BASE)).ok) return res(null); } catch { /* */ }
    if (Date.now() - t0 > 20000) return rej(new Error('preview nu a pornit'));
    setTimeout(tick, 300);
  };
  void tick();
});

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 400, height: 860 } });
const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });

await page.goto(BASE);
await page.getByText('Să începem').waitFor();
await shot('01-coperta');

// onboarding rapid
await page.getByRole('button', { name: /Să începem/ }).click();
await page.locator('#ob-nume').fill('Attrexx');
await page.getByRole('button', { name: 'Mai departe' }).click();
await page.locator('#ob-greutate').fill('102');
await shot('02-onboarding-corp');
await page.getByRole('button', { name: 'Mai departe' }).click();
await page.locator('#ob-tinta').fill('88');
await page.getByRole('button', { name: 'Mai departe' }).click();
await shot('03-onboarding-plan');
await page.getByRole('button', { name: /Creează profilul/ }).click();
await page.getByText('Salut, Attrexx!').waitFor();
await shot('04-acasa');

await page.goto(BASE + '#/biblioteca');
await page.getByText('Presă de picioare').first().waitFor();
await shot('05-biblioteca');
await page.goto(BASE + '#/biblioteca/genuflexiuni-corp');
await page.getByText('Execuția corectă').waitFor();
await shot('06-exercitiu');

await page.goto(BASE + '#/sala');
await page.getByText('Full Body A').first().click();
await page.getByRole('button', { name: /START/ }).click();
await page.getByRole('button', { name: /Pauză/ }).waitFor();
await page.getByText('Presă de picioare').nth(1).click().catch(() => {});
await shot('07-sesiune');

await page.goto(BASE + '#/antrenamente');
await page.getByText('Full Body A').first().waitFor();
await shot('08-antrenamente');

// temă de noapte
await page.goto(BASE + '#/setari');
await page.getByRole('button', { name: /Noapte/ }).click();
await page.waitForTimeout(300);
await shot('09-setari-noapte');
await page.goto(BASE + '#/');
await page.waitForTimeout(300);
await shot('10-acasa-noapte');

await browser.close();
kill();
console.log('capturi salvate în', OUT);
