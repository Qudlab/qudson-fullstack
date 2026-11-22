'use client';

import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

/**
 * Fetch public products with filters, sorting and pagination.
 * Server-side (PostgREST) filtering keeps queries fast under concurrent load.
 */
export type ProductQuery = {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured';
  featured?: boolean;
  newArrival?: boolean;
  page?: number;
  perPage?: number;
};

export type ProductPage = {
  products: (Product & { categories: { name: string; slug: string } | null })[];
  total: number;
  hasMore: boolean;
};

export async function fetchProducts(query: ProductQuery = {}): Promise<ProductPage> {
  const supabase = createClient();
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.min(48, Math.max(1, query.perPage ?? 12));

  let categoryId: string | null = null;
  if (query.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', query.categorySlug)
      .maybeSingle();
    categoryId = cat?.id ?? 'no-match';
  }

  let orderBy: string = 'created_at';
  let ascending = false;
  if (query.sort === 'price_asc') {
    orderBy = 'price';
    ascending = true;
  } else if (query.sort === 'price_desc') {
    orderBy = 'price';
    ascending = false;
  }

  let request = supabase
    .from('products')
    .select('*, categories(id, name, slug), product_images(id, url, sort_order, is_primary)', {
      count: 'exact',
    });

  if (query.search) {
    request = request.ilike('name', `%${query.search}%`);
  }
  if (categoryId) {
    request = request.eq('category_id', categoryId);
  }
  if (query.minPrice != null) {
    request = request.gte('price', query.minPrice);
  }
  if (query.maxPrice != null) {
    request = request.lte('price', query.maxPrice);
  }
  if (query.featured) {
    request = request.eq('featured', true);
  }
  if (query.newArrival) {
    request = request.eq('is_new_arrival', true);
  }

  if (query.sort === 'featured') {
    request = request.order('featured', { ascending: false }).order('created_at', { ascending: false });
  } else {
    request = request.order(orderBy, { ascending });
  }

  const { data, error, count } = await request.range(
    (page - 1) * perPage,
    page * perPage - 1
  );

  if (error) {
    throw new Error(error.message);
  }

  const products = (data ?? []) as ProductPage['products'];
  const total = count ?? 0;

  return {
    products,
    total,
    hasMore: page * perPage < total,
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug), product_images(id, url, sort_order, is_primary)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Product) ?? null;
}

export async function fetchRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<Product[]> {
  const supabase = createClient();
  let request = supabase
    .from('products')
    .select('*, categories(id, name, slug), product_images(id, url, sort_order, is_primary)')
    .neq('id', productId)
    .limit(limit);

  if (categoryId) {
    request = request.eq('category_id', categoryId);
  }

  const { data, error } = await request;
  if (error) return [];

  let related = (data ?? []) as Product[];
  if (related.length < limit && categoryId) {
    const { data: extra } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(id, url, sort_order, is_primary)')
      .neq('id', productId)
      .is('category_id', null)
      .limit(limit - related.length);
    related = [...related, ...((extra ?? []) as Product[])];
  }
  return related;
}

export function primaryImage(product: Product): string | null {
  if (product.product_images && product.product_images.length > 0) {
    const primary = product.product_images.find((i) => i.is_primary);
    return (primary ?? product.product_images[0]).url;
  }
  return null;
}
