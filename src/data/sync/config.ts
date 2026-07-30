/**
 * Adresa API-ului de sincronizare. Build-ul din dist/ e comis și publicat pe
 * GitHub Pages, deci constanta e „coaptă" în bundle — dar poate fi suprascrisă
 * prin localStorage (`gym-noob-api-url`), ca smoke-testul și dev-ul să poată
 * îndrepta EXACT build-ul de producție către un server local, fără rebuild.
 * (Cine poate scrie în localStorage controlează oricum originea — zero risc nou.)
 */
export const API_URL_IMPLICIT = 'https://gym-api.lessgo.city';

export function apiUrl(): string {
  try {
    return localStorage.getItem('gym-noob-api-url') ?? API_URL_IMPLICIT;
  } catch {
    return API_URL_IMPLICIT;
  }
}
