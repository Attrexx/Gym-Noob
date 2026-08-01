import { describe, expect, it } from 'vitest';
import { rezolvaLimba } from '@/i18n/store';
import { LIMBI } from '@/i18n/types';

/**
 * Negocierea limbii. Contează mai mult decât pare: setarea se sincronizează
 * între dispozitive, deci un telefon cu o versiune mai nouă poate trimite o
 * limbă pe care build-ul curent n-o cunoaște. Nu avem voie să crăpăm.
 */
describe('rezolvaLimba', () => {
  it('respectă o limbă cunoscută, explicit aleasă', () => {
    expect(rezolvaLimba('ro', ['en-GB'])).toBe('ro');
  });

  it('pentru „auto" ia prima limbă cunoscută din browser', () => {
    expect(rezolvaLimba('auto', ['ro-RO', 'en-GB'])).toBe('ro');
  });

  it('acceptă și etichete regionale, nu doar codul primar', () => {
    expect(rezolvaLimba('auto', ['ro-MD'])).toBe('ro');
  });

  it('cade pe prima limbă din registru dacă browserul nu ajută', () => {
    expect(rezolvaLimba('auto', ['ja-JP', 'ko-KR'])).toBe(LIMBI[0]);
    expect(rezolvaLimba(undefined, [])).toBe(LIMBI[0]);
  });

  it('nu crapă pe o limbă necunoscută venită prin sincronizare', () => {
    // un dispozitiv cu o versiune mai nouă a trimis ceva ce nu știm încă
    expect(rezolvaLimba('kl-GL', ['ro-RO'])).toBe('ro');
    expect(LIMBI).toContain(rezolvaLimba('kl-GL', []));
  });
});
