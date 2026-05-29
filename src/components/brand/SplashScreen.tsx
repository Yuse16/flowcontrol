"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UzalaLogo } from '@/components/brand/UzalaLogo';

const SPLASH_KEY = 'uzala_splash_seen';
const SPLASH_DURATION = 2400;

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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden safe-top"
          style={{ background: 'radial-gradient(ellipse at 50% 35%, #1a0a2e 0%, #05000A 55%, #030008 100%)' }}
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/25 rounded-full blur-[90px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 px-6"
          >
            <UzalaLogo size="hero" layout="vertical" showText showTagline />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
