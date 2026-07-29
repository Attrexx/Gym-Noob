import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSession } from '@/state/sessionStore';
import './shell.css';

const TABURI = [
  { la: '/', emoji: '🏠', nume: 'Azi' },
  { la: '/antrenamente', emoji: '📋', nume: 'Planuri' },
  { la: '/sala', emoji: '🏋️', nume: 'Sală', central: true },
  { la: '/biblioteca', emoji: '📚', nume: 'Exerciții' },
  { la: '/mai-mult', emoji: '☰', nume: 'Mai mult' },
];

export function Shell(props: { children: ReactNode }) {
  const status = useSession((s) => s.status);
  const loc = useLocation();
  const inSesiune = status !== 'inactiva';

  return (
    <div className="shell">
      <main>{props.children}</main>
      {inSesiune && loc.pathname !== '/sala' && (
        <NavLink to="/sala" className="banner-sesiune" aria-label="Sesiune în desfășurare">
          <span className="puls-rosu" aria-hidden /> Sesiune {status === 'pauza' ? 'în pauză' : 'în desfășurare'} — apasă pentru a reveni
        </NavLink>
      )}
      <nav className="bara-jos" aria-label="Navigare principală">
        {TABURI.map((t) => (
          <NavLink
            key={t.la}
            to={t.la}
            end={t.la === '/'}
            className={({ isActive }) =>
              ['tab', t.central ? 'tab-central' : '', isActive ? 'tab-activ' : ''].filter(Boolean).join(' ')
            }
          >
            <span className="tab-emoji" aria-hidden>
              {t.emoji}
            </span>
            <span className="tab-nume">{t.nume}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
