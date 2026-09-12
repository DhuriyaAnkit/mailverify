import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface HeaderProps {
  onNavigateDashboard?: () => void;
  onNavigateHome?: () => void;
  isLoggedIn?: boolean;
  activeNav?: 'api' | 'features' | 'pricing' | 'contact' | 'faq';
}

export const Header: React.FC<HeaderProps> = ({ onNavigateDashboard, onNavigateHome, isLoggedIn, activeNav }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(!!isLoggedIn);

  useEffect(() => {
    setLoggedIn(!!isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setLoggedIn(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = '#home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDashboardClick = () => {
    if (onNavigateDashboard) {
      onNavigateDashboard();
    } else {
      window.location.hash = '#dashboard';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div 
          className="logo-group" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          title="MailVerify Home"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '2px solid #09090b',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
              <path d="M 28 48 L 42 62 L 72 32" stroke="#0066cc" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            MailVerify
          </span>
        </div>

        <nav className="nav-links">
          <a href="#developers" className={`nav-link ${activeNav === 'api' ? 'active' : ''}`}>API</a>
          <a href="#features" className={`nav-link ${activeNav === 'features' ? 'active' : ''}`}>Features</a>
          <a 
            href="#pricing" 
            className={`nav-link ${activeNav === 'pricing' ? 'active' : ''}`}
            style={activeNav === 'pricing' ? { color: '#0066cc', fontWeight: 600 } : undefined}
          >
            Pricing
          </a>
          <a href="#contact" className={`nav-link ${activeNav === 'contact' ? 'active' : ''}`}>Contact</a>
          <a href="#faq" className={`nav-link ${activeNav === 'faq' ? 'active' : ''}`}>FAQ</a>
        </nav>

        <div className="header-actions">
          {loggedIn ? (
            <button 
              onClick={handleDashboardClick} 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Dashboard →
            </button>
          ) : (
            <>
              <button onClick={() => window.location.hash = '#login'} className="btn btn-ghost">Log In</button>
              <button onClick={() => window.location.hash = '#signup'} className="btn btn-primary">Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
