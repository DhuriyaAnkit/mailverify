import React from 'react';
import { motion } from 'framer-motion';
import { Award, Check, ShieldCheck } from 'lucide-react';

export const IdentityUseCases: React.FC = () => {
  const rowVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section id="use-cases" style={{ marginTop: '64px', paddingBottom: '40px' }}>
      
      {/* Header Title Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
          <Award size={13} /> Built for professionals who need answers
        </span>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: 800, letterSpacing: '-1.2px', marginBottom: '16px', color: 'var(--text-primary)' }}>
          Get the intelligence you need in seconds.
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Whether you're qualifying leads, personalizing outreach, or conducting due diligence, find rich social and professional footprints instantly.
        </p>
      </div>

      <div className="use-cases-list" style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
        
        {/* Row 1: Cold Email Intelligence */}
        <motion.div 
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="use-case-row"
        >
          {/* Left Text */}
          <div className="use-case-text">
            <h3 className="use-case-title">Cold Email Intelligence</h3>
            <p className="use-case-desc">
              Understand your recipients before reaching out. Gather publicly available professional information to create more relevant, personalized conversations.
            </p>
            <ul className="use-case-checklist">
              <li>
                <span className="check-bullet"><Check size={12} /></span>
                Research public professional profiles before sending
              </li>
              <li>
                <span className="check-bullet"><Check size={12} /></span>
                Personalize every outreach with meaningful context
              </li>
              <li>
                <span className="check-bullet"><Check size={12} /></span>
                Improve campaign quality with verified contact insights
              </li>
            </ul>
          </div>

          {/* Right Visual Preview */}
          <div className="use-case-visual">
            <div className="use-case-preview-card" style={{ transform: 'rotate(1deg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  JD
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    john.doe@company.com
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Product Manager at Acme
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '6px 12px', 
                borderRadius: '100px', 
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: 'var(--success-color)',
                fontSize: '11px',
                fontWeight: 600
              }}>
                <ShieldCheck size={13} /> Identity Verified
              </div>
            </div>
          </div>
        </motion.div>

        {/* Row 2: Lead Enrichment */}
        <motion.div 
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="use-case-row reverse"
        >
          {/* Left Text */}
          <div className="use-case-text">
            <h3 className="use-case-title">Lead Enrichment</h3>
            <p className="use-case-desc">
              Convert an email address into structured, publicly available professional insights to identify and prioritize the right opportunities.
            </p>
            <ul className="use-case-checklist">
              <li>
                <span className="check-bullet"><Check size={12} /></span>
                Discover current roles and organizations
              </li>
              <li>
                <span className="check-bullet"><Check size={12} /></span>
                Identify high-value prospects faster
              </li>
              <li>
                <span className="check-bullet"><Check size={12} /></span>
               Create accurate, data-driven prospect lists
              </li>
            </ul>
          </div>

          {/* Right Visual Preview */}
          <div className="use-case-visual">
            <div className="use-case-preview-card" style={{ transform: 'rotate(-1.5deg)', maxWidth: '340px' }}>
              <div className="card-header-bar" style={{ marginBottom: '12px' }}>
                <span className="platform-tag linkedin-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn Profile
                </span>
              </div>
              <div className="card-profile-section" style={{ border: 'none', padding: 0 }}>
                <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #0a66c2 0%, #0077b5 100%)', width: '38px', height: '38px', fontSize: '13px' }}>SC</div>
                <div className="card-profile-info" style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Sarah Chen</h4>
                  <p className="card-profile-role" style={{ fontSize: '12px', margin: '2px 0 0 0' }}>Senior Product Manager</p>
                  <p className="card-profile-meta" style={{ fontSize: '11px', margin: '4px 0 0 0' }}>Acme Technologies • San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Row 3: Public Record & Profile Research */}
        <motion.div 
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="use-case-row"
        >
          {/* Left Text */}
          <div className="use-case-text">
            <h3 className="use-case-title">Public Record & Profile Research</h3>
            <p className="use-case-desc">
              Search publicly available sources to build a comprehensive view of an individual's professional presence and online footprint.
            </p>
            <ul className="use-case-checklist">
              <li>
                <span className="check-bullet"><Check size={12} /></span>
               Review publicly available career history
              </li>
              <li>
                <span className="check-bullet"><Check size={12} /></span>
                Discover verified professional affiliations
              </li>
              <li>
                <span className="check-bullet"><Check size={12} /></span>
                Explore digital presence across trusted sources
              </li>
            </ul>
          </div>

          {/* Right Visual Preview */}
          <div className="use-case-visual">
            <div className="use-case-preview-card" style={{ transform: 'rotate(0.8deg)', minWidth: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Digital Footprint</span>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(9, 9, 11, 0.05)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  4 sources found
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'LinkedIn', checked: true, color: '#0a66c2' },
                  { name: 'Twitter/X', checked: true, color: '#09090b' },
                  { name: 'GitHub', checked: true, color: '#24292e' },
                  { name: 'Company Website', checked: true, color: '#0066cc' }
                ].map((src) => (
                  <div key={src.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: src.color }} />
                      {src.name}
                    </span>
                    <span style={{ color: 'var(--success-color)', display: 'inline-flex', alignItems: 'center' }}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
