import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LeadProvider } from '@/lib/store';
import { ReviewsProvider } from '@/lib/reviewsStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import CustomCursor from '@/components/ui/CustomCursor';
import CinematicBackground from '@/components/ui/CinematicBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OUTLOOK ENTERPRISES | Premium UPVC Doors & Windows Solutions',
  description: 'Outlook Enterprises manufactures German-engineered soundproof UPVC doors, sliding windows, French doors, and acoustic partitions with 10-year warranty. Get an instant quote online!',
  keywords: 'UPVC windows, UPVC doors, soundproof windows, sliding windows, Hyderabad, Outlook Enterprises',
  openGraph: {
    title: 'OUTLOOK ENTERPRISES | Premium UPVC Doors & Windows',
    description: 'Premium UPVC doors & windows — 42dB soundproofing, 40% energy savings, 10-year warranty. Serving Hyderabad.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <LeadProvider>
          <ReviewsProvider>
            <CinematicBackground opacity={0.92} />
            <CustomCursor />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloat />
          </ReviewsProvider>
        </LeadProvider>
      </body>
    </html>
  );
}

