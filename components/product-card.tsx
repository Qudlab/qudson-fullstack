'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatNaira, effectivePrice, discountPercent } from '@/lib/format';
import { primaryImage } from '@/lib/products';
import type { Product } from '@/lib/types';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const image = primaryImage(product);
  const price = effectivePrice(product);
  const off = discountPercent(product);
  const soldOut = !product.in_stock || product.stock_quantity === 0;

  const onAdd = () => {
    if (soldOut) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price,
      image,
      maxQuantity: product.stock_quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-secondary aspect-[4/5]">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary">
              <span className="font-display text-6xl text-[#C6A45B]/40">{product.name.charAt(0)}</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {off != null && (
              <span className="px-2.5 py-1 rounded bg-[#C6A45B] text-black text-[10px] font-semibold tracking-wider uppercase">
                -{off}%
              </span>
            )}
            {product.is_new_arrival && (
              <span className="px-2.5 py-1 rounded bg-neutral-900 text-[#C6A45B] border border-[#C6A45B]/40 text-[10px] font-semibold tracking-wider uppercase">
                New
              </span>
            )}
          </div>

          {soldOut && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-4 py-2 bg-neutral-900 text-[#C6A45B] text-xs font-semibold tracking-[0.2em] uppercase border border-[#C6A45B]/50">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="pt-4 pb-2">
        {product.brand && (
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">{product.brand}</p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg leading-snug text-foreground group-hover:text-[#C6A45B] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-medium text-[#C6A45B]">{formatNaira(price)}</span>
          {off != null && (
            <span className="text-xs text-muted-foreground line-through">{formatNaira(product.price)}</span>
          )}
        </div>

        <button
          onClick={onAdd}
          disabled={soldOut}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#C6A45B]/60 px-4 py-2.5 text-[12px] font-medium tracking-[0.14em] uppercase text-[#C6A45B] hover:bg-[#C6A45B] hover:text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#C6A45B]"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : soldOut ? (
            'Unavailable'
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
