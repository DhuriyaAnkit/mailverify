import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-group">
          <div className="logo-icon">
            {/* Mini MailVerify icon */}
            <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
              <rect x="8" y="8" width="84" height="84" rx="22" stroke="#09090b" strokeWidth="8" />
              <path d="M 28 48 L 42 62 L 72 32" stroke="#0066cc" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span>MailVerify</span>
        </div>

        <nav className="nav-links">
          <a href="#developers" className="nav-link">API</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="#faq" className="nav-link">FAQ</a>
          
        </nav>

        <div className="header-actions">
          <button onClick={() => window.location.hash = '#login'} className="btn btn-ghost">Log In</button>
          <button onClick={() => window.location.hash = '#signup'} className="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </header>
  );
};
