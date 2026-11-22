'use client';

import { motion } from 'framer-motion';

export function QudsonLogo({
  size = 40,
  withText = true,
  variant = 'auto',
}: {
  size?: number;
  withText?: boolean;
  variant?: 'auto' | 'light' | 'dark';
}) {
  const gold = '#C6A45B';
  const textColorClass =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-neutral-900'
      : 'text-foreground';

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-label="Qudson Collection emblem"
        initial={false}
      >
        <circle cx="32" cy="30" r="20" stroke={gold} strokeWidth="3" />
        <circle cx="32" cy="30" r="13.5" stroke={gold} strokeWidth="1.4" opacity="0.55" />
        {/* watch hands inside the Q bowl */}
        <line x1="32" y1="30" x2="32" y2="22.5" stroke={gold} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="32" y1="30" x2="37.5" y2="33" stroke={gold} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="32" cy="30" r="1.8" fill={gold} />
        {/* Q tail */}
        <line x1="40" y1="40" x2="50" y2="52" stroke={gold} strokeWidth="4" strokeLinecap="round" />
      </motion.svg>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className={`font-cormorant font-semibold tracking-[0.18em] ${textColorClass}`} style={{ fontSize: size * 0.42 }}>
            QU<span className="text-[#C6A45B]">[D]</span>SON
          </span>
          <span className={`tracking-[0.55em] mt-1 ${textColorClass} opacity-70`} style={{ fontSize: size * 0.17 }}>
            COLLECTION
          </span>
        </span>
      )}
    </span>
  );
}
