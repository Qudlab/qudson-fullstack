'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QudsonLogo } from '@/components/logo';

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('qudson-intro-shown')) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem('qudson-intro-shown', '1');
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <QudsonLogo size={72} variant="light" />
          </motion.div>
          <motion.p
            className="mt-6 text-[#C6A45B] text-[11px] tracking-[0.5em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Timeless Elegance
          </motion.p>
          <motion.div
            className="mt-8 h-px w-40 bg-[#C6A45B]/30 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="h-full w-1/2 bg-[#C6A45B]"
              initial={{ x: '-100%' }}
              animate={{ x: '220%' }}
              transition={{ delay: 0.6, duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
