import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is MailVerify?",
      answer: "MailVerify helps you explore publicly available information associated with an email address. It organizes professional details, publicly visible profiles, and digital presence into a single, easy-to-read report for research, verification, and outreach."
    },
    {
      question: "Where does the information come from?",
      answer: "Results are compiled from publicly available sources, such as professional directories, company websites, public social profiles, and other open web resources. The availability and depth of information depend on what is publicly accessible for a given email address."
    },
    {
      question: "How reliable are the results?",
      answer: "MailVerify evaluates information from multiple public sources and highlights matching details to improve confidence. Because online information can change over time, we recommend reviewing the provided sources when making important decisions."
    },
    {
      question: "Which payment methods are supported?",
      answer: "We accept major credit and debit cards for individual and business subscriptions. Organizations that require invoicing or custom billing can contact our sales team to discuss available options."
    },
    {
      question: "How does MailVerify protect privacy?",
      answer: "MailVerify only searches and organizes publicly available information. We do not access private accounts or restricted data. Communication with our platform is encrypted, and we strive to follow applicable privacy and data protection regulations."
    },
    {
      question: "Who is MailVerify designed for?",
      answer: "MailVerify is useful for recruiters, sales teams, security professionals, researchers, journalists, and businesses that need to verify contacts, enrich leads, or better understand publicly available professional information associated with an email address."
    }

  ];

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" style={{ marginTop: '64px', paddingBottom: '40px', scrollMarginTop: '100px' }}>
      
      {/* Title block */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
          FAQ
        </span>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: 800, letterSpacing: '-1.2px', marginBottom: '16px', color: 'var(--text-primary)' }}>
          Frequently asked questions
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Everything you need to know about MailVerify. Can't find what you're looking for? <a href="#contact" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Contact our team</a>.
        </p>
      </div>

      {/* Accordion List */}
      <div className="faq-accordion-container" style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              className={`faq-item-wrapper ${isOpen ? 'open' : ''}`}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '22px 28px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ display: 'inline-flex', color: 'var(--text-tertiary)' }}
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div style={{ padding: '0 28px 22px 28px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
