import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  Search, 
  Clock, 
  User, 
  LogOut, 
  Globe2, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  RotateCcw, 
  ChevronRight,
  Bell,
  ChevronDown,
  Lightbulb,
  ArrowRight,
  Edit2,
  Check
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { SearchExperience, type SearchReport } from '../../Search/SearchExperience';
import { WebsiteCoverage } from '../Coverage/WebsiteCoverage';
import { TOTAL_SUPPORTED_SITES } from '../../../data/supportedWebsites';
import { useToast } from '../../common/Toast';
import heroIllustration from '../../../assets/hero.png';

interface HomeProps {
  userEmail: string;
  onNavigateHome?: () => void;
  initialTab?: 'dashboard' | 'search' | 'history' | 'settings' | 'coverage';
  initialSearchEmail?: string;
  autoSearchOnMount?: boolean;
  onClearPendingSearch?: () => void;
}

interface UserDashboardData {
  planName?: string;
  creditsRemaining: number;
  totalCredits: number;
  searchesUsed: number;
  websitesScanned: number;
  accountsFound: number;
  history: SearchReport[];
}

export const Home: React.FC<HomeProps> = ({ 
  userEmail, 
  onNavigateHome,
  initialTab = 'dashboard',
  initialSearchEmail = '',
  autoSearchOnMount = false,
  onClearPendingSearch,
}) => {
  const { showToast } = useToast();

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = '#home';
    }
  };

  // Default to initialTab as active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'history' | 'settings' | 'coverage'>(initialTab);
  const [selectedReport, setSelectedReport] = useState<SearchReport | null>(null);

  // Search and navigation state
  const [dashboardEmailInput, setDashboardEmailInput] = useState('');
  const [activeSearchEmail, setActiveSearchEmail] = useState(initialSearchEmail);
  const [shouldAutoSearch, setShouldAutoSearch] = useState(autoSearchOnMount);
  const [searchTrigger, setSearchTrigger] = useState(autoSearchOnMount ? 1 : 0);
  const [isSubmittingSearch, setIsSubmittingSearch] = useState(false);

  // Sync if incoming search request changes
  useEffect(() => {
    if (initialSearchEmail) {
      setActiveSearchEmail(initialSearchEmail);
      setSelectedReport(null);
      setShouldAutoSearch(true);
      setSearchTrigger((prev) => prev + 1);
      setActiveTab('search');
      if (onClearPendingSearch) {
        onClearPendingSearch();
      }
    }
  }, [initialSearchEmail, onClearPendingSearch]);

  // Profile Information state with localStorage persistence
  const profileStorageKey = `mailverify_profile_${userEmail}`;
  const [displayName, setDisplayName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`mailverify_profile_${userEmail}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.displayName) return parsed.displayName;
      }
    } catch (e) {
      console.error(e);
    }
    return "Ankit Dhuriya";
  });

  const [displayEmail, setDisplayEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`mailverify_profile_${userEmail}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email) return parsed.email;
      }
    } catch (e) {
      console.error(e);
    }
    return userEmail || "ankitdhuriya281@gmail.com";
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNameInput, setEditNameInput] = useState(displayName);
  const [editEmailInput, setEditEmailInput] = useState(displayEmail);

  const userInitial = displayName.trim().charAt(0).toUpperCase() || "A";

  const handleStartEditProfile = () => {
    setEditNameInput(displayName);
    setEditEmailInput(displayEmail);
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setEditNameInput(displayName);
    setEditEmailInput(displayEmail);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameInput.trim()) {
      showToast("User name cannot be empty.", "error");
      return;
    }
    if (!editEmailInput.trim()) {
      showToast("Email address cannot be empty.", "error");
      return;
    }

    const newName = editNameInput.trim();
    const newEmail = editEmailInput.trim();

    setDisplayName(newName);
    setDisplayEmail(newEmail);
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify({
        displayName: newName,
        email: newEmail,
      }));
    } catch (err) {
      console.error(err);
    }
    setIsEditingProfile(false);
    showToast("Profile information updated successfully!", "success");
  };

  // Dashboard storage state
  const storageKey = `mailverify_dashboard_${userEmail}`;
  const [dashboardData, setDashboardData] = useState<UserDashboardData>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.history && parsed.history.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      creditsRemaining: 97,
      totalCredits: 100,
      searchesUsed: 3,
      websitesScanned: 364,
      accountsFound: 16,
      history: [
        {
          id: 'hist-1',
          email: 'ankitdhuriya281@gmail.com',
          total_sites: 122,
          registered_sites: 0,
          date: '2026-09-11T08:00:00.000Z',
          results: [],
        },
        {
          id: 'hist-2',
          email: 'sarah.jenkins@parallellabs.io',
          total_sites: 121,
          registered_sites: 12,
          date: '2026-09-11T06:30:00.000Z',
          results: [],
        },
        {
          id: 'hist-3',
          email: 'alex.rivera@techcorp.co',
          total_sites: 121,
          registered_sites: 4,
          date: '2026-09-10T14:15:00.000Z',
          results: [],
        }
      ],
    };
  });

  // Persist to localStorage whenever dashboardData changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(dashboardData));
    } catch (e) {
      console.error(e);
    }
  }, [dashboardData, storageKey]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('Logged out successfully', 'info');
    window.location.hash = '';
  };

  // Called when a new search completes in SearchExperience
  const handleSearchComplete = (report: SearchReport) => {
    setDashboardData((prev) => {
      const updatedHistory = [report, ...prev.history.filter((h) => h.email.toLowerCase() !== report.email.toLowerCase())].slice(0, 50);
      const newCredits = Math.max(0, prev.creditsRemaining - 1);
      return {
        ...prev,
        creditsRemaining: newCredits,
        searchesUsed: prev.searchesUsed + 1,
        websitesScanned: prev.websitesScanned + report.total_sites,
        accountsFound: prev.accountsFound + report.registered_sites,
        history: updatedHistory,
      };
    });
    setSelectedReport(report);
  };

  // Trigger search from Dashboard input and navigate to Search tab
  const handleDashboardVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = dashboardEmailInput.trim();
    if (!cleanEmail) {
      showToast('Please enter an email address to verify.', 'error');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (isSubmittingSearch) return;
    setIsSubmittingSearch(true);

    setActiveSearchEmail(cleanEmail);
    setSelectedReport(null);
    setShouldAutoSearch(true);
    setSearchTrigger((prev) => prev + 1);
    setActiveTab('search');

    setTimeout(() => {
      setIsSubmittingSearch(false);
    }, 400);
  };

  const handleSelectRecentSearch = (report: SearchReport, forceReRun = false) => {
    setActiveSearchEmail(report.email);
    if (forceReRun || !report.results || report.results.length === 0) {
      setSelectedReport(null);
      setShouldAutoSearch(true);
      setSearchTrigger((prev) => prev + 1);
    } else {
      setSelectedReport(report);
      setShouldAutoSearch(false);
    }
    setActiveTab('search');
  };

  const handleNavSearch = () => {
    setShouldAutoSearch(false);
    setActiveTab('search');
  };

  const handleResetSearch = () => {
    setActiveSearchEmail('');
    setSelectedReport(null);
    setShouldAutoSearch(false);
  };

  const formatDateDisplay = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '11/09/2026';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', position: 'relative' }}>
      {/* Global Background Grid */}
      <div className="bg-grid" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.6 }} />

      {/* Left Sidebar Menu */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        {/* Brand Logo - exactly 64px height matching top header */}
        <div
          onClick={handleNavigateHome}
          title="Go to MailVerify Home"
          style={{
            height: '64px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '2px solid #09090b',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
              <path d="M 28 48 L 42 62 L 72 32" stroke="#0066cc" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            MailVerify
          </span>
        </div>

        {/* Navigation Items (Flat, direct-menu structure) */}
        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'dashboard' ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
              color: activeTab === 'dashboard' ? '#0066cc' : 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: activeTab === 'dashboard' ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          {/* Search */}
          <button
            type="button"
            onClick={handleNavSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'search' ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
              color: activeTab === 'search' ? '#0066cc' : 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: activeTab === 'search' ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <Search size={18} />
            <span>Search</span>
          </button>

          {/* Recent Searches */}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'history' ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
              color: activeTab === 'history' ? '#0066cc' : 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: activeTab === 'history' ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <Clock size={18} />
            <span>Recent Searches</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                backgroundColor: activeTab === 'history' ? '#0066cc' : '#f1f5f9',
                color: activeTab === 'history' ? '#ffffff' : '#64748b',
                padding: '1px 7px',
                borderRadius: '100px',
                fontWeight: 600,
              }}
            >
              {dashboardData.history.length > 0 ? dashboardData.history.length : 3}
            </span>
          </button>

          {/* Account */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'settings' ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
              color: activeTab === 'settings' ? '#0066cc' : 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: activeTab === 'settings' ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={18} />
            <span>Account</span>
          </button>
        </nav>

        {/* Log Out fixed at the bottom separated by a divider */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#dc2626',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 15,
            boxSizing: 'border-box',
          }}
        >
          {/* Breadcrumb: Workspace / Dashboard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13.5px', color: 'var(--text-tertiary)' }}>Workspace /</span>
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {activeTab === 'history' ? 'Recent Searches' : activeTab === 'settings' ? 'Account' : activeTab === 'search' ? 'Search' : activeTab === 'coverage' ? 'Website Coverage' : 'Dashboard'}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Remaining Credits Pill: 97 / 100 Credits */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(0, 102, 204, 0.08)',
                border: '1px solid rgba(0, 102, 204, 0.2)',
                color: '#0066cc',
                fontSize: '12.5px',
                fontWeight: 600,
              }}
              title="Remaining email verification credits"
            >
              <Zap size={13} fill="#0066cc" />
              <span>{dashboardData.creditsRemaining} / {dashboardData.totalCredits} Credits</span>
            </div>

            {/* Notification Icon */}
            <button
              type="button"
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              title="Notifications"
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#0066cc',
                }}
              />
            </button>

            {/* User Profile Area: Avatar 'A', Ankit Dhuriya, Free Plan, Dropdown indicator */}
            <div
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              title="View Account"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#0066cc',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: '0 2px 6px rgba(0, 102, 204, 0.2)',
                  flexShrink: 0,
                }}
              >
                {userInitial}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {displayName}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.2 }}>
                  {dashboardData.planName ? `${dashboardData.planName} Plan` : 'Free Plan'}
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-tertiary)" style={{ marginLeft: '2px' }} />
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main style={{ padding: '32px', flexGrow: 1, position: 'relative', zIndex: 10, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="tab-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
              >
                {/* Hero Header Section: Directly integrated into page background */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    padding: '8px 4px 4px 4px',
                    position: 'relative',
                  }}
                >
                  <div style={{ maxWidth: '720px' }}>
                    <h1
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '30px',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                        letterSpacing: '-0.7px',
                      }}
                    >
                      Welcome back, {displayName} 👋
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      Enter any email address below to identify linked websites and accounts instantly.
                    </p>
                  </div>

                  {/* Mail/Email PNG Illustration directly visible on the right side */}
                  <div
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={heroIllustration}
                      alt="Mail verification illustration"
                      style={{
                        width: '160px',
                        height: 'auto',
                        maxHeight: '145px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 10px 24px rgba(0, 102, 204, 0.14))',
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Email Search Component (Primary Dashboard Action) */}
                <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                  <form
                    noValidate
                    onSubmit={handleDashboardVerify}
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
                      value={dashboardEmailInput}
                      onChange={(e) => setDashboardEmailInput(e.target.value)}
                      placeholder="Enter an email address (e.g. sarah.jenkins@gmail.com)"
                      disabled={isSubmittingSearch}
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
                      disabled={isSubmittingSearch}
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
                        cursor: isSubmittingSearch ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 102, 204, 0.25)',
                        transition: 'all 0.15s ease',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => !isSubmittingSearch && (e.currentTarget.style.backgroundColor = '#0052a3')}
                      onMouseLeave={(e) => !isSubmittingSearch && (e.currentTarget.style.backgroundColor = '#0066cc')}
                    >
                      <span>Verify</span>
                      <ArrowRight size={15} />
                    </button>
                  </form>

                  {/* Feature hints under search box */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '20px',
                      marginTop: '14px',
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      flexWrap: 'wrap',
                    }}
                  >
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
                </div>

                {/* Statistics: 4 Metric Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {/* Metric 1: Searches Used */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '20px 22px',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                    className="metric-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Searches Used
                      </span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(0, 102, 204, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={16} color="#0066cc" />
                      </div>
                    </div>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
                      {dashboardData.searchesUsed}
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Across all sessions
                    </span>
                  </div>

                  {/* Metric 2: Websites Scanned */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '20px 22px',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                    className="metric-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Websites Scanned
                      </span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(0, 102, 204, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe2 size={16} color="#0066cc" />
                      </div>
                    </div>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
                      {dashboardData.websitesScanned}
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      120+ platforms supported
                    </span>
                  </div>

                  {/* Metric 3: Accounts Found */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '20px 22px',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                    className="metric-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Accounts Found
                      </span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={16} color="#16a34a" />
                      </div>
                    </div>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: '#15803d', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
                      {dashboardData.accountsFound}
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Verified presence
                    </span>
                  </div>

                  {/* Metric 4: Plan Type */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '20px 22px',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                    className="metric-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Plan Type
                      </span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(0, 102, 204, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={16} color="#0066cc" />
                      </div>
                    </div>
                    <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px 0', letterSpacing: '-0.4px' }}>
                      {dashboardData.planName ? `${dashboardData.planName} Plan` : 'Free Developer'}
                    </p>
                    <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600, backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '100px', display: 'inline-block' }}>
                      Active
                    </span>
                  </div>
                </div>

                {/* Recent Searches & Pro Tip Side-by-Side */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 1fr)',
                    gap: '20px',
                    alignItems: 'stretch',
                  }}
                >
                  {/* Recent Searches Card */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      padding: '24px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                          Recent Searches
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                          Your latest email lookups and results
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0066cc',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        View all history <ArrowRight size={14} />
                      </button>
                    </div>

                    {/* Rows: exactly 3 items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {dashboardData.history.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectRecentSearch(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.borderColor = '#f1f5f9';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Search size={13} color="#475569" />
                            </div>
                            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.email}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: item.registered_sites > 0 ? '#15803d' : '#64748b',
                                backgroundColor: item.registered_sites > 0 ? '#dcfce7' : '#f1f5f9',
                                padding: '3px 9px',
                                borderRadius: '100px',
                              }}
                            >
                              {item.registered_sites} sites found
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                              {formatDateDisplay(item.date)}
                            </span>
                            <ChevronRight size={15} color="#94a3b8" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip Card (Clickable to open Website Coverage) */}
                  <div
                    onClick={() => setActiveTab('coverage')}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      padding: '24px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 102, 204, 0.4)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 102, 204, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      {/* Pill Badge */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '100px', backgroundColor: 'rgba(0, 102, 204, 0.1)', color: '#0066cc', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                        <Lightbulb size={13} />
                        <span>Pro Tip</span>
                      </div>

                      <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.4px', lineHeight: 1.3 }}>
                        Explore {TOTAL_SUPPORTED_SITES}+ supported websites
                      </h4>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        Discover all the websites and platforms MailVerify can scan to find linked accounts and online presence.
                      </p>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('coverage');
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#0066cc',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '9px 16px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0, 102, 204, 0.2)',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0052a3')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0066cc')}
                      >
                        <span>Learn More</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'search' && (
              <motion.div
                key="tab-search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
              >
                <SearchExperience
                  key={`${activeSearchEmail}-${searchTrigger}`}
                  initialEmail={activeSearchEmail}
                  initialReport={selectedReport}
                  autoSearch={shouldAutoSearch}
                  onSearchComplete={handleSearchComplete}
                  onResetSearch={handleResetSearch}
                  title="Email Verification Search"
                  subtitle="Deep-scan 120+ online services, social networks, and platforms to identify accounts linked to any email address."
                  compact={true}
                />
                </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="tab-history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Recent Searches Archive
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                    Full history of verified email lookups. Click any entry to inspect details or search again.
                  </p>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th style={{ padding: '14px 20px' }}>Target Email</th>
                        <th style={{ padding: '14px 20px' }}>Date</th>
                        <th style={{ padding: '14px 20px' }}>Websites Checked</th>
                        <th style={{ padding: '14px 20px' }}>Accounts Found</th>
                        <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.history.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                            No searches recorded yet. Run your first search above!
                          </td>
                        </tr>
                      ) : (
                        dashboardData.history.map((item) => (
                          <tr
                            key={item.id}
                            style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s ease' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {item.email}
                            </td>
                            <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                              {formatDateDisplay(item.date)}
                            </td>
                            <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                              {item.total_sites} websites
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: item.registered_sites > 0 ? '#15803d' : '#64748b',
                                  backgroundColor: item.registered_sites > 0 ? '#dcfce7' : '#f1f5f9',
                                  padding: '3px 8px',
                                  borderRadius: '100px',
                                }}
                              >
                                {item.registered_sites} found
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => handleSelectRecentSearch(item, true)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  backgroundColor: '#0066cc',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                <RotateCcw size={12} />
                                <span>Search Again</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '1050px' }}
              >
                <div>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Account & Plan Settings
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                    Manage your profile information, subscription tier, and security preferences.
                  </p>
                </div>

                {/* Top Row: Side-by-Side Profile & Subscription Cards with Equal Height */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '20px',
                    alignItems: 'stretch',
                    width: '100%',
                  }}
                >
                  {/* Profile Details Card */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      padding: '24px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                          Profile Information
                        </h3>
                        {!isEditingProfile ? (
                          <button
                            type="button"
                            onClick={handleStartEditProfile}
                            style={{
                              padding: '5px 12px',
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Edit2 size={13} color="#0066cc" /> Edit
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0066cc', backgroundColor: 'rgba(0, 102, 204, 0.08)', padding: '3px 8px', borderRadius: '6px' }}>
                            Editing
                          </span>
                        )}
                      </div>

                      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            User Name
                          </label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={isEditingProfile ? editNameInput : displayName}
                            onChange={(e) => setEditNameInput(e.target.value)}
                            required
                            placeholder="Enter your name"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: isEditingProfile ? '1.5px solid #0066cc' : '1px solid var(--border-color)',
                              backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc',
                              color: 'var(--text-primary)',
                              fontSize: '13.5px',
                              outline: 'none',
                              transition: 'all 0.15s ease',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            disabled={!isEditingProfile}
                            value={isEditingProfile ? editEmailInput : displayEmail}
                            onChange={(e) => setEditEmailInput(e.target.value)}
                            required
                            placeholder="Enter your email"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: isEditingProfile ? '1.5px solid #0066cc' : '1px solid var(--border-color)',
                              backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc',
                              color: 'var(--text-primary)',
                              fontSize: '13.5px',
                              outline: 'none',
                              transition: 'all 0.15s ease',
                            }}
                          />
                        </div>

                        {isEditingProfile && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={handleCancelEditProfile}
                              style={{
                                padding: '8px 14px',
                                backgroundColor: '#f4f4f5',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              style={{
                                padding: '8px 16px',
                                backgroundColor: '#0066cc',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <Check size={13} /> Save Changes
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>

                  {/* Plan Details Card */}
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      padding: '24px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                          Subscription & Credits
                        </h3>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#15803d', backgroundColor: '#dcfce7', padding: '4px 10px', borderRadius: '100px' }}>
                          Active
                        </span>
                      </div>

                      <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {dashboardData.planName ? `${dashboardData.planName} Plan` : 'Free Developer Plan'}
                        </h4>
                        <p style={{ margin: '0 0 12px 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          Includes {dashboardData.totalCredits} verification lookups per billing cycle
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Credits Available:</span>
                          <strong style={{ color: '#0066cc', fontSize: '14px' }}>
                            {dashboardData.creditsRemaining} / {dashboardData.totalCredits}
                          </strong>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, Math.max(0, Math.round((dashboardData.creditsRemaining / dashboardData.totalCredits) * 100)))}%`,
                              height: '100%',
                              backgroundColor: '#0066cc',
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { window.location.hash = '#pricing'; }}
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        backgroundColor: '#0066cc',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(0, 102, 204, 0.25)',
                      }}
                    >
                      Change Plan / View Pricing <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Full-Width Sign Out Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #fee2e2',
                    padding: '20px 24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    width: '100%',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: '#dc2626' }}>
                      Sign Out
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      Log out of your active session on this browser.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    Log Out from MailVerify
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'coverage' && (
              <WebsiteCoverage
                onBack={() => setActiveTab('dashboard')}
                onStartSearch={() => {
                  setShouldAutoSearch(false);
                  setActiveTab('search');
                }}
                accountsFound={dashboardData.accountsFound}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
