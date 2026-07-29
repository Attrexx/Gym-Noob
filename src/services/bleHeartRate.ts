/**
 * Puls live prin Web Bluetooth — serviciul GATT standard „heart_rate".
 *
 * Ceasurile Huawei (inclusiv GT4) NU expun pulsul permanent pe BLE,
 * dar au opțiunea „Difuzare ritm cardiac" (HR broadcast) care se
 * activează pe ceas la începutul unui antrenament. Cu ea pornită,
 * ceasul devine un senzor standard și poate fi citit de aici.
 *
 * Limitări: Web Bluetooth există doar în Chrome/Edge pe Android și
 * desktop — NU pe iOS. Verificăm și degradăm elegant.
 */

export const bleDisponibil = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

export interface HrConnection {
  deviceName: string;
  deconecteaza: () => void;
}

export async function conecteazaPuls(
  onSample: (bpm: number) => void,
  onDeconectat: () => void,
): Promise<HrConnection> {
  if (!bleDisponibil) throw new Error('Browserul acesta nu are Web Bluetooth (pe iPhone nu există, din păcate).');
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['heart_rate'] }],
    optionalServices: ['battery_service'],
  });
  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService('heart_rate');
  const ch = await service.getCharacteristic('heart_rate_measurement');
  await ch.startNotifications();
  ch.addEventListener('characteristicvaluechanged', (ev) => {
    const dv = (ev.target as BluetoothRemoteGATTCharacteristic).value;
    if (dv) onSample(parseHeartRate(dv));
  });
  device.addEventListener('gattserverdisconnected', onDeconectat);
  return {
    deviceName: device.name ?? 'Senzor puls',
    deconecteaza: () => {
      try {
        device.gatt?.disconnect();
      } catch {
        /* deja deconectat */
      }
    },
  };
}

/** Parsare conform Bluetooth Heart Rate Measurement (flag-ul din primul octet). */
export function parseHeartRate(dv: DataView): number {
  const flags = dv.getUint8(0);
  return flags & 0x01 ? dv.getUint16(1, true) : dv.getUint8(1);
}
