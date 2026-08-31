import React from 'react';
import { motion } from 'framer-motion';
import { EmailIntelligenceSlider } from './sidecomponets/EmailIntelligenceSlider';
import { IdentityFeatures } from './feature/IdentityFeatures';
import { IdentityUseCases } from './feature/IdentityUseCases';
import { Header } from './Header/Header';
import { FAQ } from './FAQ/FAQ';
import { Contacts } from './Contacts/Contacts';
import { Footer } from './Footer/Footer';

export const HomePage: React.FC = () => {
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
      <Header />

      {/* Hero / Main Section */}
      <main style={{ flexGrow: 1, paddingBottom: '24px', zIndex: 10 }}>
        
        {/* Email Intelligence Hero Slider */}
        <EmailIntelligenceSlider />

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
    </motion.div>
  );
};
