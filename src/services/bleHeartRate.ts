import {
  asteaptaSiConecteaza,
  bleDisponibil,
  dispozitivCunoscut,
  EROARE_FARA_BLE,
  reconectareAutomata,
} from './ble';

/**
 * Puls live prin Web Bluetooth — serviciul GATT standard „heart_rate".
 *
 * Ceasurile Huawei (inclusiv GT4) NU expun pulsul permanent pe BLE,
 * dar au opțiunea „Difuzare ritm cardiac" (HR broadcast) care se
 * activează pe ceas la începutul unui antrenament. Cu ea pornită,
 * ceasul devine un senzor standard și poate fi citit de aici.
 *
 * La începutul fiecărei sesiuni încercăm întâi reconectarea tăcută la
 * ceasul știut; dacă browserul nu ne lasă, sesiunea afișează un buton
 * „Conectează" la un singur tap. Vezi `ble.ts` pentru de ce.
 *
 * Limitări: Web Bluetooth există doar în Chrome/Edge pe Android și
 * desktop — NU pe iOS. Verificăm și degradăm elegant.
 */

export { bleDisponibil };

export interface HrConnection {
  deviceName: string;
  deconecteaza: () => void;
}

/** Abonarea propriu-zisă — comună căii cu tap și celei tăcute. */
async function ascultaPuls(
  device: BluetoothDevice,
  onSample: (bpm: number) => void,
): Promise<void> {
  const server = device.gatt!.connected ? device.gatt! : await device.gatt!.connect();
  const service = await server.getPrimaryService('heart_rate');
  const ch = await service.getCharacteristic('heart_rate_measurement');
  await ch.startNotifications();
  ch.addEventListener('characteristicvaluechanged', (ev) => {
    const dv = (ev.target as BluetoothRemoteGATTCharacteristic).value;
    if (dv) onSample(parseHeartRate(dv));
  });
}

function legatura(
  device: BluetoothDevice,
  onSample: (bpm: number) => void,
  onDeconectat: () => void,
): HrConnection {
  const opresteAuto = reconectareAutomata(
    device,
    () => ascultaPuls(device, onSample),
    onDeconectat,
  );
  return {
    deviceName: device.name ?? 'Senzor puls',
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

/** Calea cu un tap: deschide fereastra de alegere a dispozitivului. */
export async function conecteazaPuls(
  onSample: (bpm: number) => void,
  onDeconectat: () => void,
): Promise<HrConnection> {
  if (!bleDisponibil) throw new Error(EROARE_FARA_BLE);
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['heart_rate'] }],
    optionalServices: ['battery_service'],
  });
  await device.gatt!.connect();
  await ascultaPuls(device, onSample);
  return legatura(device, onSample, onDeconectat);
}

/**
 * Calea tăcută: la începutul sesiunii, dacă browserul ne lasă, ne agățăm
 * singuri de ceasul folosit data trecută. `null` = n-a mers, arată butonul.
 */
export async function reconectareSilentioasa(
  onSample: (bpm: number) => void,
  onDeconectat: () => void,
  numeCunoscut?: string,
): Promise<HrConnection | null> {
  if (!bleDisponibil) return null;
  const device = await dispozitivCunoscut((d) => (numeCunoscut ? d.name === numeCunoscut : true));
  if (!device) return null;
  try {
    await asteaptaSiConecteaza(device);
    await ascultaPuls(device, onSample);
    return legatura(device, onSample, onDeconectat);
  } catch {
    return null; // ceasul nu difuzează acum — nu e o eroare de raportat
  }
}

/** Parsare conform Bluetooth Heart Rate Measurement (flag-ul din primul octet). */
export function parseHeartRate(dv: DataView): number {
  const flags = dv.getUint8(0);
  return flags & 0x01 ? dv.getUint16(1, true) : dv.getUint8(1);
}
