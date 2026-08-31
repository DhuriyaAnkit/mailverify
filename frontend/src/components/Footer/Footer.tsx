import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-color)', 
      padding: '48px 0 32px 0', 
      backgroundColor: 'var(--bg-primary)',
      zIndex: 10,
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Top footer columns */}
        <div className="footer-columns-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '3.5fr 1fr 1fr 1fr', 
          gap: '24px', 
          marginBottom: '36px',
          textAlign: 'left'
        }}>
          
          {/* Brand Info */}
          <div>
            <div className="logo-group" style={{ marginBottom: '16px' }}>
              <div className="logo-icon">
                <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                  <rect x="8" y="8" width="84" height="84" rx="22" stroke="#09090b" strokeWidth="8" />
                  <path d="M 28 48 L 42 62 L 72 32" stroke="#0066cc" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                MailVerify
              </span>
            </div>
            <p style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)', 
              lineHeight: 1.6, 
              maxWidth: '240px',
              margin: 0
            }}>
              Open-Source Intelligence, Organized for You.
            </p>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              MailVerify
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#pricing" className="footer-link">Pricing</a></li>
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#use-cases" className="footer-link">Use Cases</a></li>
              <li><a href="#how-it-works" className="footer-link">How it Works</a></li>
              <li><a href="#faq" className="footer-link">FAQ</a></li>
              <li><a href="#contact" className="footer-link">Contact</a></li>
              <li><a href="#developers" className="footer-link">API</a></li>
            </ul>
          </div>

          {/* Account Links Column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Account
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><a href="#signup" className="footer-link">Sign Up</a></li>
              <li><a href="#login" className="footer-link">Log in</a></li>
            </ul>
          </div>

          {/* Legal Links Column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms of Service</a></li>
              <li><a href="#claim" className="footer-link">Claim</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            &copy; {new Date().getFullYear()} MailVerify. All rights reserved.
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Engineered for identity intelligence.
          </span>
        </div>

      </div>
    </footer>
  );
};
