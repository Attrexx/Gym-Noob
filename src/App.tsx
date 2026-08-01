import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './app/Shell';
import { useProfile } from './state/profileStore';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { HomePage } from './features/home/HomePage';
import { LibraryPage } from './features/library/LibraryPage';
import { ExercisePage } from './features/library/ExercisePage';
import { TemplatesPage } from './features/builder/TemplatesPage';
import { TemplateEditorPage } from './features/builder/TemplateEditorPage';
import { ProgramPage } from './features/programs/ProgramPage';
import { SessionPage } from './features/session/SessionPage';
const AnalyticsPage = lazy(() => import('./features/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
import { WeightPage } from './features/weight/WeightPage';
import { AchievementsPage } from './features/achievements/AchievementsPage';
import { GuidePage } from './features/guide/GuidePage';
import { ArticlePage } from './features/guide/ArticlePage';
import { SettingsPage } from './features/settings/SettingsPage';
import { MorePage } from './features/more/MorePage';
import { ProfilesPage } from './features/onboarding/ProfilesPage';
import { UpdatePrompt } from './app/UpdatePrompt';
import { SyncBoot } from './app/SyncBoot';

export default function App() {
  const { incarcat, profil, incarca } = useProfile();

  useEffect(() => {
    void incarca();
  }, [incarca]);

  // Ecranul de pornire din `index.html` rămâne pe ecran până e citit profilul, apoi
  // se stinge. Se scoate din DOM după tranziție, ca să nu stea degeaba peste pagină.
  useEffect(() => {
    if (!incarcat) return;
    const pornire = document.getElementById('pornire');
    if (!pornire) return;
    pornire.classList.add('gata');
    const ceas = setTimeout(() => pornire.remove(), 260);
    return () => clearTimeout(ceas);
  }, [incarcat]);

  if (!incarcat) return null;

  return (
    <HashRouter>
      <UpdatePrompt />
      <SyncBoot />
      {profil ? (
        <Shell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/biblioteca" element={<LibraryPage />} />
            <Route path="/biblioteca/:id" element={<ExercisePage />} />
            {/* aceeași pagină, două rafturi — „Programe = Planuri" */}
            <Route path="/antrenamente" element={<TemplatesPage tabInitial="mele" />} />
            <Route path="/antrenamente/:id" element={<TemplateEditorPage />} />
            <Route path="/programe" element={<TemplatesPage tabInitial="aplicatie" />} />
            <Route path="/programe/:id" element={<ProgramPage />} />
            <Route path="/sala" element={<SessionPage />} />
            <Route
              path="/statistici"
              element={
                <Suspense fallback={<div className="pagina" />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route path="/greutate" element={<WeightPage />} />
            <Route path="/realizari" element={<AchievementsPage />} />
            <Route path="/ghid" element={<GuidePage />} />
            <Route path="/ghid/:id" element={<ArticlePage />} />
            <Route path="/setari" element={<SettingsPage />} />
            <Route path="/mai-mult" element={<MorePage />} />
            <Route path="/profiluri" element={<ProfilesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      ) : (
        <Routes>
          <Route path="/profiluri" element={<ProfilesPage />} />
          <Route path="*" element={<OnboardingPage />} />
        </Routes>
      )}
    </HashRouter>
  );
}
