import type { TipAparat } from '@/data/types';
import {
  CARACTERISTICI_DATE,
  parseDateAparat,
  UUID_FTMS,
  type DateAparat,
} from '@/domain/ftms';
import {
  asteaptaSiConecteaza,
  bleDisponibil,
  dispozitivCunoscut,
  EROARE_FARA_BLE,
  reconectareAutomata,
} from './ble';

/**
 * Aparatele de cardio din sală, prin FTMS (Fitness Machine Service, 0x1826).
 *
 * Rowerul StairMaster vorbește FTMS standard — confirmat. Banda Star Trac 8TR
 * are Bluetooth, dar nu e confirmat că e tot FTMS; de aceea nu ghicim nimic:
 * încercăm FTMS, iar dacă aparatul nu răspunde, ecranul de diagnostic din
 * Setări spune exact ce servicii expune, ca să știm ce mai avem de scris.
 *
 * Când nu e conectat niciun aparat, nimic nu se schimbă: banda rămâne pe
 * steppere manuale, exact ca până acum.
 */

export interface MachineConnection {
  tip: TipAparat;
  /** ce scrie pe aparat: modelul din Device Information, altfel numele BLE */
  model: string;
  deviceName: string;
  deconecteaza: () => void;
}

const UUID_DIS = 0x180a;
const UUID_PRODUCATOR = 0x2a29;
const UUID_MODEL = 0x2a24;

/** Servicii pe care le cerem la scanare, ca să avem voie să le și citim. */
export const SERVICII_CUNOSCUTE: (number | string)[] = [
  UUID_FTMS,
  0x180d, // heart rate
  UUID_DIS, // device information
  0x180f, // battery
  0x1818, // cycling power
  0x1816, // cycling speed and cadence
  0x1814, // running speed and cadence
  0x181c, // user data
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART — folosit de multe console proprietare
];

async function citesteText(
  server: BluetoothRemoteGATTServer,
  serviciu: number,
  caracteristica: number,
): Promise<string | undefined> {
  try {
    const s = await server.getPrimaryService(serviciu);
    const c = await s.getCharacteristic(caracteristica);
    const v = await c.readValue();
    return new TextDecoder().decode(v).replace(/\0+$/, '').trim() || undefined;
  } catch {
    return undefined;
  }
}

/** Numele pe care îl arătăm și îl salvăm în jurnal. */
async function numeleAparatului(server: BluetoothRemoteGATTServer, fallback: string): Promise<string> {
  const producator = await citesteText(server, UUID_DIS, UUID_PRODUCATOR);
  const model = await citesteText(server, UUID_DIS, UUID_MODEL);
  if (producator && model) return `${producator} ${model}`;
  return model ?? producator ?? fallback;
}

/**
 * Găsește caracteristica de date pe care o expune aparatul — de acolo aflăm
 * și ce fel de aparat e (bandă, rower, bicicletă…), fără să întrebăm userul.
 */
async function gasesteDate(
  server: BluetoothRemoteGATTServer,
): Promise<{ tip: TipAparat; ch: BluetoothRemoteGATTCharacteristic }> {
  const service = await server.getPrimaryService(UUID_FTMS);
  for (const { uuid, tip } of CARACTERISTICI_DATE) {
    try {
      return { tip, ch: await service.getCharacteristic(uuid) };
    } catch {
      /* aparatul nu are tipul ăsta de date — încercăm următorul */
    }
  }
  throw new Error('Aparatul are FTMS, dar nu transmite date pe care să le înțelegem.');
}

async function asculta(
  device: BluetoothDevice,
  onSample: (d: DateAparat) => void,
): Promise<{ tip: TipAparat; model: string }> {
  const server = device.gatt!.connected ? device.gatt! : await device.gatt!.connect();
  const { tip, ch } = await gasesteDate(server);
  await ch.startNotifications();
  ch.addEventListener('characteristicvaluechanged', (ev) => {
    const dv = (ev.target as BluetoothRemoteGATTCharacteristic).value;
    if (dv) onSample(parseDateAparat(tip, dv));
  });
  const model = await numeleAparatului(server, device.name ?? 'Aparat');
  return { tip, model };
}

function legatura(
  device: BluetoothDevice,
  tip: TipAparat,
  model: string,
  onSample: (d: DateAparat) => void,
  onDeconectat: () => void,
): MachineConnection {
  const opresteAuto = reconectareAutomata(
    device,
    async () => {
      await asculta(device, onSample);
    },
    onDeconectat,
  );
  return {
    tip,
    model,
    deviceName: device.name ?? model,
    deconecteaza: () => {
      opresteAuto();
      try {
        device.gatt?.disconnect();
      } catch {
        /* deja deconectat */
      }
    },
  };
}

/** Calea cu un tap. */
export async function conecteazaAparat(
  onSample: (d: DateAparat) => void,
  onDeconectat: () => void,
): Promise<MachineConnection> {
  const fals = aparatSimulat(onSample);
  if (fals) return fals;
  if (!bleDisponibil) throw new Error(EROARE_FARA_BLE);
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [UUID_FTMS] }],
    optionalServices: [UUID_DIS, 0x180f],
  });
  await device.gatt!.connect();
  const { tip, model } = await asculta(device, onSample);
  return legatura(device, tip, model, onSample, onDeconectat);
}

