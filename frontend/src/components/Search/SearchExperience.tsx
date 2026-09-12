import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ArrowRight, Loader2, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { checkEmail, type HoleheSiteResult, type CheckEmailResponse } from '../../lib/api';
import { WebsiteCard } from './WebsiteCard';
import { useToast } from '../common/Toast';

export interface SearchReport {
  id: string;
  email: string;
  total_sites: number;
  registered_sites: number;
  date: string;
  results: HoleheSiteResult[];
}

interface SearchExperienceProps {
  initialEmail?: string;
  initialReport?: SearchReport | null;
  autoSearch?: boolean;
  onSearchComplete?: (report: SearchReport) => void;
  onResetSearch?: () => void;
  onInterceptSearch?: (email: string) => boolean | void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const SearchExperience: React.FC<SearchExperienceProps> = ({
  initialEmail = '',
  initialReport = null,
  autoSearch = false,
  onSearchComplete,
  onResetSearch,
  onInterceptSearch,
  title,
  subtitle,
  compact = false,
}) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState(initialEmail || initialReport?.email || '');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progressDone, setProgressDone] = useState(0);
  const [totalWebsites, setTotalWebsites] = useState(120);
  const [results, setResults] = useState<HoleheSiteResult[] | null>(initialReport?.results || null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'found' | 'notfound' | 'ratelimited'>('all');
  const [lastSearchedEmail, setLastSearchedEmail] = useState(initialReport?.email || '');

  const progressIntervalRef = useRef<number | null>(null);
  const autoSearchFiredForRef = useRef<string | null>(null);

  // Sync if initialEmail changes
  useEffect(() => {
    if (initialEmail && initialEmail !== email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Sync if initialReport changes
  useEffect(() => {
    if (initialReport) {
      setEmail(initialReport.email);
      setLastSearchedEmail(initialReport.email);
      setResults(initialReport.results);
      setTotalWebsites(initialReport.total_sites);
    }
  }, [initialReport]);

  // Clean up progress interval
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const executeSearch = useCallback(async (targetEmail: string) => {
    const cleanEmail = targetEmail.trim();
    if (!cleanEmail) {
      showToast('Please enter an email address to verify.', 'error');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (isSearching) return;

    setErrorMessage(null);
    setIsSearching(true);
    setProgressDone(5);
    setResults(null);
    setLastSearchedEmail(cleanEmail);

    // Live progress simulation while request is active
    let currentDone = 5;
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = window.setInterval(() => {
      currentDone += Math.floor(Math.random() * 8) + 3;
      if (currentDone >= 115) {
        currentDone = 115;
      }
      setProgressDone(currentDone);
    }, 400);

    try {
      const data: CheckEmailResponse = await checkEmail(cleanEmail, 15);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      setProgressDone(data.total_sites);
      setTotalWebsites(data.total_sites);
      setResults(data.results);
      setIsSearching(false);

      const report: SearchReport = {
        id: Math.random().toString(36).substring(2, 9),
        email: cleanEmail,
        total_sites: data.total_sites,
        registered_sites: data.registered_sites,
        date: new Date().toISOString(),
        results: data.results,
      };

      if (onSearchComplete) {
        onSearchComplete(report);
      }

      showToast(`Scan complete: found on ${data.registered_sites} of ${data.total_sites} websites!`, 'success');
    } catch (err: any) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsSearching(false);
      const msg = err.message || 'Failed to check email. Ensure backend is running.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    }
  }, [isSearching, onSearchComplete, showToast]);

  // Handle automatic search upon navigation
  useEffect(() => {
    if (autoSearch && initialEmail && autoSearchFiredForRef.current !== initialEmail) {
      autoSearchFiredForRef.current = initialEmail;
      executeSearch(initialEmail);
    }
  }, [autoSearch, initialEmail, executeSearch]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      showToast('Please enter an email address to verify.', 'error');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (onInterceptSearch) {
      const handled = onInterceptSearch(cleanEmail);
      if (handled !== false) {
        return;
      }
    }

    executeSearch(cleanEmail);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!results || results.length === 0) return;

    const headers = ['Website', 'Domain', 'Status', 'Recovery Email', 'Phone Number'];
    const rows = results.map((r) => [
      `"${r.name}"`,
      `"${r.domain || ''}"`,
      `"${r.exists ? 'FOUND' : r.rateLimit ? 'RATE_LIMITED' : 'NOT_FOUND'}"`,
      `"${r.emailrecovery || ''}"`,
      `"${r.phoneNumber || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mailverify_${lastSearchedEmail.replace(/[^a-zA-Z0-9]/g, '_')}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report exported as CSV successfully', 'success');
  };

  // Reset search state back to initial/fresh state
  const handleReset = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setEmail('');
    setLastSearchedEmail('');
    setResults(null);
    setProgressDone(0);
    setIsSearching(false);
    setErrorMessage(null);
    setActiveFilter('all');
    autoSearchFiredForRef.current = null;
    if (onResetSearch) {
      onResetSearch();
    }
  };

  // Filter calculations
  const foundResults = results ? results.filter((r) => r.exists) : [];
  const notFoundResults = results ? results.filter((r) => !r.exists && !r.rateLimit) : [];
  const rateLimitedResults = results ? results.filter((r) => r.rateLimit) : [];

  const filteredList = results
    ? activeFilter === 'found'
      ? foundResults
      : activeFilter === 'notfound'
      ? notFoundResults
      : activeFilter === 'ratelimited'
      ? rateLimitedResults
      : results
    : [];

  return (
    <div style={{ width: '100%', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Optional Title / Header if provided */}
      {title && (
        <div style={{ textAlign: 'center', marginBottom: compact ? '20px' : '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: compact ? '24px' : '36px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.8px' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Google-like Single Big Search Bar */}
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '100px',
            border: '2px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03)',
            padding: '6px 8px 6px 20px',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
          className="google-search-bar"
        >
          <Search size={20} color="#94a3b8" style={{ marginRight: '12px', flexShrink: 0 }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter an email address (e.g. sarah.jenkins@gmail.com)"
            required
            disabled={isSearching}
            style={{
              flexGrow: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15.5px',
              color: 'var(--text-primary)',
              backgroundColor: 'transparent',
              padding: '6px 0',
            }}
          />

          <button
            type="submit"
            disabled={isSearching}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0066cc',
              color: '#ffffff',
              border: 'none',
              borderRadius: '100px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSearching ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(0, 102, 204, 0.25)',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => !isSearching && (e.currentTarget.style.backgroundColor = '#0052a3')}
            onMouseLeave={(e) => !isSearching && (e.currentTarget.style.backgroundColor = '#0066cc')}
          >
            {isSearching ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying…</span>
              </>
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Feature hints under search box */}
        {!isSearching && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '14px',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            flexWrap: 'wrap',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0066cc' }} />
              Find linked accounts
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0066cc' }} />
              Scan 120+ platforms
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0066cc' }} />
              Get accurate results
            </span>
          </div>
        )}

        {/* Live progress line while searching */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '16px', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader2 size={14} className="animate-spin" color="#0066cc" />
                Checking {totalWebsites} websites…
              </span>
              <span style={{ color: '#0066cc' }}>{progressDone} done</span>
            </div>
            {/* Progress track */}
            <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
              <motion.div
                style={{
                  height: '100%',
                  backgroundColor: '#0066cc',
                  borderRadius: '100px',
                  width: `${Math.min(100, Math.round((progressDone / totalWebsites) * 100))}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Error state banner */}
        {errorMessage && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13.5px', color: '#991b1b', fontWeight: 500 }}>
                {errorMessage}
              </span>
            </div>
            <button
              type="button"
              onClick={() => executeSearch(email)}
              style={{
                padding: '6px 14px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Retry
            </button>
          </motion.div>
        )}
      </div>

      {/* Results View */}
      {results && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ marginTop: '36px' }}
        >
          {/* Summary Line and Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Sparkles size={18} color="#0066cc" />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Found on {foundResults.length} of {results.length} websites
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                Target: <strong style={{ color: 'var(--text-primary)' }}>{lastSearchedEmail}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '100px' }}>
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  style={{
                    border: 'none',
                    borderRadius: '100px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeFilter === 'all' ? '#ffffff' : 'transparent',
                    color: activeFilter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    boxShadow: activeFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  All ({results.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('found')}
                  style={{
                    border: 'none',
                    borderRadius: '100px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeFilter === 'found' ? '#ffffff' : 'transparent',
                    color: activeFilter === 'found' ? '#15803d' : 'var(--text-secondary)',
                    boxShadow: activeFilter === 'found' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Found ({foundResults.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('notfound')}
                  style={{
                    border: 'none',
                    borderRadius: '100px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeFilter === 'notfound' ? '#ffffff' : 'transparent',
                    color: activeFilter === 'notfound' ? '#64748b' : 'var(--text-secondary)',
                    boxShadow: activeFilter === 'notfound' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Not Found ({notFoundResults.length})
                </button>
                {rateLimitedResults.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter('ratelimited')}
                    style={{
                      border: 'none',
                      borderRadius: '100px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: activeFilter === 'ratelimited' ? '#ffffff' : 'transparent',
                      color: activeFilter === 'ratelimited' ? '#b45309' : 'var(--text-secondary)',
                      boxShadow: activeFilter === 'ratelimited' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Rate Limited ({rateLimitedResults.length})
                  </button>
                )}
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                title="Export results to CSV"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '100px',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <Download size={14} color="#0066cc" />
                <span>Export</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                title="Reset search"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '100px',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredList.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>
                No websites matched the selected filter.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '12px',
              }}
            >
              {filteredList.map((r) => (
                <WebsiteCard key={r.name} result={r} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
