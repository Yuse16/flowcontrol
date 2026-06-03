"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UzalaLogo } from '@/components/brand/UzalaLogo';

const SPLASH_KEY = 'uzala_splash_seen_session';
const SPLASH_DURATION = 1800; // Snappier timing

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show splash on every first visit of the session to ensure professional hydration
    const seen = sessionStorage.getItem(SPLASH_KEY);

    if (!seen) {
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% 35%, #1a0a2e 0%, #05000A 55%, #030008 100%)' }}
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/25 rounded-full blur-[90px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 px-6"
          >
            <UzalaLogo size="hero" layout="vertical" showText showTagline />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
