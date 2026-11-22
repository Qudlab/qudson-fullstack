'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { WebsiteSetting } from '@/lib/types';

const FALLBACKS: Record<string, Record<string, unknown>> = {
  hero: {
    heading: 'TIMELESS ELEGANCE. DEFINING STYLE.',
    subheading:
      'Discover curated luxury timepieces that define who you are. Authentic watches, honest prices, delivered across Nigeria.',
    cta_primary: 'Shop Now',
    cta_secondary: 'Explore Collections',
    background_image: '',
  },
  promo_banner: {
    enabled: true,
    message: 'Complimentary nationwide delivery on orders above ₦150,000',
  },
  business: {
    name: 'QU[D]SON COLLECTION',
    tagline: 'TIMELESS ELEGANCE. DEFINING STYLE.',
    whatsapp: '2348168032686',
    whatsapp_display: '08168032686',
    email: 'orders@qudsoncollection.com',
    address: 'Lagos, Nigeria',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
  },
};

/**
 * Fetch one or more website_settings keys with an in-memory cache so the
 * same key is never fetched twice per page load, plus a session-level cache
 * so navigation between pages does not refetch settings.
 */
const memoryCache = new Map<string, Record<string, unknown>>();

export function useSetting<T extends Record<string, unknown>>(key: string): {
  value: T | null;
  loading: boolean;
} {
  const [value, setValue] = useState<T | null>(() => ((FALLBACKS[key] as T) ?? null));
  const [loading, setLoading] = useState(!memoryCache.has(key) && !(key in FALLBACKS));

  useEffect(() => {
    let active = true;

    const cached = memoryCache.get(key);
    if (cached) {
      setValue(cached as T);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from('website_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data?.value) {
          memoryCache.set(key, data.value);
          setValue(data.value as T);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key]);

  return { value, loading };
}

export function invalidateSettingCache(key?: string) {
  if (key) {
    memoryCache.delete(key);
  } else {
    memoryCache.clear();
  }
}

export type SiteSettingsBundle = {
  business: Record<string, unknown> | null;
  loading: boolean;
};

export function useSiteSettingsType(): WebsiteSetting['value'] | null {
  return null;
}
