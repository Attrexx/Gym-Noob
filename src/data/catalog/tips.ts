import { pachetCatalog } from './text/activ';

/** Sfaturile zilei ale lui Flexu + mesaje de încurajare — toate din pachetul limbii. */

export function sfaturi(): string[] {
  return pachetCatalog().sfaturi;
}

export function sfatulZilei(d = new Date()): string {
  const lista = sfaturi();
  const start = new Date(d.getFullYear(), 0, 0);
  const zi = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return lista[zi % lista.length];
}

export function incurajariSet(): string[] {
  return pachetCatalog().incurajariSet;
}

export function incurajariFinal(): string[] {
  return pachetCatalog().incurajariFinal;
}

export function aleator<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
