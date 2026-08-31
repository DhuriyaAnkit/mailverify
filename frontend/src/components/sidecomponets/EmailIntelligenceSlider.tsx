import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Award, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  User,
  Calendar
} from 'lucide-react';

function extractOthers(r: HoleheSiteResult): { fullName: string | null; createdDate: string | null; profileUrl: string | null } {
  const o = r.others;
  if (!o || typeof o !== 'object') return { fullName: null, createdDate: null, profileUrl: null };

  let fullName: string | null = null;
  let createdDate: string | null = null;
  let profileUrl: string | null = null;

  // Gravatar: "FullName" contains "DisplayName / profileUrl"
  if (typeof o.FullName === 'string') {
    const parts = o.FullName.split(' / ');
    fullName = parts[0] || null;
    if (parts.length > 1 && parts[1]?.startsWith('http')) {
      profileUrl = parts[1];
    }
    // Odnoklassniki: "FullName" contains "masked_name; profile_info; registration_date"
    // If it has semicolons, don't parse as name — leave as raw info
    if (o.FullName.includes(';')) {
      fullName = null;
      createdDate = o.FullName;
    }
  }

  if (typeof o['Date, time of the creation'] === 'string') {
    createdDate = o['Date, time of the creation'] as string;
  }

  return { fullName, createdDate, profileUrl };
}
import { checkEmail, type HoleheSiteResult } from '../../lib/api';

interface CardItem {
  id: string;
  category: 'professional' | 'social' | 'security';
  element: React.ReactNode;
}

