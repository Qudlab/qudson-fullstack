'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { QudsonLogo } from '@/components/logo';
import { useSetting } from '@/lib/use-settings';
import type { BusinessSetting } from '@/lib/types';
import { WHATSAPP_DISPLAY } from '@/lib/format';

export function Footer() {
  const { value: business } = useSetting<BusinessSetting>('business');

  const socials = [
    business?.instagram && { href: business.instagram, icon: Instagram, label: 'Instagram' },
    business?.facebook && { href: business.facebook, icon: Facebook, label: 'Facebook' },
    business?.twitter && { href: business.twitter, icon: Twitter, label: 'Twitter' },
  ].filter(Boolean) as { href: string; icon: typeof Instagram; label: string }[];

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-[#C6A45B]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <QudsonLogo size={44} variant="light" />
            <p className="mt-6 text-sm leading-relaxed text-neutral-400">
              Timeless elegance. Defining style. Curated luxury timepieces, delivered across Nigeria
              with authenticity you can trust.
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2.5 rounded-full border border-[#C6A45B]/30 text-[#C6A45B] hover:bg-[#C6A45B] hover:text-black transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[#C6A45B] text-xs font-semibold tracking-[0.22em] uppercase">Shop</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/shop" className="hover:text-[#C6A45B] transition-colors">All Watches</Link></li>
              <li><Link href="/shop?category=mens" className="hover:text-[#C6A45B] transition-colors">Men&apos;s Watches</Link></li>
              <li><Link href="/shop?category=womens" className="hover:text-[#C6A45B] transition-colors">Women&apos;s Watches</Link></li>
              <li><Link href="/shop?category=luxury" className="hover:text-[#C6A45B] transition-colors">Luxury Watches</Link></li>
              <li><Link href="/shop?category=smartwatches" className="hover:text-[#C6A45B] transition-colors">Smartwatches</Link></li>
              <li><Link href="/shop?sort=newest" className="hover:text-[#C6A45B] transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#C6A45B] text-xs font-semibold tracking-[0.22em] uppercase">Company</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-[#C6A45B] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#C6A45B] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#C6A45B] transition-colors">FAQ</Link></li>
              <li><Link href="/delivery" className="hover:text-[#C6A45B] transition-colors">Delivery Information</Link></li>
              <li><Link href="/returns" className="hover:text-[#C6A45B] transition-colors">Returns &amp; Exchange</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#C6A45B] text-xs font-semibold tracking-[0.22em] uppercase">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#C6A45B] mt-0.5 shrink-0" />
                <span>{business?.whatsapp_display ?? WHATSAPP_DISPLAY}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#C6A45B] mt-0.5 shrink-0" />
                <span className="break-all">{business?.email ?? 'orders@qudsoncollection.com'}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#C6A45B] mt-0.5 shrink-0" />
                <span>{business?.address ?? 'Lagos, Nigeria'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {business?.name ?? 'QU[D]SON COLLECTION'}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500">
            <Link href="/privacy" className="hover:text-[#C6A45B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#C6A45B] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
