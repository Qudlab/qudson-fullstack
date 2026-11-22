import { createBrowserClient } from '@supabase/ssr';
import { createMockSupabaseClient } from '@/lib/supabase/mock';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return createMockSupabaseClient() as unknown as ReturnType<typeof createBrowserClient<any>>;
  }

  return createBrowserClient(url, anonKey);
}
