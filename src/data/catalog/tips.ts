/** Sfaturile zilei ale lui Flexu + mesaje de încurajare. */

export const SFATURI: string[] = [
  'Cea mai grea greutate din sală e ușa de la intrare. Ai ridicat-o deja azi?',
  'Nu te compara cu tipul de lângă tine. Compară-te cu tine cel de acum o lună — pentru asta ai jurnalul.',
  'Formă întâi, greutate după. Un set curat cu 10 kg bate trei seturi urâte cu 20.',
  'Mușchii nu știu ce zi e. Dar obiceiurile da — antrenează-te în aceleași zile în fiecare săptămână.',
  'Apa e cel mai subestimat supliment. Și singurul gratuit.',
  'O repetare în plus față de data trecută = progres. Atât de simplu e.',
  'Pauzele dintre seturi nu sunt timp pierdut — acolo se reîncarcă mușchiul. Respectă-le.',
  'Febra musculară nu e o medalie. Progresul din jurnal e medalia.',
  'Ziua în care n-ai chef e ziua care contează dublu. Fă măcar jumătate de antrenament.',
  'Cântarul e un bârfitor cu memorie scurtă. Media pe 7 zile e prietenul serios.',
  'Somnul e a doua sesiune de antrenament. Cine doarme 8 ore crește și în somn.',
  'Nu există „prea încet". Există doar înainte și oprit.',
  'Setul de încălzire e biletul de intrare al articulațiilor. Nu intra fără bilet.',
  'Proteina la fiecare masă principală — mușchiul se construiește din cărămizi, nu din promisiuni.',
  'Lasă telefonul între seturi. Pauza de 90 de secunde devine 5 minute fără să simți.',
  'Veteranii din sală au fost toți, fără excepție, noobi. Unii chiar mai stângaci decât tine.',
  'Scrie-ți seturile imediat după ce le faci. Memoria minte, jurnalul nu.',
  'Un antrenament mediocru făcut bate un antrenament perfect planificat și amânat.',
];

export function sfatulZilei(d = new Date()): string {
  const start = new Date(d.getFullYear(), 0, 0);
  const zi = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return SFATURI[zi % SFATURI.length];
}

export const INCURAJARI_SET: string[] = [
  'Set înregistrat. Așa se construiește!',
  'Încă unul la colecție. Bravo!',
  'Bifat! Mușchii au primit mesajul.',
  'Solid! Pauză și mergem mai departe.',
  'Asta da execuție. Următorul!',
];

export const INCURAJARI_FINAL: string[] = [
  'Sesiune încheiată! Corpul tău îți mulțumește (mâine poate cu febră musculară, dar tot mulțumire e).',
  'Gata! Ai făcut ce 90% dintre oameni doar plănuiesc.',
  'Antrenament în sac! Acum mâncare bună și somn — acolo se termină treaba începută azi.',
];

export function aleator<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
