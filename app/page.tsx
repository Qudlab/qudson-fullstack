'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { Hero } from '@/components/home/hero';
import { ProductRow } from '@/components/home/product-row';
import { Collections } from '@/components/home/collections';
import { WhyChoose, Testimonials } from '@/components/home/sections';
import { Newsletter } from '@/components/home/newsletter';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

function BrandIntro() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex rounded-full bg-[#C6A45B]/10 p-4 text-[#C6A45B]"
        >
          <Gem className="h-7 w-7" />
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-display text-3xl sm:text-4xl text-foreground"
        >
          The House of Qudson
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-muted-foreground leading-relaxed max-w-2xl mx-auto"
        >
          Born from a passion for exceptional timepieces, Qudson Collection brings carefully
          curated watches to the modern Nigerian. We believe a watch is more than an instrument
          that tells time — it is a statement of who you are. Every piece in our collection is
          chosen with intention, authenticated with care and delivered with pride.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Link
            href="/about"
            className="inline-block text-[12px] tracking-[0.2em] uppercase text-[#C6A45B] border-b border-[#C6A45B]/40 pb-1 hover:border-[#C6A45B] transition-colors"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role) {
      router.prefetch('/admin');
    }
  }, [loading, role, router]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Collections />
        <ProductRow
          eyebrow="Handpicked"
          title="Featured Watches"
          query={{ featured: true }}
          viewAllHref="/shop?featured=1"
        />
        <ProductRow
          eyebrow="Just Landed"
          title="New Arrivals"
          query={{ is_new_arrival: true }}
          viewAllHref="/shop?sort=newest"
        />
        <BrandIntro />
        <ProductRow
          eyebrow="Most Loved"
          title="Best Sellers"
          query={{}}
          viewAllHref="/shop?sort=price_desc"
        />
        <WhyChoose />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
