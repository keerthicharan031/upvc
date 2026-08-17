'use client';
import { MapPin, Phone, Mail, User, Globe } from 'lucide-react';
import Link from 'next/link';
import CompanyLogo from '@/components/ui/CompanyLogo';
import UPIPaymentSlip from '@/components/ui/UPIPaymentSlip';

const FOOTER_LINKS = [
  { href: '/products', label: 'Product Catalog' },
  { href: '/visualizer', label: 'Visual Configurator' },
  { href: '/calculator', label: 'Instant Cost Estimator' },
  { href: '/why-upvc', label: 'Why UPVC?' },
  { href: '/projects', label: 'Portfolio Gallery' },
  { href: '/#reviews', label: 'Customer Reviews & Ratings' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-charcoal-deep)',
      borderTop: '1px solid var(--color-border)',
      padding: '0 0 2rem',
      marginTop: '6rem',
    }}>
      {/* UPI Payment Section */}
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1rem',
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          paddingTop: '2.5rem',
          marginBottom: '0',
        }}>
          Scan to Pay via UPI
        </p>
        <UPIPaymentSlip />
      </div>

      {/* Original footer content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div style={{ marginBottom: '0.5rem' }}>
            <CompanyLogo size={38} showText={true} className="footer-logo" />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Enterprise UPVC doors and windows solutions engineered for noise insulation, thermal efficiency, and modern architectural luxury. Chennai&apos;s most trusted UPVC brand.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              {['🏆 ISO Certified', '🇩🇪 German Profiles'].map((t) => (
                <span key={t} style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', borderRadius: '0.4rem', padding: '0.3rem 0.6rem' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-primary)' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-primary)' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                { icon: <User size={14} />, text: 'Partners: Saravanavel & Durai' },
                { icon: <MapPin size={14} />, text: 'No.7, 3rd Street, Sasthri Nagar, Adambakkam, Chennai – 600 088', href: 'https://www.google.com/maps/search/?api=1&query=No.7,+3rd+Street,+Sasthri+Nagar,+Adambakkam,+Chennai+600088' },
                { icon: <Globe size={14} />, text: 'www.outlookenterprises.in', href: 'https://www.outlookenterprises.in' },
                { icon: <Mail size={14} />, text: 'outlookenterprises2@gmail.com', href: 'mailto:outlookenterprises2@gmail.com' },
                { icon: <Phone size={14} />, text: '+91 80727 07041 / +91 70101 98326', href: 'tel:+918072707041' },
              ].map(({ icon, text, href }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-accent)', marginTop: 2, flexShrink: 0 }}>{icon}</span>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                    >{text}</a>
                  ) : text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
            © 2026 Outlook Enterprises. All Rights Reserved. Manufactured with 100% lead-free German profiles.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map((t) => (
              <span key={t} style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
