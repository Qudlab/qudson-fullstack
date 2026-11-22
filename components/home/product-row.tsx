'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/product-card';
import { FadeIn } from '@/components/motion';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';

export function ProductRow({
  title,
  eyebrow,
  query,
  viewAllHref,
}: {
  title: string;
  eyebrow?: string;
  query: Record<string, unknown>;
  viewAllHref: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const supabase = createClient();
    let request = supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(id, url, sort_order, is_primary)')
      .limit(8);

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        request = request.eq(key, value);
      }
    }
    request = request.order('created_at', { ascending: false });

    request.then(({ data }) => {
      if (!active) return;
      setProducts((data ?? []) as Product[]);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [JSON.stringify(query)]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Skeleton className="h-8 w-64" />
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <FadeIn>
        <div className="flex items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#C6A45B]">{eyebrow}</p>
            )}
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-foreground">{title}</h2>
          </div>
          <a
            href={viewAllHref}
            className="hidden sm:inline-block text-[12px] tracking-[0.16em] uppercase text-[#C6A45B] border-b border-[#C6A45B]/40 pb-1 hover:border-[#C6A45B] transition-colors"
          >
            View All
          </a>
        </div>
      </FadeIn>
      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      <div className="mt-8 sm:hidden text-center">
        <a href={viewAllHref} className="text-[12px] tracking-[0.16em] uppercase text-[#C6A45B]">
          View All
        </a>
      </div>
    </section>
  );
}
