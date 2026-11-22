import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Providers } from '@/components/providers';
import { LoadingScreen } from '@/components/loading-screen';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'QU[D]SON COLLECTION — Luxury Watches in Nigeria',
    template: '%s | QU[D]SON COLLECTION',
  },
  description:
    'Timeless elegance. Defining style. Shop authentic luxury, classic, smart and sports watches with nationwide delivery across Nigeria. Order securely via WhatsApp.',
  keywords: [
    'luxury watches Nigeria',
    'buy watches Lagos',
    'Qudson Collection',
    'mens watches Nigeria',
    'womens watches Nigeria',
    'smartwatches Nigeria',
  ],
  openGraph: {
    title: 'QU[D]SON COLLECTION — Luxury Watches in Nigeria',
    description:
      'Timeless elegance. Defining style. Authentic watches, honest prices, delivered across Nigeria.',
    type: 'website',
    siteName: 'QU[D]SON COLLECTION',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F3' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0B0C' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${jost.variable} font-body antialiased`}>
        <Providers>
          <LoadingScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
