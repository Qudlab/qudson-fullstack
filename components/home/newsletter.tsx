'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { FadeIn } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() });
    setLoading(false);
    if (error) {
      if (error.code === '23505') {
        toast.success('You are already subscribed. Thank you!');
      } else {
        toast.error('Could not subscribe right now. Please try again.');
      }
      return;
    }
    toast.success('Subscribed! Watch out for our latest arrivals and offers.');
    setEmail('');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-neutral-950 px-6 py-16 sm:px-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,164,91,0.15),transparent_65%)]" aria-hidden />
          <div className="relative max-w-xl mx-auto">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C6A45B]">Stay In The Loop</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">
              Join the Qudson Inner Circle
            </h2>
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
              Be the first to see new arrivals, private offers and members-only previews.
            </p>
            <form onSubmit={subscribe} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-[#C6A45B]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#C6A45B] text-black hover:bg-[#d4b26e] font-semibold tracking-wider uppercase text-[13px] px-8"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
