'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSetting } from '@/lib/use-settings';
import type { HeroSetting, PromoBannerSetting } from '@/lib/types';

export function Hero() {
  const { value: hero } = useSetting<HeroSetting>('hero');
  const { value: promo } = useSetting<PromoBannerSetting>('promo_banner');

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-neutral-950">
      {/* Ambient luxury background */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,164,91,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(198,164,91,0.10),transparent_50%)]" />
        <motion.div
          className="absolute right-[8%] top-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full border border-[#C6A45B]/15 hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-6 rounded-full border border-[#C6A45B]/10" />
          <div className="absolute inset-24 rounded-full border border-[#C6A45B]/10" />
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A45B]/60" />
          <div className="absolute left-1/2 bottom-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#C6A45B]/40" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        {promo?.enabled && promo.message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 inline-block rounded-full border border-[#C6A45B]/40 px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase text-[#C6A45B]"
          >
            {promo.message}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-white max-w-3xl"
        >
          {hero?.heading?.split('.').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part.trim()}<span className="text-[#C6A45B]">.</span>{' '}
              </span>
            ) : (
              <span key={i} className="gold-text">{part.trim()}</span>
            )
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-neutral-400"
        >
          {hero?.subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-md bg-[#C6A45B] px-8 py-4 text-[13px] font-semibold tracking-[0.16em] uppercase text-black hover:bg-[#d4b26e] transition-all duration-300 hover:shadow-[0_0_32px_rgba(198,164,91,0.35)]"
          >
            {hero?.cta_primary ?? 'Shop Now'}
          </Link>
          <Link
            href="#collections"
            className="inline-flex items-center justify-center rounded-md border border-[#C6A45B]/50 px-8 py-4 text-[13px] font-semibold tracking-[0.16em] uppercase text-[#C6A45B] hover:bg-[#C6A45B]/10 transition-all duration-300"
          >
            {hero?.cta_secondary ?? 'Explore Collections'}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-lg"
        >
          {[
            { value: '100%', label: 'Authentic' },
            { value: '36', label: 'States Delivered' },
            { value: '6-Month', label: 'Warranty' },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-[#C6A45B]/30 pl-4">
              <p className="font-display text-2xl text-[#C6A45B]">{stat.value}</p>
              <p className="mt-1 text-[11px] tracking-[0.16em] uppercase text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#collections"
        aria-label="Scroll to collections"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#C6A45B]/70 hover:text-[#C6A45B]"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.span>
      </motion.a>
    </section>
  );
}
