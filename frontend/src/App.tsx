import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { HomePage } from './components/HomePage';
import { Login } from './components/Pages/Login/Login';
import { SignUp } from './components/Pages/Sign Up/SignUp';
import { Home } from './components/Pages/Home/Home';
import { supabase } from './lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'dashboard'>('home');
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
      if (initialSession) {
        setCurrentView('dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setCurrentView('dashboard');
      } else {
        const hash = window.location.hash;
        if (hash === '#login') {
          setCurrentView('login');
        } else if (hash === '#signup') {
          setCurrentView('signup');
        } else {
          setCurrentView('home');
        }
      }
    });

    const handleHashChange = () => {
      const hash = window.location.hash;
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (currentSession) {
          setCurrentView('dashboard');
        } else if (hash === '#login') {
          setCurrentView('login');
        } else if (hash === '#signup') {
          setCurrentView('signup');
        } else {
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

  // Prevent flash of content before checking sessionStorage
  if (showSplash === null) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }} />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : currentView === 'login' ? (
          <Login key="login" />
        ) : currentView === 'signup' ? (
          <SignUp key="signup" />
        ) : currentView === 'dashboard' && session ? (
          <Home key="dashboard" userEmail={session.user.email || ''} />
        ) : (
          <HomePage key="home" />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
