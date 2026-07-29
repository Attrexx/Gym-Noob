/**
 * Generează PNG-urile pentru manifest din icon.svg, folosind Chromium
 * (headless) — fără dependențe native de rasterizare.
 *   node scripts/gen-icons.mjs
 */
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const exe = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const svg = readFileSync(resolve('public/icons/icon.svg'), 'utf8');

const targets = [
  { file: 'public/icons/icon-192.png', size: 192, pad: 0 },
  { file: 'public/icons/icon-512.png', size: 512, pad: 0 },
  { file: 'public/icons/apple-touch-icon.png', size: 180, pad: 0 },
  // maskable: conținutul în „safe zone" de 80%, fundal plin
  { file: 'public/icons/maskable-512.png', size: 512, pad: 64 },
];

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage();
for (const t of targets) {
  const inner = t.size - t.pad * 2;
  await page.setViewportSize({ width: t.size, height: t.size });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#F5C518;width:${t.size}px;height:${t.size}px;display:flex;align-items:center;justify-content:center">
    <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div>
  </body></html>`);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: t.size, height: t.size } });
  writeFileSync(resolve(t.file), buf);
  console.log('scris', t.file);
}
await browser.close();
