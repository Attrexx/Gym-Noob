/**
 * Generează iconițele PWA din `src/assets/mascota/Icon-Mascot-Large.svg`.
 *
 * Sursa e desenul vectorial, nu PNG-ul din `Images/`: PNG-ul e doar 260×260, iar
 * iconița mare cerută de manifest e de 512 — mărit, s-ar vedea moale. Rasterizarea
 * se face cu Chromium (playwright-core e deja în devDependencies), ca să nu adăugăm
 * o dependență nativă gen sharp doar pentru cinci fișiere.
 *
 * `maskable-512` e desenată altfel: Android decupează iconițele „maskable" până la un
 * cerc, așa că insigna stă micșorată la 76% pe un câmp galben plin — colțurile pot fi
 * tăiate fără să piardă nimic din mascotă.
 *
 * Rulare:  CHROMIUM_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" node scripts/iconite.mjs
 */
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), '..');
const SURSA = join(RADACINA, 'src', 'assets', 'mascota', 'Icon-Mascot-Large.svg');
const ICONITE = join(RADACINA, 'public', 'icons');

const GALBEN = '#f5c518'; // aceeași valoare ca `--galben` din global.css și ca `theme_color`

const desen = readFileSync(SURSA, 'utf8');
const b64 = Buffer.from(desen).toString('base64');
const url = `data:image/svg+xml;base64,${b64}`;

/** fișier, latură, cât din pânză ocupă insigna, fundal (null = transparent) */
const DE_FACUT = [
  ['icon-192.png', 192, 1, null],
  ['icon-512.png', 512, 1, null],
  // iOS pune singur colțurile rotunjite peste iconiță și nu se împacă bine cu
  // transparența — de aceea fundal galben plin, insigna lipită de margini
  ['apple-touch-icon.png', 180, 1, GALBEN],
  // zona sigură a iconițelor „maskable": tot ce contează trebuie să încapă în
  // cercul central de 80% din latură
  ['maskable-512.png', 512, 0.76, GALBEN],
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

for (const [nume, latura, scara, fundal] of DE_FACUT) {
  const page = await browser.newPage({ viewport: { width: latura, height: latura }, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><head><style>
       html,body { margin:0; padding:0; }
       #p { width:${latura}px; height:${latura}px; display:flex; align-items:center; justify-content:center;
            ${fundal ? `background:${fundal};` : ''} }
       img { width:${Math.round(latura * scara)}px; height:${Math.round(latura * scara)}px; display:block }
     </style></head><body><div id="p"><img src="${url}"></div></body></html>`,
  );
  await page.waitForTimeout(300);
  await page.locator('#p').screenshot({ path: join(ICONITE, nume), omitBackground: !fundal });
  await page.close();
  console.log(`✓ ${nume.padEnd(22)} ${latura}×${latura}${fundal ? '' : ' (transparent)'}`);
}

await browser.close();

// iconița vectorială din manifest e chiar desenul curățat
copyFileSync(SURSA, join(ICONITE, 'icon.svg'));
console.log('✓ icon.svg               (copiat din Icon-Mascot-Large.svg)');

// mărimile finale, ca să se vadă dacă vreuna a ieșit suspect de mică
for (const [nume] of DE_FACUT) {
  const b = readFileSync(join(ICONITE, nume));
  console.log(`   ${nume.padEnd(22)} ${(b.length / 1024).toFixed(1)}K`);
}
writeFileSync(join(ICONITE, '.generat-de'), 'scripts/iconite.mjs — nu edita manual\n');
