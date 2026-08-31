import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { checkEmail, type CheckEmailResponse } from '../../lib/api';

interface SignalConfig {
  name: string;
  svg: React.ReactNode;
}

export const IdentityFeatures: React.FC = () => {
  // Deep Identity Search states
  const [identityInput, setIdentityInput] = useState('jane@gmail.com');
  const [isSearchingIdentity, setIsSearchingIdentity] = useState(false);
  const [resolvedSignals, setResolvedSignals] = useState<string[]>([]);

  // Bulk Search states
  const [bulkRows, setBulkRows] = useState([
    { id: '01', email: 'mark@gmail.com', status: 'Searching' },
    { id: '02', email: 'aubrey@hotmail.com', status: 'Searching' },
    { id: '03', email: 'taylor@gmail.com', status: 'Searching' },
    { id: '04', email: 'henry@yahoo.com', status: 'Searching' },
    { id: '05', email: 'jane@gmail.com', status: 'Searching' },
    { id: '06', email: 'mike@hotmail.com', status: 'Complete' },
    { id: '07', email: 'linda@gmail.com', status: 'Complete' },
  ]);

  // Pre-resolve some signals on mount
  useEffect(() => {
    setResolvedSignals(['Full Name', 'Job History', 'Location', 'Skills', 'Bio']);
  }, []);

  // Bulk Search console state loop
  useEffect(() => {
    const timer = setInterval(() => {
      setBulkRows(prev => {
        const searchingRows = prev.filter(r => r.status === 'Searching');
        if (searchingRows.length === 0) {
          // Reset first 5 rows to Searching to keep loop running
          return prev.map((r, idx) => idx < 5 ? { ...r, status: 'Searching' } : r);
        }
        // Move one random row to Complete
        const targetRow = searchingRows[Math.floor(Math.random() * searchingRows.length)];
        return prev.map(r => r.id === targetRow.id ? { ...r, status: 'Complete' } : r);
      });
    }, 1600);

    return () => clearInterval(timer);
  }, []);

  const [searchResultData, setSearchResultData] = useState<CheckEmailResponse | null>(null);

  const handleIdentitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityInput || isSearchingIdentity) return;

    setIsSearchingIdentity(true);
    setResolvedSignals([]);
    setSearchResultData(null);

    try {
      const data = await checkEmail(identityInput, 8);
      setSearchResultData(data);

      const registeredSites = data.results.filter(r => r.exists);
      const signalsFound: string[] = [];

      if (registeredSites.length > 0) signalsFound.push('Socials');
      signalsFound.push('Email Check');

      const notableSites = ['instagram', 'twitter', 'github', 'linkedin', 'snapchat', 'spotify', 'discord', 'pinterest', 'tumblr', 'flickr', 'patreon', 'soundcloud'];
      const foundNotable = registeredSites.filter(r => notableSites.includes(r.name.toLowerCase()));
      
      if (foundNotable.length > 0) signalsFound.push('Socials');

      // Unlock 12 signals (all since we have real data)
      const signalsList = [
        'Full Name', 'Job History', 'Education', 'Location', 
        'Socials', 'Photos', 'Username', 'Skills', 
        'Interests', 'Bio', 'Activity', 'Timeline'
      ];

      for (let i = 0; i < signalsList.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 150));
        setResolvedSignals(prev => [...prev, signalsList[i]]);
      }
    } catch (err) {
      console.error("Identity search failed:", err);
    }

    setIsSearchingIdentity(false);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  const signalConfigs: SignalConfig[] = [
    { name: 'Full Name', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { name: 'Job History', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { name: 'Education', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg> },
    { name: 'Location', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> },
    { name: 'Socials', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg> },
    { name: 'Photos', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> },
    { name: 'Username', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg> },
    { name: 'Skills', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { name: 'Interests', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
    { name: 'Bio', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" x2="16" y1="13" y2="13"/><line x1="8" x2="16" y1="17" y2="17"/></svg> },
    { name: 'Activity', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { name: 'Timeline', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
  ];

  return (
    <section id="features" style={{ scrollMarginTop: '100px' }}>
      {/* Main Title Section */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
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
          <Award size={13} /> Enterprise-grade identity intelligence
        </span>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: 800, letterSpacing: '-1.2px', marginBottom: '16px', color: 'var(--text-primary)' }}>
          Fast, reliable tools to verify the person behind the email.
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Protect your organization and enrich user context by connecting emails to deep social, professional, and security signals.
        </p>
      </div>

      {/* Section 1: Deep Identity Search Sandbox */}
      <motion.div variants={itemVariants} style={{ marginBottom: '80px' }}>
        <div className="playground-card" style={{ maxWidth: '960px', padding: '40px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'center' }}>
            
            {/* Left Side: Header & Search */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Deep Identity Search
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '32px' }}>
                Connect an email to public signals to qualify leads, verify senders, and detect fraud.
              </p>

              <form onSubmit={handleIdentitySearch} className="playground-input-group" style={{ marginBottom: 0 }}>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '16px', color: 'var(--text-tertiary)', fontWeight: 500 }}>@</span>
                  <input
                    type="text"
                    className="playground-input"
                    style={{ paddingLeft: '32px' }}
                    placeholder="jane@gmail.com"
                    value={identityInput}
                    onChange={(e) => setIdentityInput(e.target.value)}
                    disabled={isSearchingIdentity}
                  />
                </div>
                <button
                  type="submit"
                  className="playground-btn"
                  disabled={isSearchingIdentity || !identityInput}
                  style={{ minWidth: '100px' }}
                >
                  {isSearchingIdentity ? 'Searching...' : 'Search'}
                </button>
              </form>

              {searchResultData && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {searchResultData.results.filter(r => r.exists).slice(0, 6).map(r => (
                      <span key={r.name} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.2)',
                        color: 'var(--success-color)'
                      }}>
                        {r.name}
                      </span>
                    ))}
                    {searchResultData.results.filter(r => r.exists).length > 6 && (
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}>
                        +{searchResultData.results.filter(r => r.exists).length - 6} more
                      </span>
                    )}
                  </div>
                  {/* Show extra details from registered sites */}
                  {searchResultData.results.filter(r => r.exists && (r.others || r.emailrecovery || r.phoneNumber)).slice(0, 4).map(r => {
                    const o = r.others as Record<string, unknown> | null;
                    const fullName = o && typeof o.FullName === 'string' ? o.FullName : null;
                    const createdDate = o && typeof o['Date, time of the creation'] === 'string' ? o['Date, time of the creation'] as string : null;
                    return (
                      <div key={r.name} style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-secondary)',
                        padding: '4px 0',
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{r.name}:</span>
                        {fullName && !fullName.includes(';') && <span> {fullName.split(' / ')[0]}</span>}
                        {fullName && fullName.includes(';') && <span> {fullName}</span>}
                        {createdDate && <span> Created: {createdDate}</span>}
                        {r.emailrecovery && <span> Recovery: {r.emailrecovery}</span>}
                        {r.phoneNumber && <span> Phone: {r.phoneNumber}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Side: 12 Signals Grid */}
            <div className="signals-badge-grid">
              {signalConfigs.map((sig) => {
                const isResolved = resolvedSignals.includes(sig.name);
                return (
                  <div 
                    key={sig.name} 
                    className={`signal-badge-item ${isResolved ? 'resolved' : ''} ${isSearchingIdentity && !isResolved ? 'searching' : ''}`}
                  >
                    <span className="signal-icon">{sig.svg}</span>
                    <span className="signal-name">{sig.name}</span>
                    <span className="signal-check">
                      {isResolved && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {isSearchingIdentity && !isResolved && (
                        <div className="signal-mini-spinner" />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </motion.div>

      {/* Section 2: Two-column Export & Bulk widgets */}
      <div className="identity-features-grid">
        
        {/* Column 1: Export Data Card */}
        <motion.div variants={itemVariants} className="playground-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Identity Verification
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              Verify identities, build research context, and mitigate security risks with confidence.
            </p>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Export Data</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Instantly export searches to Excel or CSV for further analysis.</p>
            </div>
          </div>

          {/* Table Preview Spreadsheet */}
          <div className="spreadsheet-preview-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="spreadsheet-header-bar">
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="file-pill">CSV</span>
                <span className="file-pill active">XLSX</span>
              </div>
              <span className="export-text">Tabular export</span>
            </div>
            
            <div className="table-responsive" style={{ overflowX: 'auto', flexGrow: 1 }}>
              <table className="spreadsheet-table">
                <thead>
                  <tr>
                    <th>email</th>
                    <th>name</th>
                    <th>company</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>mark@gmail.com</td>
                    <td>Mark Field</td>
                    <td>Signal Labs</td>
                  </tr>
                  <tr>
                    <td>ops.list@gmail.com</td>
                    <td>Ops List</td>
                    <td>Archive Desk</td>
                  </tr>
                  <tr>
                    <td>casefilescout@gmail.com</td>
                    <td>Casefile Scout</td>
                    <td>Northwind Risk</td>
                  </tr>
                  <tr>
                    <td>signals.archive@gmail.com</td>
                    <td>Signals Archive</td>
                    <td>Beacon Intel</td>
                  </tr>
                  <tr>
                    <td>press.handoff@gmail.com</td>
                    <td>Press Handoff</td>
                    <td>Briefing Co.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Column 2: Bulk Analysis Card */}
        <motion.div variants={itemVariants} className="playground-card" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Bulk Analysis
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Trace digital evidence, analyze threats, and map affiliations across public sources in bulk.
            </p>
            <div className="bulk-title-pill">Bulk search</div>
          </div>

          {/* Terminal Dashboard */}
          <div className="bulk-terminal-container" style={{ flexGrow: 1 }}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span style={{ backgroundColor: '#ff5f56' }} />
                <span style={{ backgroundColor: '#ffbd2e' }} />
                <span style={{ backgroundColor: '#27c93f' }} />
              </div>
              <span className="terminal-title">identity_loader.sh</span>
            </div>
            <div className="terminal-body">
              {bulkRows.map((row) => (
                <div key={row.id} className="terminal-row">
                  <span className="row-num">{row.id}</span>
                  <span className="row-email">{row.email}</span>
                  <span className={`row-status ${row.status.toLowerCase()}`}>
                    {row.status === 'Searching' ? (
                      <>
                        <span className="terminal-spinner" /> Searching
                      </>
                    ) : (
                      <>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Complete
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
