'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { ArrowRight, Gem } from 'lucide-react';
import type { Category } from '@/lib/types';

export function Collections() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setCategories((data ?? []) as Category[]));
  }, []);

  const featured = categories.slice(0, 6);

  return (
    <section id="collections" className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C6A45B]">Curated For You</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-foreground">Featured Collections</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every wrist tells a story. Find yours among our hand-picked collections, from everyday
              classics to extraordinary statement pieces.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((cat) => (
            <StaggerItem key={cat.id}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group relative flex items-center justify-between overflow-hidden rounded-lg border border-border bg-card px-6 py-8 hover:border-[#C6A45B]/60 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,164,91,0.12)]"
              >
                <div>
                  <div className="flex items-center gap-2 text-[#C6A45B]">
                    <Gem className="h-4 w-4" />
                    <span className="text-[10px] tracking-[0.24em] uppercase">Collection</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl text-foreground group-hover:text-[#C6A45B] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{cat.description}</p>
                  )}
                </div>
                <span className="rounded-full border border-[#C6A45B]/40 p-3 text-[#C6A45B] transition-all duration-300 group-hover:bg-[#C6A45B] group-hover:text-black">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
