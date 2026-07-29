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

export default function App() {
  const { incarcat, profil, incarca } = useProfile();

  useEffect(() => {
    void incarca();
  }, [incarca]);

  if (!incarcat) return null;

  return (
    <HashRouter>
      <UpdatePrompt />
      {profil ? (
        <Shell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/biblioteca" element={<LibraryPage />} />
            <Route path="/biblioteca/:id" element={<ExercisePage />} />
            <Route path="/antrenamente" element={<TemplatesPage />} />
            <Route path="/antrenamente/:id" element={<TemplateEditorPage />} />
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