/** Calea tăcută, la începutul sesiunii. */
export async function reconectareAparat(
  onSample: (d: DateAparat) => void,
  onDeconectat: () => void,
  numeCunoscut?: string,
): Promise<MachineConnection | null> {
  const fals = aparatSimulat(onSample);
  if (fals) return fals;
  if (!bleDisponibil) return null;
  const device = await dispozitivCunoscut((d) => (numeCunoscut ? d.name === numeCunoscut : true));
  if (!device) return null;
  try {
    await asteaptaSiConecteaza(device);
    const { tip, model } = await asculta(device, onSample);
    return legatura(device, tip, model, onSample, onDeconectat);
  } catch {
    return null;
  }
}

// ── Diagnostic: ce expune, de fapt, aparatul ────────────────────────

export interface RaportServiciu {
  uuid: string;
  caracteristici: { uuid: string; proprietati: string[] }[];
}

export interface RaportAparat {
  nume: string;
  id: string;
  servicii: RaportServiciu[];
  /** servicii cerute care n-au apărut — util ca să știm ce am eliminat */
  lipsa: string[];
}

function proprietatiile(c: BluetoothRemoteGATTCharacteristic): string[] {
  const p = c.properties;
  return (
    [
      ['read', p.read],
      ['write', p.write],
      ['writeFărăRăspuns', p.writeWithoutResponse],
      ['notify', p.notify],
      ['indicate', p.indicate],
    ] as const
  )
    .filter(([, are]) => are)
    .map(([nume]) => nume);
}

/**
 * Scanare de diagnostic. ATENȚIE la limita platformei: `getPrimaryServices()`
 * întoarce DOAR serviciile pe care le-am cerut dinainte în `optionalServices`.
 * Un serviciu proprietar necunoscut nu apare nicăieri până nu-i știm UUID-ul —
 * de asta ecranul din Setări are un câmp pentru UUID-uri suplimentare.
 */
export async function scaneazaAparat(uuidSuplimentare: string[] = []): Promise<RaportAparat> {
  if (!bleDisponibil) throw new Error(EROARE_FARA_BLE);
  const cerute = [...SERVICII_CUNOSCUTE, ...uuidSuplimentare];
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: cerute,
  });
  const server = await device.gatt!.connect();
  const servicii: RaportServiciu[] = [];
  try {
    for (const s of await server.getPrimaryServices()) {
      const caracteristici: RaportServiciu['caracteristici'] = [];
      try {
        for (const c of await s.getCharacteristics()) {
          caracteristici.push({ uuid: c.uuid, proprietati: proprietatiile(c) });
        }
      } catch {
        /* unele servicii nu-și lasă caracteristicile enumerate */
      }
      servicii.push({ uuid: s.uuid, caracteristici });
    }
  } finally {
    try {
      device.gatt?.disconnect();
    } catch {
      /* nimic de făcut */
    }
  }
  const gasite = new Set(servicii.map((s) => s.uuid));
  const lipsa = cerute
    .map((u) => (typeof u === 'number' ? `0x${u.toString(16)}` : u))
    .filter((u) => !gasite.has(u.startsWith('0x') ? uuidLung(u) : u));
  return { nume: device.name ?? '(fără nume)', id: device.id, servicii, lipsa };
}

function uuidLung(scurt: string): string {
  const n = Number(scurt);
  return `0000${n.toString(16).padStart(4, '0')}-0000-1000-8000-00805f9b34fb`;
}

/** Raportul ca text, ca să-l poată trimite mai departe. */
export function raportText(r: RaportAparat): string {
  const linii = [`Aparat: ${r.nume}`, `id: ${r.id}`, ''];
  for (const s of r.servicii) {
    linii.push(`serviciu ${s.uuid}`);
    for (const c of s.caracteristici) linii.push(`  └ ${c.uuid}  [${c.proprietati.join(', ')}]`);
  }
  if (r.servicii.length === 0) linii.push('(niciun serviciu cunoscut — probabil e protocol propriu)');
  if (r.lipsa.length) linii.push('', `cerute și negăsite: ${r.lipsa.join(', ')}`);
  return linii.join('\n');
}

// ── Aparat simulat, doar pentru testul automat ──────────────────────

const CHEIE_FALS = 'gym-noob-aparat-fals';

/**
 * Playwright nu poate face Bluetooth, deci testul e2e pornește un aparat
 * inventat prin `localStorage['gym-noob-aparat-fals'] = 'banda'` — același
 * truc ca `gym-noob-api-url`. În producție cheia nu există și funcția tace.
 */
function aparatSimulat(onSample: (d: DateAparat) => void): MachineConnection | null {
  let tip: string | null = null;
  try {
    tip = localStorage.getItem(CHEIE_FALS);
  } catch {
    return null;
  }
  if (!tip) return null;

  const esteRower = tip === 'rower';
  let t = 0;
  const id = setInterval(() => {
    t += 1;
    onSample(
      esteRower
        ? { cadenta: 28, putereW: 180, pasSec: 125, distantaM: t * 8, kcalTotal: Math.round(t * 0.25), timpSec: t }
        : { vitezaKmh: 9.5, inclinatieProcent: 2, distantaM: t * 26, kcalTotal: Math.round(t * 0.2), timpSec: t },
    );
  }, 1000);

  return {
    tip: (esteRower ? 'rower' : 'banda') as TipAparat,
    model: esteRower ? 'StairMaster HIIT Rower' : 'Star Trac 8TR',
    deviceName: 'Aparat simulat',
    deconecteaza: () => clearInterval(id),
  };
}
