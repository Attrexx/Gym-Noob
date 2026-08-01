import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSession } from '@/state/sessionStore';
import { useT } from '@/i18n';
import './shell.css';

const TABURI = [
  { la: '/', emoji: '🏠', cheie: 'nav.azi' },
  { la: '/antrenamente', emoji: '📋', cheie: 'nav.programe' },
  { la: '/sala', emoji: '🏋️', cheie: 'nav.sala', central: true },
  { la: '/biblioteca', emoji: '📚', cheie: 'nav.exercitii' },
  { la: '/mai-mult', emoji: '☰', cheie: 'nav.maiMult' },
] as const;

export function Shell(props: { children: ReactNode }) {
  const { t } = useT();
  const status = useSession((s) => s.status);
  const loc = useLocation();
  const inSesiune = status !== 'inactiva';

  return (
    <div className="shell">
      <main>{props.children}</main>
      {inSesiune && loc.pathname !== '/sala' && (
        <NavLink to="/sala" className="banner-sesiune" aria-label={t('nav.banner.aria')}>
          {/* două propoziții întregi, nu o propoziție cu o bucată schimbată:
              ordinea cuvintelor nu supraviețuiește traducerii */}
          <span className="puls-rosu" aria-hidden />{' '}
          {t(status === 'pauza' ? 'nav.banner.pauza' : 'nav.banner.desfasurare')}
        </NavLink>
      )}
      <nav className="bara-jos" aria-label={t('nav.aria')}>
        {TABURI.map((tab) => (
          <NavLink
            key={tab.la}
            to={tab.la}
            end={tab.la === '/'}
            className={({ isActive }) =>
              ['tab', 'central' in tab && tab.central ? 'tab-central' : '', isActive ? 'tab-activ' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            <span className="tab-emoji" aria-hidden>
              {tab.emoji}
            </span>
            <span className="tab-nume">{t(tab.cheie)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
