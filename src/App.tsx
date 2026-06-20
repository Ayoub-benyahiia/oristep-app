import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { BottomNav } from './components/BottomNav';
import { AchievementProvider } from './context/AchievementContext';
import { PaperStashProvider } from './context/PaperStashContext';
import { PatternProvider } from './context/PatternContext';
import { ThemeProvider } from './context/ThemeContext';

// Onboarding is eager — it's the first screen for new users, must load instantly
import { Onboarding } from './pages/Onboarding';

// All other pages are lazy-loaded to reduce initial bundle size
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Browse = lazy(() => import('./pages/Browse').then(m => ({ default: m.Browse })));
const PatternDetail = lazy(() => import('./pages/PatternDetail').then(m => ({ default: m.PatternDetail })));
const FoldMode = lazy(() => import('./pages/FoldMode').then(m => ({ default: m.FoldMode })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const PaperStash = lazy(() => import('./pages/PaperStash').then(m => ({ default: m.PaperStash })));

const IS_DEV = import.meta.env.DEV;

// Loading fallback — purely token-driven, no hardcoded zinc
function AppLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center w-full h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-crease-light border-t-accent animate-spin" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-ink-light">Loading…</span>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error(error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 text-ink bg-paper-light relative z-[999]">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
          <pre className="text-xs bg-paper p-4 rounded overflow-auto border border-crease text-left w-full max-w-md text-ink-light">
            {this.state.error?.message}
            {IS_DEV && (
              <>
                {'\n'}
                {this.state.error?.stack}
              </>
            )}
          </pre>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFoldMode = location.pathname.includes('/fold');
  
  const [onboardingState, setOnboardingState] = useState(() => {
    try {
      const saved = localStorage.getItem('oristep:onboarding');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { completed: false, level: 'Beginner', interests: [] };
  });

  const handleOnboardingComplete = (data: any, navigateTo?: string) => {
    try { localStorage.setItem('oristep:onboarding', JSON.stringify(data)); } catch {}
    setOnboardingState(data);
    if (navigateTo) {
       navigate(navigateTo);
    } else {
       navigate('/');
    }
  };

  return (
    <div className="h-screen min-h-screen w-full max-w-md mx-auto bg-paper-light relative shadow-2xl overflow-hidden md:rounded-[2.5rem] md:h-[850px] md:my-10 md:min-h-0 border border-crease-light text-ink">
      {IS_DEV && (
        <div className="absolute top-0 right-0 z-[999] p-2">
           <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-red-500 text-white text-[10px] px-2 py-1 rounded shadow-sm opacity-50 hover:opacity-100 transition-opacity">DEV CLEAR</button>
        </div>
      )}
      {!onboardingState?.completed ? (
         <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <div className="h-full overflow-y-auto scrollbar-hide">
            <Suspense fallback={<AppLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/pattern/:id" element={<PatternDetail />} />
                <Route path="/fold/:id" element={<FoldMode />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/stash" element={<PaperStash />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </div>
          {!isFoldMode && <BottomNav />}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-paper-light flex items-center justify-center transition-colors duration-200">
          <PatternProvider>
            <ProgressProvider>
              <AchievementProvider>
                <PaperStashProvider>
                  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AppContent />
                  </Router>
                </PaperStashProvider>
              </AchievementProvider>
            </ProgressProvider>
          </PatternProvider>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
