'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { ShieldCheck, Truck, BadgeCheck, Headphones } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { Star } from 'lucide-react';

const REASONS = [
  {
    icon: BadgeCheck,
    title: 'Guaranteed Authentic',
    text: 'Every timepiece is sourced from trusted suppliers and inspected before it reaches your wrist.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    text: 'Fast, insured delivery to all 36 states plus FCT, with tracking every step of the way.',
  },
  {
    icon: ShieldCheck,
    title: '6-Month Warranty',
    text: 'Shop with confidence knowing every watch is covered against manufacturing defects.',
  },
  {
    icon: Headphones,
    title: 'Personal Service',
    text: 'Real people on WhatsApp, ready to help you choose, order and track your perfect watch.',
  },
];

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#C6A45B]">The Qudson Promise</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-foreground">Why Choose Qudson Collection</h2>
        </div>
      </FadeIn>
      <StaggerContainer className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {REASONS.map(({ icon: Icon, title, text }) => (
          <StaggerItem key={title}>
            <div className="h-full rounded-lg border border-border bg-card p-7 hover:border-[#C6A45B]/50 transition-colors duration-300">
              <span className="inline-flex rounded-full bg-[#C6A45B]/10 p-3 text-[#C6A45B]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setTestimonials((data ?? []) as Testimonial[]));
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-neutral-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C6A45B]">Testimonials</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">Words From Our Customers</h2>
          </div>
        </FadeIn>
        <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t) => (
            <StaggerItem key={t.id}>
              <figure className="h-full rounded-lg border border-[#C6A45B]/20 bg-neutral-900/60 p-7">
                <div className="flex gap-1 text-[#C6A45B]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-neutral-300">
                  &ldquo;{t.content}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-xs tracking-[0.16em] uppercase text-[#C6A45B]">
                  {t.customer_name}
                  {t.location && <span className="text-neutral-500"> — {t.location}</span>}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
