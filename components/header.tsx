'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, Sun, Moon, Watch } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCart } from '@/lib/cart-context';
import { QudsonLogo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop?sort=newest', label: 'New Arrivals' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 24));
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const isSolid = mounted && (scrolled || pathname !== '/');

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        isSolid
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-[0_2px_24px_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link href="/" aria-label="Qudson Collection home" className="shrink-0">
            <QudsonLogo size={38} />
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'text-[13px] tracking-[0.14em] uppercase transition-colors hover:text-[#C6A45B]',
                  pathname === link.href.split('?')[0]
                    ? 'text-[#C6A45B]'
                    : 'text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search watches"
              className="p-2.5 rounded-full text-foreground/80 hover:text-[#C6A45B] hover:bg-foreground/5 transition-colors"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle light and dark mode"
              className="p-2.5 rounded-full text-foreground/80 hover:text-[#C6A45B] hover:bg-foreground/5 transition-colors"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </button>

            <Link
              href="/cart"
              aria-label={`Shopping cart, ${count} items`}
              className="relative p-2.5 rounded-full text-foreground/80 hover:text-[#C6A45B] hover:bg-foreground/5 transition-colors"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 rounded-full bg-[#C6A45B] text-[10px] font-semibold text-black flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              className="md:hidden p-2.5 rounded-full text-foreground/80 hover:text-[#C6A45B] transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-background border-b border-border"
          >
            <form onSubmit={onSearch} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex gap-3">
              <Input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search watches by name..."
                className="flex-1 border-[#C6A45B]/40 focus-visible:ring-[#C6A45B]"
              />
              <button
                type="submit"
                className="px-5 rounded-md bg-[#C6A45B] text-black text-[13px] font-semibold tracking-wider uppercase hover:bg-[#d4b26e] transition-colors"
              >
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
            aria-label="Mobile navigation"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-3 text-sm tracking-[0.14em] uppercase text-foreground/90 hover:text-[#C6A45B] border-b border-border/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-[#C6A45B] px-6 py-3 text-[13px] font-semibold tracking-wider uppercase text-black hover:bg-[#d4b26e] transition-colors"
              >
                <Watch className="h-4 w-4" /> Browse Collection
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
