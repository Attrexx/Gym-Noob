/**
 * Pregătește ilustrațiile lui Flexu pentru aplicație.
 *
 * Sursa (`Images/Vectorized/`) vine din vectorizarea automată a desenelor: fișierele
 * n-au `viewBox`, au un fundal opac lipit sub mascotă și zeci de nuanțe apropiate
 * rezultate din trasare. Scriptul le curăță o singură dată, la import:
 *
 *   1. adaugă `viewBox` (fără el nu se scalează în CSS);
 *   2. scoate fundalul (dreptunghi + placa cu mascota decupată) → fundal transparent,
 *      ca ilustrația să stea pe galbenul paginii sau pe un panou alb;
 *   3. „egalizează" culorile: nuanțele foarte apropiate de negrul, galbenul, roșul și
 *      cremul de brand sunt fixate pe codurile exacte din paleta aplicației. Umbrele
 *      pielii și stropul galben rămân neatinse — altfel desenul devine plat;
 *   4. scoate ambalajele `<g>` inutile (câte unul per traseu).
 *
 * ATENȚIE: `Images/` e în `.gitignore`, deci sursa NU vine odată cu clona. Rezultatul
 * (`src/assets/mascota/`) e comis, așa că aplicația merge oricum; scriptul se poate
 * rula doar pe mașina care are desenele originale.
 *
 * Rulare (după ce se schimbă desenele):  npm run mascota
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), '..');
const SURSA = join(RADACINA, 'Images', 'Vectorized');
const DESTINATIE = join(RADACINA, 'src', 'assets', 'mascota');

/** Paleta de brand — aceleași coduri ca în `src/design/global.css`. */
const PALETA = {
  negru: '#171310',
  galben: '#f5c518',
  rosu: '#d0342c',
  crem: '#fff8e0',
};

const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];

/**
 * Decide pe ce culoare de brand se fixează o nuanță — sau `null` dacă se lasă în pace.
 * Pragurile sunt strânse intenționat: prind fiindurile plate (contur, maiou, bandană,
 * hârtie) și ratează dinadins tonurile de piele și stropul galben pal din spate.
 */
function fixeaza(culoare) {
  const [r, g, b] = hex(culoare);
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  // contur / păr / pantaloni — aproape negru. Pragul lasă afară grizul ganterei (#282722).
  if (max <= 0x20) return PALETA.negru;
  // galbenul plin al maioului și al fundalului de iconiță (albastru foarte mic)
  if (r >= 0xf0 && g >= 0xc0 && g <= 0xda && b <= 0x55) return PALETA.galben;
  // roșul bandanei / brățărilor / adidașilor
  if (r >= 0xb0 && r <= 0xe6 && g <= 0x50 && b <= 0x50 && r - g >= 0x60) return PALETA.rosu;
  // hârtia caldă: fundalul stickerului, interiorul bulei. Albul neutru al ochilor
  // (r ≈ g ≈ b) rămâne alb — de aceea se cere r − b ≥ 6.
  if (r >= 0xf0 && min >= 0xd5 && r - b >= 6) return PALETA.crem;
  return null;
}

function curata(svg, nume) {
  const dim = svg.match(/width="(\d+)px"\s+height="(\d+)px"/);
  if (!dim) throw new Error(`${nume}: nu găsesc dimensiunile`);
  const [, L, I] = dim;

  let out = svg;

  // 1. fără antet XML / DOCTYPE — nu ajută la nimic într-un `<img>`
  out = out.replace(/<\?xml[^>]*\?>\s*/, '').replace(/<!DOCTYPE[^>]*>\s*/, '');

  // 2. fundalul: dreptunghiul care acoperă toată pânza…
  out = out.replace(
    new RegExp(`<rect x="0" y="0" width="${L}" height="${I}"[^>]*/>\\s*`),
    '',
  );
  // …și placa cu mascota decupată (primul traseu, pornit din colțul 0,0)
  out = out.replace(/<g>\s*<path[^>]*\sd="M 0,0[^"]*"[^>]*\/>\s*<\/g>\s*/, '');

  // 3. egalizarea culorilor
  const schimbari = new Map();
  out = out.replace(/(fill|stroke)="(#[0-9a-fA-F]{6})"/g, (intreg, atribut, culoare) => {
    const tinta = fixeaza(culoare.toLowerCase());
    if (!tinta) return intreg;
    schimbari.set(culoare.toLowerCase(), tinta);
    return `${atribut}="${tinta}"`;
  });

  // 4. `<g><path/></g>` → `<path/>`
  out = out.replace(/<g>\s*(<path[^>]*\/>)\s*<\/g>/g, '$1');

  // 5. viewBox, ca ilustrația să se scaleze din CSS
  out = out.replace(
    /<svg([^>]*?)width="\d+px"\s+height="\d+px"/,
    `<svg$1width="${L}" height="${I}" viewBox="0 0 ${L} ${I}"`,
  );

  return { out, schimbari, L, I };
}

mkdirSync(DESTINATIE, { recursive: true });
const fisiere = readdirSync(SURSA).filter((f) => f.endsWith('.svg'));
let inainte = 0;
let dupa = 0;

for (const f of fisiere) {
  const brut = readFileSync(join(SURSA, f), 'utf8');
  const { out, schimbari, L, I } = curata(brut, f);
  writeFileSync(join(DESTINATIE, f), out);
  inainte += brut.length;
  dupa += out.length;
  const culori = new Set(out.match(/fill="#[0-9a-f]{6}"/g) ?? []).size;
  console.log(
    `${f.padEnd(26)} ${String(L).padStart(3)}×${String(I).padEnd(3)}  ` +
      `${(brut.length / 1024).toFixed(0)}K → ${(out.length / 1024).toFixed(0)}K  ` +
      `${culori} culori  (${schimbari.size} fixate pe paletă)`,
  );
}
console.log(`\nTotal: ${(inainte / 1024).toFixed(0)}K → ${(dupa / 1024).toFixed(0)}K`);

/* Stickerul mai primește o copie în `public/`, cu nume fix: ecranul de pornire din
   `index.html` îl arată înainte să existe React, deci nu poate folosi un import cu
   hash. Tot de acolo îl ia și componenta `Sigla`, ca să nu ajungă două copii în dist. */
copyFileSync(join(DESTINATIE, 'Sticker-Full.svg'), join(RADACINA, 'public', 'sticker.svg'));
console.log('Sticker-Full.svg → public/sticker.svg (ecranul de pornire)');
