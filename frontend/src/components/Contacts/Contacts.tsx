import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, Send, CheckCircle } from 'lucide-react';

export const Contacts: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    // Simulate server POST submission lag
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  const checklistItems = [
    "Discover publicly available professional profiles",
    "Verify identity with trusted public sources",
    "Enrich contacts with structured insights",
    "Integrate seamlessly using our developer API",
    "Export results in CSV or Excel formats"
  ];

  return (
    <section id="contact" style={{ marginTop: '64px', paddingBottom: '16px', scrollMarginTop: '100px' }}>
      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
        
        {/* Left Column: Title & Benefits */}
        <div style={{ textAlign: 'left' }}>
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
            <Mail size={13} /> Get in Touch
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: 800, letterSpacing: '-1.2px', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Turn Every Email Into Actionable Insights
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
            Discover publicly available information, verify professional identities, and uncover valuable context—all from a single email address. Whether you're researching contacts, qualifying leads, or investigating digital presence, MailVerify helps you work with confidence.
          </p>

          {/* Checklist */}
          <ul className="contact-checklist" style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {checklistItems.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  color: 'var(--success-color)'
                }}>
                  <Check size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => window.location.hash = '#signup'} className="btn btn-primary" style={{ height: '44px', padding: '0 24px' }}>Sign Up</button>
            <button className="btn btn-ghost" style={{ height: '44px', padding: '0 24px', border: '1px solid var(--border-color)' }}>See Pricing</button>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div>
          <div className="playground-card" style={{ padding: '36px', textAlign: 'left', position: 'relative' }}>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', marginBottom: '16px' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Message Sent
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>
                    Thank you for reaching out. A representative from our team will get in touch with you shortly.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setSubmitted(false)} 
                    className="btn btn-ghost" 
                    style={{ marginTop: '24px', border: '1px solid var(--border-color)', height: '36px' }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
                >
                  {/* Name field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      className="playground-input"
                      style={{ width: '100%', padding: '12px' }}
                      placeholder="Your name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      className="playground-input"
                      style={{ width: '100%', padding: '12px' }}
                      placeholder="you@example.com"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>

                  {/* Subject field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Subject
                    </label>
                    <select
                      className="playground-input"
                      style={{ width: '100%', padding: '12px', height: '46px', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                    >
                      <option value="" disabled>Select a subject</option>
                      <option value="sales">Sales & Licensing</option>
                      <option value="api">API Access Request</option>
                      <option value="support">Technical Support</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Message
                    </label>
                    <textarea
                      className="playground-input"
                      style={{ width: '100%', padding: '12px', minHeight: '110px', resize: 'vertical', fontFamily: 'inherit' }}
                      placeholder="How can we help you?"
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="playground-btn"
                    disabled={isSubmitting}
                    style={{ width: '100%', justifyContent: 'center', height: '46px', gap: '8px' }}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send size={14} /> Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
};
