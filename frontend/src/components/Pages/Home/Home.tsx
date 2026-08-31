import React from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface HomeProps {
  userEmail: string;
}

export const Home: React.FC<HomeProps> = ({ userEmail }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Authenticated Header */}
      <header className="header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo-group">
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
              <rect x="8" y="8" width="84" height="84" rx="22" stroke="#09090b" strokeWidth="8" />
              <path d="M 28 48 L 42 62 L 72 32" stroke="#0066cc" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>MailVerify</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Logged in as: <strong style={{ color: 'var(--text-primary)' }}>{userEmail}</strong>
          </span>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}>
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="playground-card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '48px 32px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.08)',
            color: 'var(--accent-color)',
            marginBottom: '24px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Welcome to your Home Page
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
            You have successfully logged in to MailVerify. This is your private user dashboard where you can manage your email verification credits, view query logs, and access API developer settings.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Search Credits</h3>
              <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-color)', margin: 0 }}>100 / 100</p>
            </div>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Plan Status</h3>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--success-color)', margin: '4px 0 0 0' }}>Developer Free</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
