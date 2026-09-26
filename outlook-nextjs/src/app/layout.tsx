import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LeadProvider } from '@/lib/store';
import { ReviewsProvider } from '@/lib/reviewsStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import CinematicBackground from '@/components/ui/CinematicBackground';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OUTLOOK ENTERPRISES | Premium UPVC Doors & Windows Solutions',
  description: 'Outlook Enterprises manufactures German-engineered soundproof UPVC doors, sliding windows, French doors, and acoustic partitions with 10-year warranty. Get an instant quote online!',
  keywords: 'UPVC windows, UPVC doors, soundproof windows, sliding windows, Hyderabad, Outlook Enterprises',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'OUTLOOK ENTERPRISES | Premium UPVC Doors & Windows',
    description: 'Premium UPVC doors & windows — 42dB soundproofing, 40% energy savings, 10-year warranty. Serving Hyderabad.',
    type: 'website',
    siteName: 'Outlook Enterprises',
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

// Viewport must be a separate named export in Next.js 13+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d0f14' },
    { media: '(prefers-color-scheme: light)', color: '#f8f9fc' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LeadProvider>
            <ReviewsProvider>
              <CinematicBackground opacity={0.92} />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <WhatsAppFloat />
            </ReviewsProvider>
          </LeadProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
