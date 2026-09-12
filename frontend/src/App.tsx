import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { HomePage } from './components/HomePage';
import { Login } from './components/Pages/Login/Login';
import { SignUp } from './components/Pages/Sign Up/SignUp';
import { Home } from './components/Pages/Home/Home';
import { Pricing } from './components/Pages/Pricing/Pricing';
import { ToastProvider } from './components/common/Toast';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'dashboard' | 'pricing'>('home');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check if the user has already seen the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('mailverify_intro_played');
    if (hasSeenSplash === 'true') {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      const hash = window.location.hash;
      if (hash === '#login') {
        setCurrentView('login');
      } else if (hash === '#signup') {
        setCurrentView('signup');
      } else if (hash === '#dashboard' && initialSession) {
        setCurrentView('dashboard');
      } else if (hash === '#pricing') {
        setCurrentView('pricing');
      } else if (hash === '#home' || hash === '' || hash === '#' || hash === '#/') {
        setCurrentView('home');
      } else if (initialSession) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('home');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_IN') {
        window.location.hash = '#dashboard';
        setCurrentView('dashboard');
      } else if (event === 'SIGNED_OUT') {
        window.location.hash = '#home';
        setCurrentView('home');
      } else if (newSession) {
        const hash = window.location.hash;
        if (hash === '#login' || hash === '#signup') {
          window.location.hash = '#dashboard';
          setCurrentView('dashboard');
        }
      }
    });

    const handleHashChange = () => {
      const hash = window.location.hash;
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (hash === '#login') {
          setCurrentView('login');
        } else if (hash === '#signup') {
          setCurrentView('signup');
        } else if (hash === '#dashboard') {
          if (currentSession) {
            setCurrentView('dashboard');
          } else {
            window.location.hash = '#login';
            setCurrentView('login');
          }
        } else if (hash === '#pricing') {
          setCurrentView('pricing');
        } else {
          // #home, #/, #, #features, #contact, #faq, etc.
          setCurrentView('home');
        }
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSplashComplete = () => {
    // Set the flag in session storage so it doesn't play again during this session
    sessionStorage.setItem('mailverify_intro_played', 'true');
    setShowSplash(false);
  };

  const [pendingSearchEmail, setPendingSearchEmail] = useState<string | null>(null);

  const handleNavigateHome = () => {
    window.location.hash = '#home';
    setCurrentView('home');
  };

  const handleNavigateDashboard = () => {
    window.location.hash = '#dashboard';
    setCurrentView('dashboard');
  };

  const handleStartSearchFromHome = (email: string) => {
    setPendingSearchEmail(email);
    window.location.hash = '#dashboard';
    setCurrentView('dashboard');
  };

  // Prevent flash of content before checking sessionStorage
  if (showSplash === null) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }} />;
  }

  return (
    <ToastProvider>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : currentView === 'login' ? (
          <Login key="login" />
        ) : currentView === 'signup' ? (
          <SignUp key="signup" />
        ) : currentView === 'dashboard' ? (
          session ? (
            <Home 
              key="dashboard" 
              userEmail={session.user.email || 'ankitdhuriya281@gmail.com'} 
              onNavigateHome={handleNavigateHome}
              initialTab={pendingSearchEmail ? 'search' : 'dashboard'}
              initialSearchEmail={pendingSearchEmail || ''}
              autoSearchOnMount={!!pendingSearchEmail}
              onClearPendingSearch={() => setPendingSearchEmail(null)}
            />
          ) : (
            <Login key="login" />
          )
        ) : currentView === 'pricing' ? (
          <Pricing
            key="pricing"
            isLoggedIn={!!session}
            userEmail={session?.user?.email}
            onNavigateDashboard={handleNavigateDashboard}
            onNavigateHome={handleNavigateHome}
          />
        ) : (
          <HomePage 
            key="home" 
            onNavigateDashboard={handleNavigateDashboard}
            onStartSearch={handleStartSearchFromHome}
            isLoggedIn={!!session}
          />
        )}
      </AnimatePresence>
    </ToastProvider>
  );
}

export default App;
