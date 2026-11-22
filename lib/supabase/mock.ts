// In-memory Supabase fallback used when NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// are not configured in the environment. Seeded from supabase/migrations/20261122081907_seed_settings_categories.sql.

type Row = Record<string, unknown>;

const SEED_TABLES: Record<string, Row[]> = {
  categories: [
    { id: 'cat-1', name: "Men's Watches", slug: 'mens', description: 'Timepieces crafted for the modern gentleman', sort_order: 10, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-2', name: "Women's Watches", slug: 'womens', description: 'Elegant watches designed for her', sort_order: 20, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-3', name: 'Luxury Watches', slug: 'luxury', description: 'Exceptional timepieces for extraordinary moments', sort_order: 30, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-4', name: 'Casual Watches', slug: 'casual', description: 'Effortless everyday style', sort_order: 40, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-5', name: 'Sports Watches', slug: 'sports', description: 'Built for performance and endurance', sort_order: 50, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-6', name: 'Digital Watches', slug: 'digital', description: 'Precise digital timekeeping', sort_order: 60, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-7', name: 'Smartwatches', slug: 'smartwatches', description: 'Connected watches for modern life', sort_order: 70, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-8', name: 'Classic Watches', slug: 'classic', description: 'Timeless designs that never go out of style', sort_order: 80, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-9', name: 'Automatic Watches', slug: 'automatic', description: 'Self-winding mechanical precision', sort_order: 90, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-10', name: 'Mechanical Watches', slug: 'mechanical', description: 'Handcrafted mechanical movements', sort_order: 100, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-11', name: 'Leather Strap Watches', slug: 'leather-strap', description: 'Genuine leather straps, refined comfort', sort_order: 110, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-12', name: 'Stainless Steel Watches', slug: 'stainless-steel', description: 'Durable, polished stainless steel', sort_order: 120, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-13', name: 'Gold Watches', slug: 'gold', description: 'The warmth and prestige of gold', sort_order: 130, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-14', name: 'Couple Watches', slug: 'couple', description: 'Matching pairs for two', sort_order: 140, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-15', name: 'Unisex Watches', slug: 'unisex', description: 'Designed for everyone', sort_order: 150, created_at: '2026-11-22T00:00:00Z' },
    { id: 'cat-16', name: 'Other Watches', slug: 'other', description: 'Unique timepieces beyond category', sort_order: 160, created_at: '2026-11-22T00:00:00Z' },
  ],
  website_settings: [
    {
      key: 'hero',
      value: {
        heading: 'TIMELESS ELEGANCE. DEFINING STYLE.',
        subheading: 'Discover curated luxury timepieces that define who you are. Authentic watches, honest prices, delivered across Nigeria.',
        cta_primary: 'Shop Now',
        cta_secondary: 'Explore Collections',
        background_image: '',
      },
    },
    {
      key: 'promo_banner',
      value: {
        enabled: true,
        message: 'Complimentary nationwide delivery on orders above ₦150,000',
      },
    },
    {
      key: 'business',
      value: {
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
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      customer_name: 'Adebayo O.',
      location: 'Lagos',
      content: 'The watch arrived in beautiful packaging and looks even better in person. Qudson Collection treated me like a VIP from order to delivery.',
      rating: 5,
      approved: true,
      created_at: '2026-11-22T00:00:00Z',
    },
    {
      id: 'test-2',
      customer_name: 'Chiamaka N.',
      location: 'Abuja',
      content: 'I was worried about buying a watch online, but the team sent photos on WhatsApp before delivery. Genuine product, smooth process. Highly recommended.',
      rating: 5,
      approved: true,
      created_at: '2026-11-22T00:00:00Z',
    },
  ],
  products: [],
  newsletter_subscribers: [],
  admin_roles: [],
};

function createQueryBuilder(table: string) {
  let filters: Array<(row: Row) => boolean> = [];
  let orderByCol: string | null = null;
  let orderAsc = true;
  let limitCount: number | null = null;
  let rangeBounds: [number, number] | null = null;
  let pendingInsert: Row | Row[] | null = null;

  const execute = async (singleMode: 'none' | 'maybe' | 'single' = 'none') => {
    const rows = SEED_TABLES[table] ?? (SEED_TABLES[table] = []);

    if (pendingInsert !== null) {
      const items = Array.isArray(pendingInsert) ? pendingInsert : [pendingInsert];
      if (table === 'newsletter_subscribers') {
        for (const item of items) {
          if (rows.some((r) => r.email === item.email)) {
            return { data: null, error: { code: '23505', message: 'duplicate key value' }, count: null };
          }
        }
      }
      rows.push(...items);
      return { data: items, error: null, count: items.length };
    }

    let result = rows.filter((row) => filters.every((fn) => fn(row)));
    if (orderByCol) {
      const col = orderByCol;
      result = [...result].sort((a, b) => {
        const av = a[col];
        const bv = b[col];
        if (av === bv) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        return (av < bv ? -1 : 1) * (orderAsc ? 1 : -1);
      });
    }
    const total = result.length;
    if (rangeBounds) {
      result = result.slice(rangeBounds[0], rangeBounds[1] + 1);
    } else if (limitCount !== null) {
      result = result.slice(0, limitCount);
    }

    if (singleMode === 'maybe' || singleMode === 'single') {
      return { data: result[0] ?? null, error: null, count: total };
    }
    return { data: result, error: null, count: total };
  };

  const builder: Record<string, unknown> = {
    select: () => builder,
    eq: (col: string, val: unknown) => {
      filters.push((row) => row[col] === val);
      return builder;
    },
    neq: (col: string, val: unknown) => {
      filters.push((row) => row[col] !== val);
      return builder;
    },
    is: (col: string, val: unknown) => {
      filters.push((row) => (val === null ? row[col] == null : row[col] === val));
      return builder;
    },
    gte: (col: string, val: number) => {
      filters.push((row) => Number(row[col]) >= val);
      return builder;
    },
    lte: (col: string, val: number) => {
      filters.push((row) => Number(row[col]) <= val);
      return builder;
    },
    ilike: (col: string, pattern: string) => {
      const needle = pattern.replace(/%/g, '').toLowerCase();
      filters.push((row) => String(row[col] ?? '').toLowerCase().includes(needle));
      return builder;
    },
    order: (col: string, opts?: { ascending?: boolean }) => {
      orderByCol = col;
      orderAsc = opts?.ascending ?? true;
      return builder;
    },
    limit: (n: number) => {
      limitCount = n;
      return builder;
    },
    range: (from: number, to: number) => {
      rangeBounds = [from, to];
      return builder;
    },
    insert: (payload: Row | Row[]) => {
      pendingInsert = payload;
      return builder;
    },
    maybeSingle: () => execute('maybe'),
    single: () => execute('single'),
    then: <TResult1 = unknown, TResult2 = never>(
      onfulfilled?: ((value: Awaited<ReturnType<typeof execute>>) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ) => execute('none').then(onfulfilled, onrejected),
  };

  return builder;
}

export function createMockSupabaseClient() {
  return {
    from: (table: string) => createQueryBuilder(table),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signOut: async () => ({ error: null }),
    },
  };
}
