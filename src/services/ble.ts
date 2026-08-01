/**
 * Bucătăria comună pentru Bluetooth: reconectare fără să te punem să apeși.
 *
 * Regula platformei, pe care nu o putem ocoli: `requestDevice()` (fereastra
 * de alegere a dispozitivului) cere obligatoriu un gest al utilizatorului.
 * Există și o cale fără gest — `getDevices()` + `watchAdvertisements()`,
 * pentru dispozitive pe care le-ai aprobat deja o dată — dar în Chrome e
 * încă în spatele flag-ului `chrome://flags/#enable-experimental-web-platform-features`.
 *
 * Deci facem trei lucruri, în ordinea asta:
 *  1. dacă browserul ne lasă, ne reconectăm în tăcere la dispozitivul știut;
 *  2. dacă nu, aplicația arată un buton mare, la un singur tap;
 *  3. odată conectați, o pierdere de semnal se repară singură — reconectarea
 *     pe un dispozitiv deja obținut NU mai cere gest, deci merge peste tot.
 */

export const bleDisponibil = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

/** Browserul ne lasă să ne reconectăm singuri, fără fereastră de alegere? */
export function bleSilentiosDisponibil(): boolean {
  return bleDisponibil && typeof navigator.bluetooth?.getDevices === 'function';
}

export const EROARE_FARA_BLE =
  'Browserul acesta nu are Web Bluetooth (pe iPhone nu există, din păcate).';

/**
 * Caută printre dispozitivele deja aprobate de utilizator unul care se
 * potrivește. Întoarce `null` dacă browserul nu suportă asta — nu e o eroare,
 * doar înseamnă „mergi pe calea cu un tap".
 */
export async function dispozitivCunoscut(
  potrivire: (d: BluetoothDevice) => boolean,
): Promise<BluetoothDevice | null> {
  if (!bleSilentiosDisponibil()) return null;
  try {
    const lista = await navigator.bluetooth.getDevices();
    return lista.find(potrivire) ?? null;
  } catch {
    return null;
  }
}

/**
 * Așteaptă ca dispozitivul să-și facă simțită prezența, apoi se conectează.
 * Fără asta, un `gatt.connect()` pe un ceas care nu e în aer stă agățat.
 */
export async function asteaptaSiConecteaza(
  device: BluetoothDevice,
  timeoutMs = 15_000,
): Promise<BluetoothRemoteGATTServer> {
  if (typeof device.watchAdvertisements !== 'function') return device.gatt!.connect();

  const ctrl = new AbortController();
  try {
    await device.watchAdvertisements({ signal: ctrl.signal });
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => {
        device.removeEventListener('advertisementreceived', laReclama);
        reject(new Error('Dispozitivul nu emite acum.'));
      }, timeoutMs);
      function laReclama() {
        clearTimeout(t);
        device.removeEventListener('advertisementreceived', laReclama);
        resolve();
      }
      device.addEventListener('advertisementreceived', laReclama);
    });
  } finally {
    ctrl.abort();
  }
  return device.gatt!.connect();
}

/**
 * Repară singură o legătură căzută. Se pune DUPĂ ce avem deja obiectul
 * `device`, deci nu mai are nevoie de niciun gest — funcționează în orice
 * browser cu Web Bluetooth. Întoarce funcția de dezabonare.
 */
export function reconectareAutomata(
  device: BluetoothDevice,
  reia: () => Promise<void>,
  renunta: () => void,
  incercari = 3,
): () => void {
  let oprit = false;
  let ramase = incercari;

  const laDeconectare = () => {
    if (oprit) return;
    if (ramase <= 0) {
      renunta();
      return;
    }
    ramase -= 1;
    const asteptare = (incercari - ramase) * 1500;
    setTimeout(() => {
      if (oprit) return;
      void reia()
        .then(() => {
          ramase = incercari; // legătura s-a refăcut: bugetul se reîncarcă
        })
        .catch(() => laDeconectare());
    }, asteptare);
  };

  device.addEventListener('gattserverdisconnected', laDeconectare);
  return () => {
    oprit = true;
    device.removeEventListener('gattserverdisconnected', laDeconectare);
  };
}
