import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Astra - Adaptive AI Tutor',
  description: 'A calm, intelligent, and adaptive AI tutor that teaches concepts with clarity and structure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#f5f5f0] text-[#1a1a1a] font-serif">
        {children}
      </body>
    </html>
  );
}
