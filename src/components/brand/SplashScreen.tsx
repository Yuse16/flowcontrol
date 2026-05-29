"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UzalaLogo } from '@/components/brand/UzalaLogo';

const SPLASH_KEY = 'uzala_splash_seen';
const SPLASH_DURATION = 2200;

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const seen = sessionStorage.getItem(SPLASH_KEY);

    if (isStandalone && !seen) {
      setVisible(true);
      sessionStorage.setItem(SPLASH_KEY, '1');
      const timer = setTimeout(() => setVisible(false), SPLASH_DURATION);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050508] overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <UzalaLogo size="hero" layout="vertical" showText showTagline />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