export const EmailIntelligenceSlider: React.FC = () => {
  const [searchInput, setSearchInput] = useState('sarah.jenkins@parallellabs.io');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<HoleheSiteResult[] | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'professional' | 'social' | 'security'>('all');
  const [resultsView, setResultsView] = useState<'all' | 'registered' | 'notfound' | 'ratelimited'>('all');

  const allCards: CardItem[] = [
    {
      id: 'linkedin',
      category: 'professional',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="card-header-bar">
            <span className="platform-tag linkedin-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn Profile
            </span>
          </div>
          <div className="card-profile-section">
            <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #ff7b00 0%, #ffae00 100%)' }}>SJ</div>
            <div className="card-profile-info">
              <h4>Sarah Jenkins</h4>
              <p className="card-profile-role">Senior Product Designer</p>
              <p className="card-profile-meta"><Briefcase size={12} /> Parallel Labs</p>
              <p className="card-profile-meta"><MapPin size={12} /> San Francisco, CA</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'employment',
      category: 'professional',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(1.2deg)' }}>
          <div className="card-header-bar">
            <span className="platform-tag"><Briefcase size={14} /> Employment</span>
          </div>
          <div className="history-item">
            <h5 className="history-title">Senior Product Designer</h5>
            <p className="history-company">Parallel Labs</p>
            <p className="history-duration">Jan 2021 – Present (5 yrs 6 mos)</p>
          </div>
        </div>
      )
    },
    {
      id: 'education',
      category: 'professional',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(-0.8deg)' }}>
          <div className="card-header-bar">
            <span className="platform-tag"><GraduationCap size={14} /> Education</span>
          </div>
          <div className="history-item">
            <h5 className="history-title">BFA Graphic Design</h5>
            <p className="history-company">Rhode Island School of Design (RISD)</p>
            <p className="history-duration">Class of 2020</p>
          </div>
        </div>
      )
    },
    {
      id: 'google',
      category: 'social',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(0.5deg)' }}>
          <div className="card-header-bar">
            <span className="platform-tag google-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
              Google Profile
            </span>
          </div>
          <div className="card-profile-section">
            <div className="card-profile-info" style={{ marginLeft: 0 }}>
              <h5 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Google Maps Profile</h5>
              <p className="card-profile-role">Google User • Local Guide</p>
              <p className="card-profile-meta" style={{ marginTop: '8px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
                Last Updated: 2 days ago
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'breach',
      category: 'security',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(-1.2deg)', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
          <div className="card-header-bar">
            <span className="platform-tag" style={{ color: '#dc2626' }}>
              <ShieldAlert size={14} /> Data Breach Detection
            </span>
          </div>
          <div className="breach-alert-container">
            <h5 style={{ color: '#991b1b', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Found in 3 Breaches</h5>
            <ul className="breaches-list">
              <li><strong>LinkedIn Leak</strong> (2021)</li>
              <li><strong>Adobe Leak</strong> (2019)</li>
              <li><strong>Dropbox Leak</strong> (2016)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'skills',
      category: 'professional',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(0.8deg)' }}>
          <div className="card-header-bar">
            <span className="platform-tag"><Award size={14} /> Skills</span>
          </div>
          <div className="skills-tags-container">
            {['Figma', 'React', 'User Research', 'Design Systems', 'Accessibility'].map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'github',
      category: 'social',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(-0.8deg)' }}>
          <div className="card-header-bar">
            <span className="platform-tag github-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              GitHub Profile
            </span>
          </div>
          <div className="card-profile-section">
            <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #09090b 0%, #27272a 100%)' }}>GH</div>
            <div className="card-profile-info">
              <h4>Sarah Jenkins</h4>
              <p className="card-profile-role">@sarahj-design</p>
              <p className="card-profile-meta"><Briefcase size={12} /> Parallel Labs</p>
              <p className="card-profile-meta"><TrendingUp size={12} /> 1,420 followers • 32 public repos</p>
            </div>
          </div>
          <a href="#github" className="card-action-link">View Profile <ArrowRight size={12} /></a>
        </div>
      )
    },
    {
      id: 'tiktok',
      category: 'social',
      element: (
        <div className="profile-slide-card" style={{ transform: 'rotate(1deg)' }}>
          <div className="card-header-bar">
            <span className="platform-tag tiktok-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.41-.47-.59-.73v7.02c0 3.82-2.31 7.23-5.91 8.23-3.6 1.01-7.55-.42-9.45-3.69-1.9-3.27-1.37-7.61 1.25-10.3 2.22-2.29 5.83-2.77 8.58-1.12.02.01.04.03.05.04v4.1c-1.42-.9-3.32-.78-4.59.34-1.28 1.11-1.6 3-0.78 4.45.82 1.45 2.65 2.19 4.23 1.75 1.58-.44 2.62-1.92 2.62-3.56V0l.02.02z"/>
              </svg>
              TikTok Profile
            </span>
          </div>
          <div className="card-profile-section">
            <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #f02fc2 0%, #6094ea 100%)' }}>TT</div>
            <div className="card-profile-info">
              <h4>Sarah Jenkins</h4>
              <p className="card-profile-role">@sarahcreates</p>
              <p className="card-profile-meta"><TrendingUp size={12} /> 250K Followers • 5.2M Likes</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const [orderedIndices, setOrderedIndices] = useState<number[]>(
    allCards.map((_, idx) => idx)
  );

  const filteredIndices = allCards
    .map((card, idx) => ({ card, originalIdx: idx }))
    .filter(item => activeFilter === 'all' || item.card.category === activeFilter)
    .map(item => item.originalIdx);

  useEffect(() => {
    if (filteredIndices.length < 3) return;

    const timer = setInterval(() => {
      if (!isSearching) {
        setOrderedIndices((prev) => {
          const nextOrder = [...prev];
          let foundIdx = -1;
          for (let i = 0; i < nextOrder.length; i++) {
            if (filteredIndices.includes(nextOrder[i])) {
              foundIdx = i;
              break;
            }
          }
          
          if (foundIdx !== -1) {
            const item = nextOrder.splice(foundIdx, 1)[0];
            nextOrder.push(item);
          }
          return nextOrder;
        });
      }
    }, 3800);

    return () => clearInterval(timer);
  }, [isSearching, activeFilter, filteredIndices]);

  const handleFilterChange = (filter: 'all' | 'professional' | 'social' | 'security') => {
    setActiveFilter(filter);
    setOrderedIndices(allCards.map((_, idx) => idx));
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput || isSearching) return;

    setIsSearching(true);
    setSearchResults(null);

    try {
      const data = await checkEmail(searchInput, 8);
      setSearchResults(data.results);
    } catch (err) {
      console.error("Email check failed:", err);
      setSearchResults([]);
    }

    setIsSearching(false);
    setOrderedIndices(allCards.map((_, idx) => idx));
  };

  const registeredCount = searchResults?.filter(r => r.exists).length ?? 0;
  const sitesChecked = searchResults?.length ?? 0;
  const rateLimitCount = searchResults?.filter(r => r.rateLimit).length ?? 0;
  const hasResults = searchResults !== null;

  const displayResults = (searchResults ?? []).filter(r => {
    if (resultsView === 'registered') return r.exists;
    if (resultsView === 'notfound') return !r.exists && !r.rateLimit;
    if (resultsView === 'ratelimited') return r.rateLimit;
    return true;
  });

  const renderIndices = orderedIndices
    .filter(idx => filteredIndices.includes(idx))
    .slice(0, 3);

  return (
    <>
      <section className="intelligence-slider-section">
        <div className="bg-grid" />
        <div className="slider-container slider-grid" style={hasResults && !isSearching ? { paddingBottom: '120px' } : undefined}>
          
          {/* Left Column */}
          <div className="slider-left">
            <div className="slider-badge">
              <Award size={14} /> Profile Intel Engine
            </div>
            
            <h1 className="slider-heading text-gradient">
              Know More Than Just an Email
            </h1>
            
            <p className="slider-subtitle">
              Discover and organize publicly available information associated with an email address into a structured professional profile—powered by AI, delivered in seconds.
            </p>

            <form onSubmit={handleSearchSubmit} className="slider-search-box">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter email e.g. sarah.jenkins@parallel.io"
                  className="search-input"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="slider-search-btn"
              >
                {isSearching ? 'Searching...' : 'Search Email'}
              </button>
            </form>

            {hasResults && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{ marginTop: '24px' }}
              >
                <div className="results-summary-inline">
                  <span className="results-summary-stat">
                    <CheckCircle size={13} style={{ color: 'var(--success-color)' }} />
                    <strong>{registeredCount}</strong> registered
                  </span>
                  <span className="results-summary-stat">
                    <strong>{sitesChecked}</strong> sites checked
                  </span>
                  {rateLimitCount > 0 && (
                    <span className="results-summary-stat">
                      <AlertTriangle size={13} style={{ color: '#ca8a04' }} />
                      <strong>{rateLimitCount}</strong> rate‑limited
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {!hasResults && (
              <div className="preset-container">
                <span className="preset-label">Filter Preview:</span>
                <div className="preset-pills">
                  {(['all', 'professional', 'social', 'security'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => handleFilterChange(filter)}
                      className={`preset-pill ${activeFilter === filter ? 'active' : ''}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="slider-right">
            <div className="cards-viewport">
              <div className="viewport-glow" style={{ background: 'linear-gradient(135deg, #0066cc 0%, #aa3bff 100%)' }} />

              <div className="email-status-pill">
                {isSearching ? (
                  <span className="status-dot animate-pulse" />
                ) : hasResults ? (
                  <CheckCircle size={14} style={{ color: 'var(--success-color)' }} />
                ) : (
                  <span className="status-dot animate-pulse" />
                )}
                <span className="status-email">{searchInput}</span>
              </div>

              <AnimatePresence mode="popLayout">
                {hasResults && !isSearching ? (
                  /* Show top 3 registered sites as cards */
                  <motion.div
                    key="results-cards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="cards-vertical-stack"
                    >
                      {(searchResults ?? [])
                        .filter(r => r.exists)
                        .slice(0, 3)
                        .map((r, stackPos) => (
                          <motion.div
                            key={r.name}
                            variants={cardVariants}
                            layout
                            style={{ 
                              width: '100%', 
                              zIndex: 10 + stackPos,
                              marginTop: stackPos > 0 ? '-35px' : '0px'
                            }}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ y: { duration: 3 + stackPos * 0.4, repeat: Infinity, ease: "easeInOut" } }}
                          >
                            {renderResultCard(r)}
                          </motion.div>
                        ))}
                      {(searchResults ?? []).filter(r => r.exists).length === 0 && (
                        <motion.div
                          variants={cardVariants}
                          style={{ width: '100%' }}
                        >
                          <div className="profile-slide-card" style={{ transform: 'rotate(0deg)' }}>
                            <div className="card-header-bar">
                              <span className="platform-tag">
                                <Globe size={14} /> Scan Complete
                              </span>
                            </div>
                            <div className="card-profile-section">
                              <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #71717a 0%, #a1a1aa 100%)' }}>--</div>
                              <div className="card-profile-info">
                                <h4>No accounts found</h4>
                                <p className="card-profile-role">Checked {sitesChecked} sites</p>
                                {rateLimitCount > 0 && (
                                  <p className="card-profile-meta">
                                    <AlertTriangle size={12} /> {rateLimitCount} sites rate‑limited
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ) : (
                  /* Demo cards when no search yet */
                  <motion.div
                    key={activeFilter + '-' + renderIndices.join(',')}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="cards-vertical-stack"
                  >
                    {renderIndices.map((idx, stackPos) => (
                      <motion.div
                        key={allCards[idx].id}
                        variants={cardVariants}
                        layout
                        style={{ 
                          width: '100%', 
                          zIndex: 10 + stackPos,
                          marginTop: stackPos > 0 ? '-35px' : '0px'
                        }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ y: { duration: 3 + stackPos * 0.4, repeat: Infinity, ease: "easeInOut" } }}
                      >
                        {allCards[idx].element}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Full Results Panel — slides down below hero */}
      <AnimatePresence>
        {hasResults && !isSearching && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="results-panel"
          >
            <div className="container">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Filter tabs */}
                <div className="results-filter-tabs">
                  {([
                    { key: 'all', label: 'All Sites', count: sitesChecked },
                    { key: 'registered', label: 'Registered', count: registeredCount },
                    { key: 'notfound', label: 'Not Found', count: sitesChecked - registeredCount - rateLimitCount },
                    { key: 'ratelimited', label: 'Rate-Limited', count: rateLimitCount },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setResultsView(tab.key)}
                      className={`results-filter-tab ${resultsView === tab.key ? 'active' : ''}`}
                    >
                      {tab.label} <span className="results-filter-count">{tab.count}</span>
                    </button>
                  ))}
                </div>

                {/* Results Grid using profile-slide-card template */}
                <div className="results-cards-grid">
                  {displayResults.map((r, i) => (
                    <motion.div
                      key={r.name + i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.015, duration: 0.3 }}
                    >
                      {renderResultCard(r)}
                    </motion.div>
                  ))}
                </div>

                {displayResults.length === 0 && (
                  <div className="results-empty">
                    No results match this filter.
                  </div>
                )}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

function renderResultCard(r: HoleheSiteResult) {
  const initials = r.name.substring(0, 2).toUpperCase();
  const gradColors = r.exists
    ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
    : r.rateLimit
      ? 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)'
      : 'linear-gradient(135deg, #a1a1aa 0%, #71717a 100%)';

  const extra = extractOthers(r);

  const headerTagStyle: React.CSSProperties = r.exists
    ? { color: 'var(--success-color)', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }
    : r.rateLimit
      ? { color: '#ca8a04', background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }
      : {};

  return (
    <div className="profile-slide-card" style={{ transform: `rotate(${(Math.random() * 1.4 - 0.7).toFixed(2)}deg)` }}>
      <div className="card-header-bar">
        <span className="platform-tag" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '3px 10px',
          borderRadius: '6px',
          ...headerTagStyle
        }}>
          <Globe size={14} />
          {r.domain || r.name}
          {r.exists && <CheckCircle size={12} style={{ color: 'var(--success-color)', marginLeft: '2px' }} />}
          {r.rateLimit && <AlertTriangle size={12} style={{ color: '#ca8a04', marginLeft: '2px' }} />}
        </span>
      </div>
      <div className="card-profile-section">
        <div className="card-avatar" style={{ background: gradColors }}>
          {initials}
        </div>
        <div className="card-profile-info">
          <h4 style={{ textTransform: 'capitalize' }}>{r.name}</h4>
          <p className="card-profile-role">
            {r.exists ? 'Account Found' : r.rateLimit ? 'Rate Limited' : 'No Account'}
          </p>
          {extra.fullName && (
            <p className="card-profile-meta">
              <User size={12} /> {extra.fullName}
            </p>
          )}
          {r.emailrecovery && (
            <p className="card-profile-meta">
              <Mail size={12} /> {r.emailrecovery}
            </p>
          )}
          {r.phoneNumber && (
            <p className="card-profile-meta">
              <Phone size={12} /> {r.phoneNumber}
            </p>
          )}
          {extra.createdDate && (
            <p className="card-profile-meta">
              <Calendar size={12} /> {extra.createdDate}
            </p>
          )}
          {extra.profileUrl && (
            <a href={extra.profileUrl} target="_blank" rel="noopener noreferrer" className="card-action-link">
              View Profile <ArrowRight size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.94
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring' as const,
      stiffness: 90,
      damping: 14
    }
  },
  exit: { 
    opacity: 0, 
    y: -40, 
    scale: 0.96,
    transition: { 
      duration: 0.35, 
      ease: 'easeInOut' as const
    } 
  }
};