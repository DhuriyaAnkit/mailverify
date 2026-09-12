import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../../Header/Header';
import { Check, Sparkles, ArrowRight, Building2, X } from 'lucide-react';
import { useToast } from '../../common/Toast';
import './Pricing.css';

interface PricingProps {
  onNavigateDashboard?: () => void;
  onNavigateHome?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
}

export const Pricing: React.FC<PricingProps> = ({
  onNavigateDashboard,
  onNavigateHome,
  isLoggedIn = false,
  userEmail,
}) => {
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  // Track current plan from localStorage
  const storageKey = userEmail ? `mailverify_dashboard_${userEmail}` : null;
  const [currentPlan, setCurrentPlan] = useState<'Free' | 'Pro' | 'Business'>('Free');

  // Modal states
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactTeamSize, setContactTeamSize] = useState('5-15');
  const [contactCompany, setContactCompany] = useState('');
  const [contactNote, setContactNote] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Sync user's current plan
  useEffect(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.planName === 'Pro') {
            setCurrentPlan('Pro');
          } else if (parsed.planName === 'Business') {
            setCurrentPlan('Business');
          } else {
            setCurrentPlan('Free');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [storageKey]);

  // Handle plan upgrade execution
  const handleConfirmUpgradeToPro = () => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        let data = saved ? JSON.parse(saved) : {};
        data = {
          ...data,
          planName: 'Pro',
          totalCredits: 2500,
          creditsRemaining: (data.creditsRemaining || 97) + 2400,
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        setCurrentPlan('Pro');
        setIsUpgradeModalOpen(false);
        showToast('Successfully upgraded to MailVerify Pro! 2,500 credits are now active.', 'success');
      } catch (e) {
        console.error(e);
        showToast('Failed to update plan. Please try again.', 'error');
      }
    } else {
      setIsUpgradeModalOpen(false);
      window.location.hash = '#signup';
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactModalOpen(false);
    showToast('Inquiry sent! Our Enterprise Solutions team will contact you within 24 hours.', 'success');
    setContactCompany('');
    setContactNote('');
  };

  return (
    <div className="pricing-page-wrapper">
      {/* Dot Grid Background & Glow */}
      <div className="pricing-bg-grid" />
      <div className="pricing-glow" />

      {/* Pricing Header: activeNav="pricing" */}
      <Header 
        isLoggedIn={isLoggedIn} 
        onNavigateDashboard={onNavigateDashboard} 
        onNavigateHome={onNavigateHome}
        activeNav="pricing" 
      />

      <main className="pricing-main-content">
        <div className="container">
          
          {/* Main Hero Header */}
          <div className="pricing-hero-header">
            <div className="pricing-badge-pill">
              <Sparkles size={14} />
              <span>Transparent & Predictable Pricing</span>
            </div>
            
            <h1 className="pricing-title">
              Plans that fit your needs
            </h1>
            
            <p className="pricing-subtitle">
              Choose the right MailVerify plan for discovering online accounts and verifying email presence.
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="billing-toggle-container">
              <div className="billing-toggle-wrap">
                <button
                  type="button"
                  className={`billing-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`billing-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                </button>
              </div>

              <div className="discount-tag">
                <span>Save 20%</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="pricing-cards-grid">
            
            {/* Card 1: Free Plan */}
            <div className="pricing-card">
              <div className="card-top-section">
                <div className="plan-tier-header">
                  <h3 className="plan-tier-name">Free</h3>
                </div>
                <p className="plan-tagline">
                  Perfect for getting started with email verification and account discovery.
                </p>

                <div className="price-display-box">
                  <span className="price-currency">₹</span>
                  <span className="price-amount">0</span>
                  <span className="price-period">/ month</span>
                </div>
                <div className="price-billing-subtext">
                  Free forever • No credit card required
                </div>
              </div>

              {/* Action Button */}
              {isLoggedIn ? (
                currentPlan === 'Free' ? (
                  <button type="button" className="plan-cta-button btn-current" disabled>
                    <Check size={16} /> Current Plan
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="plan-cta-button btn-outline"
                    onClick={() => showToast('You are currently on an upgraded tier.', 'info')}
                  >
                    Included in {currentPlan}
                  </button>
                )
              ) : (
                <button 
                  type="button" 
                  className="plan-cta-button btn-outline"
                  onClick={() => window.location.hash = '#signup'}
                >
                  Get Started Free
                </button>
              )}

              <div className="plan-features-divider" />
              <div className="plan-features-label">What's included:</div>
              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span><strong>100 verification lookups</strong> per cycle</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span><strong>120+ supported platforms</strong> & websites</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Instant account presence detection</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Standard scan speed queue</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Basic CSV results export</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Community & documentation support</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Pro Plan (Recommended) */}
            <div className="pricing-card recommended">
              <div className="recommended-pill-badge">
                Most Popular
              </div>

              <div className="card-top-section">
                <div className="plan-tier-header">
                  <h3 className="plan-tier-name">Pro</h3>
                </div>
                <p className="plan-tagline">
                  For OSINT researchers, security analysts, and power users needing deep intelligence.
                </p>

                <div className="price-display-box">
                  <span className="price-currency">₹</span>
                  <span className="price-amount">
                    {billingCycle === 'yearly' ? '1,199' : '1,499'}
                  </span>
                  <span className="price-period">/ month</span>
                </div>
                <div className="price-billing-subtext">
                  {billingCycle === 'yearly' ? (
                    <span className="price-savings-note">Billed annually (₹14,388/yr) • Save ₹3,600/yr</span>
                  ) : (
                    <span>Billed monthly (₹1,499/mo)</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {isLoggedIn ? (
                currentPlan === 'Pro' ? (
                  <button type="button" className="plan-cta-button btn-current" disabled>
                    <Check size={16} /> Current Plan
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="plan-cta-button btn-primary-upgrade"
                    onClick={() => setIsUpgradeModalOpen(true)}
                  >
                    Upgrade Plan <ArrowRight size={16} />
                  </button>
                )
              ) : (
                <button 
                  type="button" 
                  className="plan-cta-button btn-primary-upgrade"
                  onClick={() => window.location.hash = '#signup'}
                >
                  Get Started with Pro <ArrowRight size={16} />
                </button>
              )}

              <div className="plan-features-divider" />
              <div className="plan-features-label">Everything in Free, plus:</div>
              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span><strong>2,500 verification lookups</strong> per cycle</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span><strong>High-speed priority queue</strong> (3x faster scans)</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span><strong>Full recovery clues</strong> & phone/hint extraction</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Advanced social profile link correlation</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Full CSV & structured JSON report export</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Priority email & chat customer support</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Developer API preview key included</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Business / Organization Plan */}
            <div className="pricing-card">
              <div className="card-top-section">
                <div className="plan-tier-header">
                  <h3 className="plan-tier-name">Business</h3>
                </div>
                <p className="plan-tagline">
                  For organizations, compliance teams, and agencies needing collaborative verification.
                </p>

                <div className="price-display-box">
                  <span className="price-currency">₹</span>
                  <span className="price-amount">
                    {billingCycle === 'yearly' ? '3,999' : '4,999'}
                  </span>
                  <span className="price-period">/ month</span>
                </div>
                <div className="price-billing-subtext">
                  {billingCycle === 'yearly' ? (
                    <span className="price-savings-note">Includes 5 team seats • Billed annually (Save 20%)</span>
                  ) : (
                    <span>Includes 5 team seats (₹799/seat/mo add-ons)</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {isLoggedIn && currentPlan === 'Business' ? (
                <button type="button" className="plan-cta-button btn-current" disabled>
                  <Check size={16} /> Current Plan
                </button>
              ) : (
                <button 
                  type="button" 
                  className="plan-cta-button btn-dark"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  Contact Sales <ArrowRight size={16} />
                </button>
              )}

              <div className="plan-features-divider" />
              <div className="plan-features-label">Everything in Pro, plus:</div>
              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span><strong>10,000+ verification lookups</strong> per cycle</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span><strong>Multi-seat workspace</strong> (5 members included)</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Shared team search history & centralized billing</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>High-throughput dedicated verification API</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Audit logging & role-based permissions</span>
                </li>
                <li className="plan-feature-item">
                  <span className="feature-check-icon"><Check size={12} strokeWidth={3} /></span>
                  <span>Dedicated account manager & 99.9% uptime SLA</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      {/* Upgrade Plan Modal */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="modal-overlay" onClick={() => setIsUpgradeModalOpen(false)}>
            <motion.div 
              className="modal-card" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0066cc', fontSize: '13px', fontWeight: 700 }}>
                  <Sparkles size={16} /> Upgrade to MailVerify Pro
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsUpgradeModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-header">
                <h3 className="modal-title">Confirm Plan Upgrade</h3>
                <p className="modal-desc">
                  Upgrade your account to unlock 2,500 verification credits, priority queues, and deep recovery clues.
                </p>
              </div>

              <div className="modal-plan-summary">
                <div className="modal-summary-row">
                  <span>Selected Tier:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>MailVerify Pro</strong>
                </div>
                <div className="modal-summary-row">
                  <span>Billing Frequency:</span>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--text-primary)' }}>{billingCycle}</span>
                </div>
                <div className="modal-summary-row">
                  <span>Included Credits:</span>
                  <strong style={{ color: '#0066cc' }}>2,500 Credits / Cycle</strong>
                </div>
                <div className="modal-summary-row total">
                  <span>Total Due Today:</span>
                  <span style={{ color: '#0066cc' }}>
                    {billingCycle === 'yearly' ? '₹14,388 / year' : '₹1,499 / month'}
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsUpgradeModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#0066cc', color: '#ffffff' }}
                  onClick={handleConfirmUpgradeToPro}
                >
                  Confirm & Upgrade Now →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Sales Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="modal-overlay" onClick={() => setIsContactModalOpen(false)}>
            <motion.div 
              className="modal-card" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#09090b', fontSize: '13px', fontWeight: 700 }}>
                  <Building2 size={16} /> Enterprise Solutions
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsContactModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-header">
                <h3 className="modal-title">Contact Enterprise Sales</h3>
                <p className="modal-desc">
                  Tell us about your team's verification scale and our identity specialists will reach out promptly.
                </p>
              </div>

              <form onSubmit={handleContactSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    defaultValue={userEmail || 'work@company.com'}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Team Size / Projected Monthly Lookups
                  </label>
                  <select
                    value={contactTeamSize}
                    onChange={(e) => setContactTeamSize(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', backgroundColor: '#ffffff' }}
                  >
                    <option value="5-15">5 - 15 Members (10k - 50k lookups)</option>
                    <option value="15-50">15 - 50 Members (50k - 200k lookups)</option>
                    <option value="50+">50+ Members (200k+ enterprise lookups)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Specific Requirements or Custom Targets
                  </label>
                  <textarea
                    rows={3}
                    placeholder="We need webhook integration and custom platform scraping..."
                    value={contactNote}
                    onChange={(e) => setContactNote(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsContactModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ backgroundColor: '#09090b', color: '#ffffff' }}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
