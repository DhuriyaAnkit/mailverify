import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBackToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '';
  };

  const handleGoToSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#signup';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Successfully logged in!' });
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="login-page-container" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Background Grid & Glows */}
      <div className="bg-grid" />
      <div className="gradient-glow pulse-glow-animation" style={{ opacity: 0.7 }} />

      {/* Centered Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="playground-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
          zIndex: 10,
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}
      >
        {/* Back Link */}
        <a 
          href="#" 
          onClick={handleBackToHome}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s ease'
          }}
          className="back-home-btn"
        >
          <ArrowLeft size={14} /> Back
        </a>

        {/* MailVerify Logo */}
        <div 
          onClick={handleBackToHome}
          title="Back to Homepage"
          style={{ 
            display: 'inline-flex', 
            justifyContent: 'center', 
            marginBottom: '20px', 
            marginTop: '16px',
            cursor: 'pointer' 
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            border: '2.5px solid #09090b',
            backgroundColor: '#ffffff',
            transition: 'transform 0.2s ease'
          }}
          className="logo-icon-interactive"
          >
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
              <path d="M 28 48 L 42 62 L 72 32" stroke="#0066cc" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Form Headers */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          fontWeight: 800,
          letterSpacing: '-0.8px',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Welcome back
        </h2>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '28px'
        }}>
          Sign in to access your intelligence dashboard
        </p>

        {/* Message Alert */}
        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--success-color)',
            fontSize: '12.5px',
            lineHeight: 1.5,
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {message.text}
          </div>
        )}

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* Google OAuth */}
          <button 
            type="button" 
            className="btn btn-ghost" 
            style={{ 
              width: '100%', 
              height: '42px', 
              border: '1px solid var(--border-color)', 
              justifyContent: 'center', 
              fontSize: '13px', 
              fontWeight: 500,
              gap: '10px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.55 2.87-2.22 5.37-4.72 7.04l7.33 5.68C43.64 36.88 46.5 31.02 46.5 24z" />
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
              <path fill="#34A853" d="M24 38.5c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48c6.48 0 11.93-2.13 15.89-5.81l-7.33-5.68c-2.11 1.42-4.8 2.99-8.56 2.99z" />
            </svg>
            Continue with Google
          </button>

          {/* GitHub OAuth */}
          <button 
            type="button" 
            className="btn btn-ghost" 
            style={{ 
              width: '100%', 
              height: '42px', 
              border: '1px solid var(--border-color)', 
              justifyContent: 'center', 
              fontSize: '13px', 
              fontWeight: 500,
              gap: '10px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            or continue with email
          </span>
          <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              className="playground-input"
              style={{ width: '100%', padding: '10px 12px', fontSize: '13.5px' }}
              placeholder="name@work.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Password
              </label>
              <a href="#reset" style={{ fontSize: '11.5px', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="playground-input"
                style={{ width: '100%', padding: '10px 38px 10px 12px', fontSize: '13.5px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-tertiary)',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Continue / Submit */}
          <button
            type="submit"
            className="playground-btn"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', height: '42px', fontSize: '13px', marginTop: '10px' }}
          >
            {isSubmitting ? 'Verifying...' : 'Continue'}
          </button>
        </form>

        {/* Footer Toggle */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Don't have an account?{' '}
            <a 
              href="#signup" 
              onClick={handleGoToSignUp}
              style={{ 
                color: 'var(--accent-color)', 
                fontWeight: 600, 
                textDecoration: 'none'
              }}
            >
              Create account
            </a>
          </p>
        </div>

        {/* Security badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '6px', 
          color: 'var(--text-tertiary)', 
          fontSize: '11px', 
          marginTop: '20px' 
        }}>
          <Shield size={12} /> Secure 256-bit SSL encrypted connection
        </div>

      </motion.div>
    </div>
  );
};
