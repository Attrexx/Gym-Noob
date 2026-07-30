import type { ErrorCode } from '../../shared/wire.ts';

/** Eroare de aplicație cu cod de sârmă + status HTTP — prinsă central în app.ts. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  // fără „parameter properties" — sintaxa aia nu e ștergibilă și ar strica `node src/main.ts`
  constructor(code: ErrorCode, status: number, mesaj?: string) {
    super(mesaj ?? code);
    this.code = code;
    this.status = status;
  }
}

export const validare = (mesaj: string) => new AppError('VALIDATION', 400, mesaj);
