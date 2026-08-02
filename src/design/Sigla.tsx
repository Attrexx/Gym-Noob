/**
 * Sigla „Gym Noob" — stickerul desenat, cu Flexu lipit de marginea din stânga.
 *
 * Se ia din `public/sticker.svg`, nu printr-un import cu hash, fiindcă exact același
 * fișier e arătat și de ecranul de pornire din `index.html`, înainte să pornească
 * React. Așa există o singură copie în `dist/` și o singură intrare în cache.
 * Fișierul e pus acolo de `scripts/mascota.mjs`.
 */
import { useT } from '@/i18n';

const SRC = `${import.meta.env.BASE_URL}sticker.svg`;

export function Sigla(props: { latime?: number; className?: string }) {
  const { t } = useT();
  return (
    <img
      src={SRC}
      alt={t('sigla.alt')}
      draggable={false}
      className={props.className}
      style={{ width: props.latime ?? 300, maxWidth: '100%', height: 'auto', display: 'block' }}
    />
  );
}
