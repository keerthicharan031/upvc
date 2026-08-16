'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Moon, Sun } from 'lucide-react';
import CompanyLogo from '@/components/ui/CompanyLogo';
import BumpList from '@/components/ui/BumpList';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/why-upvc', label: 'Why UPVC' },
  { href: '/products', label: 'Products' },
  { href: '/visualizer', label: 'Visualizer' },
  { href: '/calculator', label: 'Price Calculator' },
  { href: '/projects', label: 'Projects' },
  { href: '/#reviews', label: 'Reviews' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 1.5rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
          background: scrolled ? 'rgba(19, 21, 26, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Top-left Brand Logo with 44px-56px size, smooth 200ms scale hover, retina SVG */}
          <div style={{ paddingLeft: '0.25rem', display: 'flex', alignItems: 'center' }}>
            <CompanyLogo size={44} showText={true} />
          </div>

          {/* Desktop Nav with Magnetic Bump Wave Effect */}
          <nav className="hidden-mobile" style={{ display: 'flex', alignItems: 'center' }}>
            <BumpList direction="horizontal" maxScale={1.08} neighborScale={1.03} liftPx={-3} style={{ gap: '0.2rem' }}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      color: isActive ? '#fff' : 'var(--color-text-secondary)',
                      background: isActive ? 'rgba(62,123,250,0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(62,123,250,0.3)' : '1px solid transparent',
                      display: 'inline-block',
                      transition: 'color 0.2s ease, background 0.2s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </BumpList>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setDark(!dark)}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--color-border)', borderRadius: '0.5rem', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
              title="Toggle theme"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Link href="/calculator" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem' }}>
              <Zap size={13} /> Instant Quote
            </Link>

            <button
              style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'none' }}
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 68,
              left: 0,
              right: 0,
              zIndex: 999,
              background: 'rgba(19, 21, 26, 0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--color-border)',
              padding: '1rem 1.5rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: pathname === link.href ? '#fff' : 'var(--color-text-secondary)',
                  background: pathname === link.href ? 'rgba(62,123,250,0.15)' : 'transparent',
                  display: 'block',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
