import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const checkmarkControls = useAnimation();
  const glowControls = useAnimation();

  useEffect(() => {
    const runAnimation = async () => {
      // 1. Wait for logo container to start fading in and scaling up
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 2. Draw the checkmark
      await checkmarkControls.start({
        pathLength: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } // Apple-like easeOutExpo
      });

      // 3. Start the glowing pulse behind the logo
      glowControls.start({
        scale: [0.95, 1.05, 0.95],
        opacity: [0.5, 0.9, 0.5],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      });

      // 4. Wait for a short pause
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 5. Complete splash screen trigger (handled in parent exit animation)
      onComplete();
    };

    runAnimation();
  }, [checkmarkControls, glowControls, onComplete]);

  // Logo Container Variants (0.8 -> 1.0 scale, fade-in, slight upward slide)
  const containerVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] // Custom easeOutExpo
      }
    },
    exit: {
      opacity: 0,
      y: -60,
      scale: 0.95,
      transition: {
        duration: 0.6,
        ease: [0.7, 0, 0.84, 0] as [number, number, number, number] // Custom easeInExpo
      }
    }
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      {/* Background Soft Glow Pulse */}
      <motion.div
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 102, 204, 0.12) 0%, rgba(0, 102, 204, 0) 70%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={glowControls}
      />

      {/* Main Logo Container */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 2
        }}
      >
        {/* Custom SVG Logo */}
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.03))' }}
        >
          {/* Rounded Envelope/Card outline (Vercel/Apple inspired) */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="24"
            fill="#ffffff"
            stroke="#09090b"
            strokeWidth="4.5"
          />
          {/* Subtle envelope fold line to match Mail theme */}
          <path
            d="M 12 28 C 30 40, 70 40, 88 28"
            stroke="#e4e4e7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Separately animated checkmark stroke */}
          <motion.path
            d="M 33 50 L 45 61 L 67 38"
            fill="none"
            stroke="#0066cc"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={checkmarkControls}
          />
        </svg>

        {/* Text Fade In */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '-0.5px',
            color: '#09090b'
          }}
        >
          MailVerify
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
