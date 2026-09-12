import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchExperience } from './Search/SearchExperience';
import { IdentityFeatures } from './feature/IdentityFeatures';
import { IdentityUseCases } from './feature/IdentityUseCases';
import { Header } from './Header/Header';
import { FAQ } from './FAQ/FAQ';
import { Contacts } from './Contacts/Contacts';
import { Footer } from './Footer/Footer';
import { LoginLimitModal } from './common/LoginLimitModal';
import { supabase } from '../lib/supabaseClient';

const GUEST_SEARCH_KEY = 'mailverify_guest_searches_count';

export const getGuestSearchCount = (): number => {
  try {
    const val = localStorage.getItem(GUEST_SEARCH_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

export const incrementGuestSearchCount = (): number => {
  try {
    const current = getGuestSearchCount();
    const next = current + 1;
    localStorage.setItem(GUEST_SEARCH_KEY, String(next));
    return next;
  } catch {
    return 0;
  }
};

interface HomePageProps {
  onNavigateDashboard?: () => void;
  onStartSearch?: (email: string) => void;
  isLoggedIn?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateDashboard, onStartSearch, isLoggedIn }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(!!isLoggedIn);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  const handleModalLogin = () => {
    setIsLoginModalOpen(false);
    window.location.hash = '#login';
  };

  const handleInterceptSearch = (targetEmail: string) => {
    // If logged in, forward to authenticated Search experience with full plan credits
    if (loggedIn && onStartSearch) {
      onStartSearch(targetEmail);
      return true;
    }

    // Guest user (not logged in): enforce 2-search maximum limit
    const currentGuestCount = getGuestSearchCount();
    if (currentGuestCount >= 2) {
      // Third search and beyond is blocked; show Login Required popup
      setIsLoginModalOpen(true);
      return true; // handled and blocked
    }

    // Search #1 or #2: allowed, increment count
    incrementGuestSearchCount();
    return false; // allow SearchExperience to execute search
  };

  // Variants for fade-up reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Background elements */}
      <div className="bg-grid" />
      <div className="gradient-glow pulse-glow-animation" />

      {/* Modern Sticky Header */}
      <Header onNavigateDashboard={onNavigateDashboard} isLoggedIn={isLoggedIn} />

      {/* Hero / Main Section */}
      <main style={{ flexGrow: 1, paddingBottom: '48px', zIndex: 10 }}>
        
        {/* Main Google-like Search Experience Hero */}
        <section style={{ paddingTop: '64px', paddingBottom: '32px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(0, 102, 204, 0.08)',
                border: '1px solid rgba(0, 102, 204, 0.2)',
                color: '#0066cc',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              Real-Time Account Detection
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 800,
                letterSpacing: '-1.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                marginBottom: '16px',
                maxWidth: '750px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Discover Every Website Where That Person Has an Account.
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Instant verification across 120+ platforms with recovery clues and account presence.
            </p>
          </div>

          <SearchExperience onInterceptSearch={handleInterceptSearch} />
        </section>

        <div className="container" style={{ marginTop: '48px' }}>
          <IdentityFeatures />
          
          <IdentityUseCases />

          {/* How It Works Section */}
          <section id="how-it-works" style={{ marginTop: '64px', marginBottom: '64px', scrollMarginTop: '100px' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(0, 102, 204, 0.06)',
                border: '1px solid rgba(0, 102, 204, 0.15)',
                color: 'var(--accent-color)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px'
              }}>
                How it Works
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: 800, letterSpacing: '-1.2px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                From Email to Verified Insights.
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
                Search publicly available information connected to an email address and receive a structured identity profile within seconds.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">01</div>
                <h3 className="step-title">Enter an Email</h3>
                <p className="step-description">Provide an email address to begin the search. We validate the input and initiate a lookup across publicly available sources.</p>
              </div>
              <div className="step-card">
                <div className="step-number">02</div>
                <h3 className="step-title">Gather Public Insights</h3>
                <p className="step-description">Our system collects and organizes publicly available professional information, digital presence, and related signals into a structured profile.</p>
              </div>
              <div className="step-card">
                <div className="step-number">03</div>
                <h3 className="step-title">Review the Results</h3>
                <p className="step-description">Explore the compiled profile, evaluate the available information, and use the insights to support verification, investigations, or outreach.</p>
              </div>
            </div>
          </section>

          <FAQ />
          
          <Contacts />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Guest 2-Search Limit Login Required Modal */}
      <LoginLimitModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleModalLogin}
      />
    </motion.div>
  );
};
