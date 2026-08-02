import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Plasa de siguranță a etapei 6: în componente nu mai are ce căuta text românesc.
 *
 * Vitest rulează cu `environment: 'node'`, fără jsdom, deci cele ~640 de texte de
 * interfață n-au nicio acoperire prin randare. Testul ăsta ține locul: citește
 * fișierele cu `node:fs` și se plânge de orice literal de text sau text JSX care
 * conține o diacritică românească.
 *
 * Ce NU prinde, în mod asumat: textele românești fără diacritice („Serie", „Total").
 * Pe acelea le prinde `paritate.test.ts` abia când apare a doua limbă — un text uitat
 * în cod nu are cheie, deci nu are traducere.
 *
 * `RAMASE` e datoria rămasă, nu o scutire permanentă: testul se plânge și dacă un
 * fișier din listă a fost curățat între timp, ca lista să nu poată rămâne umflată.
 * Când lista e goală, etapa 6 e gata — atunci se șterge complet.
 */

const DIACRITICE = /[ăâîșțĂÂÎȘȚ]/;
const RADACINI = ['src/features', 'src/app', 'src/design'];

/** Fișiere care încă nu au fost trecute prin i18n. Trebuie să ajungă listă goală. */
const RAMASE: string[] = [
  'src/design/Flexu.tsx',
  'src/design/Sigla.tsx',
  'src/features/achievements/AchievementsPage.tsx',
  'src/features/analytics/AnalyticsPage.tsx',
  'src/features/builder/AlegeExercitiu.tsx',
  'src/features/builder/TemplateEditorPage.tsx',
  'src/features/builder/TemplatesPage.tsx',
  'src/features/guide/ArticlePage.tsx',
  'src/features/guide/GuidePage.tsx',
  'src/features/home/HomePage.tsx',
  'src/features/library/ExerciseAnim.tsx',
  'src/features/library/ExercisePage.tsx',
  'src/features/library/LibraryPage.tsx',
  'src/features/library/MuscleDiagram.tsx',
  'src/features/onboarding/LoginCont.tsx',
  'src/features/onboarding/OnboardingPage.tsx',
  'src/features/onboarding/ProfilesPage.tsx',
  'src/features/programs/ProgramPage.tsx',
  'src/features/programs/ProgramsPage.tsx',
  'src/features/session/Screensaver.tsx',
  'src/features/session/SessionPage.tsx',
  'src/features/session/SumarHud.tsx',
  'src/features/session/UltimaData.tsx',
  'src/features/settings/AparateSection.tsx',
  'src/features/settings/ContSection.tsx',
  'src/features/settings/FreefitImport.tsx',
  'src/features/settings/SettingsPage.tsx',
  'src/features/weight/WeightPage.tsx',
];

/**
 * Texte care au voie să rămână în cod. Autonimele nu se traduc niciodată
 * (vezi `AUTONIM` în `src/i18n/types.ts`) — cine a comutat din greșeală trebuie
 * să-și recunoască limba în listă ca să se poată întoarce.
 */
const PERMISE = ['Română'];

