import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, 
  Layers, 
  ShieldCheck, 
  Search, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  X 
} from 'lucide-react';
import { 
  supportedWebsites, 
  TOTAL_SUPPORTED_SITES, 
  type SupportedPlatform, 
  type PlatformCategory 
} from '../../../data/supportedWebsites';

interface WebsiteCoverageProps {
  onBack: () => void;
  onStartSearch: () => void;
  accountsFound?: number;
}

const CATEGORY_TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Social: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  Professional: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  Developer: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Community: { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
  Other: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
};

const PlatformCard: React.FC<{ platform: SupportedPlatform }> = ({ platform }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const domain = platform.domain || `${platform.id}.com`;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const tagColor = CATEGORY_TAG_COLORS[platform.category] || CATEGORY_TAG_COLORS.Other;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: isHovered ? '1px solid rgba(0, 102, 204, 0.4)' : '1px solid var(--border-color)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: isHovered 
          ? '0 8px 24px rgba(0, 102, 204, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)' 
          : '0 1px 3px rgba(0, 0, 0, 0.02)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
    >
      {/* Top row: Logo + Platform Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Logo Container */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'transform 0.2s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {!imgError ? (
            <img
              src={faviconUrl}
              alt={platform.name}
              onError={() => setImgError(true)}
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              loading="lazy"
            />
          ) : (
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0066cc', textTransform: 'uppercase' }}>
              {platform.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Name & Domain */}
        <div style={{ minWidth: 0, flexGrow: 1 }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: isHovered ? '#0066cc' : 'var(--text-primary)',
              margin: '0 0 2px 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.15s ease',
            }}
            title={platform.name}
          >
            {platform.name}
          </h4>
          <span
            style={{
              fontSize: '11.5px',
              color: 'var(--text-tertiary)',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {platform.domain}
          </span>
        </div>
      </div>

      {/* Bottom row: Category badge & Supported status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid #f8fafc' }}>
        {/* Category Pill */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '100px',
            backgroundColor: tagColor.bg,
            color: tagColor.text,
            border: `1px solid ${tagColor.border}`,
          }}
        >
          {platform.category}
        </span>

        {/* Supported Indicator */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#15803d',
            backgroundColor: '#dcfce7',
            padding: '2px 8px',
            borderRadius: '100px',
          }}
        >
          <Check size={12} strokeWidth={3} />
          <span>Supported</span>
        </span>
      </div>
    </div>
  );
};

export const WebsiteCoverage: React.FC<WebsiteCoverageProps> = ({
  onBack,
  onStartSearch,
  accountsFound = 16,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlatformCategory>('All');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: supportedWebsites.length,
      Social: 0,
      Professional: 0,
      Developer: 0,
      Community: 0,
      Other: 0,
    };
    supportedWebsites.forEach((site) => {
      if (counts[site.category] !== undefined) {
        counts[site.category]++;
      } else {
        counts.Other++;
      }
    });
    return counts;
  }, []);

  // Filtered platforms
  const filteredPlatforms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return supportedWebsites.filter((site) => {
      // Category filter
      if (selectedCategory !== 'All' && site.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (query) {
        const matchesName = site.name.toLowerCase().includes(query);
        const matchesRaw = site.rawName.toLowerCase().includes(query);
        const matchesDomain = site.domain.toLowerCase().includes(query);
        const matchesCategory = site.category.toLowerCase().includes(query);
        return matchesName || matchesRaw || matchesDomain || matchesCategory;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const categories: PlatformCategory[] = ['All', 'Social', 'Professional', 'Developer', 'Community', 'Other'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}
    >
      {/* Top Bar: Back button and Quick CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          onClick={onStartSearch}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#0066cc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 18px',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 102, 204, 0.2)',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0052a3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0066cc')}
        >
          <span>Verify an Email Now</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Page Header */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '32px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.8px',
            margin: '0 0 6px 0',
          }}
        >
          Website Coverage
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Explore all platforms supported by MailVerify
        </p>
      </div>

      {/* 3 Summary Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Stat 1: Websites Covered */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '22px 24px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 102, 204, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Globe2 size={24} color="#0066cc" />
          </div>
          <div>
            <h3
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 2px 0',
                letterSpacing: '-0.6px',
              }}
            >
              {TOTAL_SUPPORTED_SITES}+ Websites Covered
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Platforms currently supported
            </p>
          </div>
        </div>

        {/* Stat 2: Platform Types */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '22px 24px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#ede9fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Layers size={24} color="#7c3aed" />
          </div>
          <div>
            <h3
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 2px 0',
                letterSpacing: '-0.6px',
              }}
            >
              120+ Platform Types
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Social, professional, developer, and other platforms
            </p>
          </div>
        </div>

        {/* Stat 3: Accounts Found Example */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '22px 24px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} color="#16a34a" />
          </div>
          <div>
            <h3
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#15803d',
                margin: '0 0 2px 0',
                letterSpacing: '-0.6px',
              }}
            >
              {accountsFound} Accounts Found
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              Example result from recent searches
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Search Field */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px 16px',
            transition: 'all 0.15s ease',
          }}
        >
          <Search size={18} color="#64748b" style={{ marginRight: '12px', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supported websites by name, domain, or category..."
            style={{
              flexGrow: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14.5px',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginRight: '4px' }}>
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '100px',
                  border: isSelected ? '1px solid #0066cc' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? '#0066cc' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 6px rgba(0, 102, 204, 0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span>{cat}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '100px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Showing {filteredPlatforms.length} of {supportedWebsites.length} platforms
        </span>
        {searchQuery && (
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            Matching &ldquo;<strong style={{ color: 'var(--text-primary)' }}>{searchQuery}</strong>&rdquo;
          </span>
        )}
      </div>

      {/* Platform Grid */}
      {filteredPlatforms.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredPlatforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Search size={22} color="#94a3b8" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            No platforms found
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            No supported websites match &ldquo;{searchQuery}&rdquo; in the {selectedCategory} category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            style={{
              padding: '8px 18px',
              backgroundColor: '#0066cc',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Footer Banner */}
      <div
        style={{
          marginTop: '16px',
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0066cc 0%, #004c99 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 8px 24px rgba(0, 102, 204, 0.2)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.4px' }}>
            Ready to verify an email address?
          </h3>
          <p style={{ fontSize: '13.5px', margin: 0, opacity: 0.9, lineHeight: 1.5 }}>
            Scan all {TOTAL_SUPPORTED_SITES}+ platforms in seconds to detect active accounts and recovery clues.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartSearch}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            color: '#0066cc',
            border: 'none',
            borderRadius: '10px',
            padding: '11px 22px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          <span>Start Email Search</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};
