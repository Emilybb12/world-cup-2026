import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { LeaguesPage } from './pages/LeaguesPage';
import { LeaguePage } from './pages/LeaguePage';
import { PlayerSilhouettesBackground } from './components/PlayerSilhouettes';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display font-800 text-2xl tracking-widest text-gold-400 uppercase animate-pulse">
          Loading…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

function AuthGuard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) navigate('/leagues', { replace: true });
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display font-800 text-2xl tracking-widest text-gold-400 uppercase animate-pulse">
          Loading…
        </p>
      </div>
    );
  }

  return <AuthPage />;
}

function LeaguesRoute() {
  const { profile, loading } = useAuth();
  if (loading || !profile) return null;
  return <LeaguesPage profile={profile} />;
}

function LeagueRoute() {
  const { profile, loading } = useAuth();
  if (loading || !profile) return null;
  return <LeaguePage profile={profile} />;
}

export function App() {
  return (
    <>
      {/* Global fixed background — shows on all pages */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <PlayerSilhouettesBackground />
      </div>

      <Routes>
      <Route path="/auth" element={<AuthGuard />} />
      <Route
        path="/leagues"
        element={
          <RequireAuth>
            <LeaguesRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/league/:id"
        element={
          <RequireAuth>
            <LeagueRoute />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/leagues" replace />} />
    </Routes>
    </>
  );
}
