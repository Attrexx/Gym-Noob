import { cloneElement, type ReactElement, type ReactNode } from 'react';
import type { CheieMesaj, Params } from './types';
import { t } from './runtime';

/**
 * Text cu bucăți marcate — înlocuitorul lui `<Trans>`, fără dependențe.
 *
 * În mesaj, `<0>…</0>` marchează slotul 0. Implicit slotul 0 e `<b>`, deci
 * cazul obișnuit („o propoziție cu ceva îngroșat la mijloc") se scrie:
 *
 *   'programe.intro': 'Cel mai bun program e cel pe care <0>chiar îl faci</0>, …'
 *   <T k="programe.intro" />
 *
 * Pentru altceva decât bold, dai elementele:
 *
 *   <T k="cont.legat" p={{ email }} c={[<a href="…" />]} />
 *
 * Marcajele sunt verificate între limbi de `tests/i18n/paritate.test.ts`, ca să
 * nu poată exista un slot care rămâne gol într-o traducere.
 */
export function T(props: { k: CheieMesaj; p?: Params; c?: ReactElement[] }) {
  const text = t(props.k, props.p);
  const componente = props.c ?? [<b key="b" />];

  // split cu două grupe de captură → [text, index, conținut, text, index, conținut, …, text]
  const bucati = text.split(/<(\d+)>([\s\S]*?)<\/\1>/);
  if (bucati.length === 1) return <>{text}</>;

  const out: ReactNode[] = [];
  for (let i = 0; i < bucati.length; i++) {
    const rest = i % 3;
    if (rest === 0) {
      if (bucati[i]) out.push(bucati[i]);
    } else if (rest === 2) {
      const idx = Number(bucati[i - 1]);
      const el = componente[idx] ?? <span />;
      out.push(cloneElement(el, { key: i }, bucati[i]));
    }
    // rest === 1 e indexul slotului, consumat mai sus
  }
  return <>{out}</>;
}
