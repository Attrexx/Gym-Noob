/**
 * Flexu — mascota aplicației, desenată de mână și vectorizată.
 *
 * Desenele stau în `src/assets/mascota/` (pregătite de `scripts/mascota.mjs`) și se
 * încarcă prin URL, nu inline: sunt de zeci de kilobytes fiecare și n-au ce căuta în
 * bundle-ul de JS. Fundalul lor e transparent, așa că aceeași ilustrație stă la fel de
 * bine pe galbenul paginii ca pe un panou crem.
 *
 * Sunt șase ilustrații pentru opt „poze". Numele pozelor sunt cele de dinainte, ca să
 * nu se schimbe cele ~30 de locuri care le folosesc; tabelul de mai jos e singurul loc
 * unde se decide ce desen primește fiecare.
 */
import { useLayoutEffect, useRef } from 'react';
import atentie from '@/assets/mascota/Gesture-Attention.svg';
import ridica from '@/assets/mascota/Gesture-Exercise.svg';
import aproba from '@/assets/mascota/Gesture-Like.svg';
import arata from '@/assets/mascota/Gesture-Point.svg';
import saluta from '@/assets/mascota/Gesture-Wave.svg';
import castiga from '@/assets/mascota/Gesture-Win.svg';
import desenBula from '@/assets/mascota/Mascot-QuoteBubble.svg';

export type FlexuPose =
  | 'salut'
  | 'explica'
  | 'sarbatoreste'
  | 'avertizeaza'
  | 'obosit'
  | 'hidratare'
  | 'flex'
  | 'ganditor';

const DESENE: Record<FlexuPose, { src: string; descriere: string }> = {
  salut: { src: saluta, descriere: 'Flexu face cu mâna' },
  explica: { src: arata, descriere: 'Flexu arată cu degetul' },
  // „gânditor" împrumută desenul de la „explică" — tot o idee pusă pe masă e
  ganditor: { src: arata, descriere: 'Flexu se gândește' },
  sarbatoreste: { src: castiga, descriere: 'Flexu ridică pumnul de bucurie' },
  avertizeaza: { src: atentie, descriere: 'Flexu e alarmat' },
  flex: { src: ridica, descriere: 'Flexu ridică o gantere' },
  // „obosit" tot cu gantera — efortul se vede, nu lâncezeala
  obosit: { src: ridica, descriere: 'Flexu trage din greu' },
  hidratare: { src: aproba, descriere: 'Flexu arată degetul mare' },
};

export function Flexu(props: { poza?: FlexuPose; marime?: number; decorativ?: boolean }) {
  const poza = props.poza ?? 'salut';
  const inaltime = props.marime ?? 110;
  const { src, descriere } = DESENE[poza];

  return (
    <img
      src={src}
      alt={props.decorativ ? '' : descriere}
      height={inaltime}
      draggable={false}
      decoding="async"
      style={{ height: inaltime, width: 'auto', flexShrink: 0, display: 'block' }}
    />
  );
}

/**
 * Flexu cu o bulă de dialog lângă el, pentru sfaturi și explicații în pagină.
 * Bula e desenată în CSS, nu în SVG: textul e românesc, de lungime imprevizibilă,
 * și trebuie să curgă pe orice lățime de ecran. Forma copiază bula din desen —
 * crem, contur gros, colțuri rotunjite, coadă spre mascotă.
 */
export function FlexuSpune(props: { poza?: FlexuPose; children: React.ReactNode; marime?: number }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '10px 0 14px' }}>
      <Flexu poza={props.poza} marime={props.marime ?? 84} />
      <div
        style={{
          border: 'var(--grosime) solid var(--contur)',
          background: 'var(--panou)',
          color: 'var(--panou-fg)',
          borderRadius: 18,
          boxShadow: 'var(--umbra-mica)',
          padding: '10px 13px',
          fontSize: '0.95rem',
          position: 'relative',
          flex: 1,
        }}
      >
        {/* Coada bulei: două triunghiuri suprapuse — cel negru ține conturul,
            cel crem îl umple, ca la bula desenată. */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: -14,
            top: 18,
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '14px solid var(--contur)',
          }}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: -9,
            top: 21,
            width: 0,
            height: 0,
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
            borderRight: '10px solid var(--panou)',
          }}
        />
        {props.children}
      </div>
    </div>
  );
}

/* Unde stă textul în interiorul bulei desenate, ca procent din pânza de 445×298.
   Măsurat direct din desen, scanând umplutura crem a bulei, apoi strâns puțin pe
   margini ca literele să nu atingă conturul gros. */
const CUTIE_BULA = { stanga: '60.5%', sus: '7%', latime: '35.5%', inaltime: '38%' };

/**
 * Flexu întreg, cu bula lui desenată, în care se poate pune orice text.
 *
 * Bula din desen e mică față de pânză, iar româna nu e o limbă scurtă — așa că
 * textul se micșorează singur până încape. E gândită pentru replici scurte, de
 * genul celei de pe planșa de identitate: „Nu trebuie să fii perfect. Trebuie
 * doar să începi!". Pentru explicații lungi există `FlexuSpune`.
 */
export function FlexuBula(props: { text: string; latime?: number; className?: string }) {
  const latime = props.latime ?? 340;
  const cutieRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const cutie = cutieRef.current;
    const text = textRef.current;
    if (!cutie || !text) return;

    // caută cel mai mare corp de literă la care replica încă încape în bulă
    const potriveste = () => {
      let jos = 7;
      let sus = 34;
      let bun = jos;
      while (sus - jos > 0.25) {
        const mij = (jos + sus) / 2;
        text.style.fontSize = `${mij}px`;
        if (text.scrollHeight <= cutie.clientHeight && text.scrollWidth <= cutie.clientWidth) {
          bun = mij;
          jos = mij;
        } else {
          sus = mij;
        }
      }
      text.style.fontSize = `${bun}px`;
    };

    potriveste();
    const observator = new ResizeObserver(potriveste);
    observator.observe(cutie);
    return () => observator.disconnect();
  }, [props.text, latime]);

  return (
    <div className={props.className} style={{ position: 'relative', width: latime, maxWidth: '100%' }}>
      <img
        src={desenBula}
        alt=""
        draggable={false}
        decoding="async"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      <div
        ref={cutieRef}
        style={{
          position: 'absolute',
          left: CUTIE_BULA.stanga,
          top: CUTIE_BULA.sus,
          width: CUTIE_BULA.latime,
          height: CUTIE_BULA.inaltime,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <span
          ref={textRef}
          style={{
            fontFamily: 'var(--font-afis)',
            textTransform: 'uppercase',
            // În Rammetto One accentul lui Î/Ă urcă la 1,17em peste linia de bază, iar
            // virgula lui Ț coboară 0,5em — mai mult decât ține un rând de 1,3em. Aerul
            // de sus și de jos intră în măsurătoarea de potrivire, deci textul se
            // micșorează cât trebuie și nu-l retează marginea bulei.
            lineHeight: 1.3,
            padding: '0.25em 0',
            textAlign: 'center',
            color: 'var(--negru)',
            maxWidth: '100%',
            // bula e desenată crem și rămâne crem și noaptea — textul stă pe ea, nu pe pagină
            hyphens: 'auto',
          }}
        >
          {props.text}
        </span>
      </div>
    </div>
  );
}
