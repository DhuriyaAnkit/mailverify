import React, { useState } from 'react';
import { Check, X, AlertTriangle, ShieldCheck, Phone, Mail, ExternalLink } from 'lucide-react';
import type { HoleheSiteResult } from '../../lib/api';

interface WebsiteCardProps {
  result: HoleheSiteResult;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ result }) => {
  const [imgError, setImgError] = useState(false);

  // Status computation
  const isFound = result.exists;
  const isRateLimited = result.rateLimit;

  // Domain for favicon
  const domain = result.domain || `${result.name.toLowerCase().replace(/\s+/g, '')}.com`;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  // Detective clues
  const hasRecoveryEmail = Boolean(result.emailrecovery);
  const hasPhone = Boolean(result.phoneNumber);
  const othersObj = result.others && typeof result.others === 'object' ? result.others : null;
  const otherDetails = othersObj ? Object.entries(othersObj).filter(([, v]) => Boolean(v) && typeof v === 'string') : [];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: isFound 
          ? '1.5px solid rgba(22, 163, 74, 0.4)' 
          : '1px solid var(--border-color)',
        boxShadow: isFound 
          ? '0 4px 16px rgba(22, 163, 74, 0.08), 0 1px 3px rgba(0,0,0,0.02)' 
          : '0 1px 3px rgba(0,0,0,0.02)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.2s ease',
        background: isFound ? 'linear-gradient(180deg, #ffffff 0%, #f7fef9 100%)' : '#ffffff',
      }}
      className="website-result-card"
    >
      <div>
        {/* Top bar: Icon + Title + Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            {/* Favicon / Avatar */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid var(--border-color)',
              }}
            >
              {!imgError ? (
                <img
                  src={faviconUrl}
                  alt={result.name}
                  onError={() => setImgError(true)}
                  style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                  loading="lazy"
                />
              ) : (
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {result.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Name */}
            <div style={{ minWidth: 0 }}>
              <h4
                style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textTransform: 'capitalize',
                }}
                title={result.name}
              >
                {result.name}
              </h4>
              {result.domain && (
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {result.domain}
                </span>
              )}
            </div>
          </div>

          {/* Status icon / pill */}
          <div>
            {isFound ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  fontSize: '11.5px',
                  fontWeight: 600,
                }}
              >
                <Check size={13} strokeWidth={2.5} /> Account Found
              </span>
            ) : isRateLimited ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
                title="Website rate-limited or blocked automated check"
              >
                <AlertTriangle size={12} /> Rate Limited
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                <X size={12} strokeWidth={2} /> Not Found
              </span>
            )}
          </div>
        </div>

        {/* Detective Clues Callout (Recovery email, phone, extra metadata) */}
        {(hasRecoveryEmail || hasPhone || otherDetails.length > 0) && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 10px',
              borderRadius: '8px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: '11.5px',
              lineHeight: 1.4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#166534', fontWeight: 600, marginBottom: '4px' }}>
              <ShieldCheck size={13} />
              <span>Detective Clues</span>
            </div>

            {hasRecoveryEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', marginTop: '2px' }}>
                <Mail size={12} style={{ flexShrink: 0 }} />
                <span>Recovery: <strong>{result.emailrecovery}</strong></span>
              </div>
            )}

            {hasPhone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', marginTop: '2px' }}>
                <Phone size={12} style={{ flexShrink: 0 }} />
                <span>Phone: <strong>{result.phoneNumber}</strong></span>
              </div>
            )}

            {otherDetails.map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', marginTop: '2px' }}>
                <ExternalLink size={12} style={{ flexShrink: 0 }} />
                <span style={{ textTransform: 'capitalize' }}>{key}: <strong>{String(val)}</strong></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