function fisiere(dir: string): string[] {
  const out: string[] = [];
  for (const nume of readdirSync(dir)) {
    const p = join(dir, nume);
    if (statSync(p).isDirectory()) out.push(...fisiere(p));
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}

interface Bucata {
  text: string;
  linie: number;
}

/**
 * Împarte sursa în „literale de text" și „cod", sărind peste comentarii.
 *
 * Se scrie de mână, cu un automat pe caractere, pentru că un regex nu poate
 * distinge un `//` dintr-un `https://` de un comentariu — iar comentariile AU
 * voie să fie în română, deci un fals pozitiv acolo ar face testul de nefolosit.
 *
 * Întoarce și codul cu literalele albite (păstrând rândurile), ca textul JSX —
 * care nu e literal de text — să poată fi căutat separat.
 */
function imparte(src: string): { literale: Bucata[]; cod: string } {
  const literale: Bucata[] = [];
  let cod = '';
  let linie = 1;
  let i = 0;

  const albeste = (bucata: string) => {
    // păstrăm rândurile ca numerele de linie de mai jos să rămână corecte
    cod += bucata.replace(/[^\n]/g, ' ');
  };

  while (i < src.length) {
    const c = src[i];
    const doi = src.slice(i, i + 2);

    if (doi === '//') {
      const capat = src.indexOf('\n', i);
      const pana = capat === -1 ? src.length : capat;
      albeste(src.slice(i, pana));
      i = pana;
      continue;
    }
    if (doi === '/*') {
      const capat = src.indexOf('*/', i + 2);
      const pana = capat === -1 ? src.length : capat + 2;
      const bucata = src.slice(i, pana);
      linie += (bucata.match(/\n/g) ?? []).length;
      albeste(bucata);
      i = pana;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const start = i;
      const startLinie = linie;
      i++;
      let adancime = 0; // `${…}` din template
      while (i < src.length) {
        const d = src[i];
        if (d === '\\') {
          i += 2;
          continue;
        }
        if (d === '\n') linie++;
        if (c === '`' && src.slice(i, i + 2) === '${') adancime++;
        else if (c === '`' && d === '}' && adancime > 0) adancime--;
        else if (d === c && adancime === 0) break;
        i++;
      }
      i++;
      const bucata = src.slice(start, i);
      literale.push({ text: bucata, linie: startLinie });
      albeste(bucata);
      continue;
    }
    if (c === '\n') linie++;
    cod += c;
    i++;
  }
  return { literale, cod };
}

/** Textul JSX: ce stă între `>` și `<` fără acolade și fără alte semne de tag. */
function textJsx(cod: string): Bucata[] {
  const out: Bucata[] = [];
  for (const m of cod.matchAll(/>([^<>{}]*[A-Za-zăâîșțĂÂÎȘȚ][^<>{}]*)</g)) {
    const text = m[1].trim();
    if (!text) continue;
    const linie = (cod.slice(0, m.index).match(/\n/g) ?? []).length + 1;
    out.push({ text, linie });
  }
  return out;
}

function romanaDin(cale: string): string[] {
  const src = readFileSync(cale, 'utf8');
  const { literale, cod } = imparte(src);
  return [...literale, ...textJsx(cod)]
    .filter((b) => DIACRITICE.test(b.text) && !PERMISE.some((p) => b.text.includes(p)))
    .map((b) => `${cale.replace(/\\/g, '/')}:${b.linie}  ${b.text.replace(/\s+/g, ' ').slice(0, 80)}`);
}

const TOATE = RADACINI.flatMap(fisiere).map((f) => f.replace(/\\/g, '/'));

describe('nicio română în componente', () => {
  it.each(TOATE.filter((f) => !RAMASE.includes(f)))('%s nu are text românesc în cod', (cale) => {
    expect(romanaDin(cale)).toEqual([]);
  });

  it('lista de restanțe nu are intrări moarte', () => {
    const curate = RAMASE.filter((f) => romanaDin(f).length === 0);
    expect(curate, 'fișiere curățate — scoate-le din RAMASE').toEqual([]);
    const inexistente = RAMASE.filter((f) => !TOATE.includes(f));
    expect(inexistente, 'fișiere care nu mai există — scoate-le din RAMASE').toEqual([]);
  });

  it('automatul sare peste comentarii, dar nu peste texte', () => {
    const { literale, cod } = imparte(
      ['// comentariu cu ăîș', '/* și ăsta */', "const a = 'text cu ă';", 'const b = <p>țext</p>;'].join('\n'),
    );
    expect(literale.map((l) => l.text)).toEqual(["'text cu ă'"]);
    expect(textJsx(cod).map((t) => t.text)).toEqual(['țext']);
    // un `//` dintr-un URL nu e comentariu
    expect(imparte("const u = 'https://x.ro/ă';").literale).toHaveLength(1);
  });
});
