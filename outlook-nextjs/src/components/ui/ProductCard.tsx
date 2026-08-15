'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { cardHover, staggerItem } from '@/lib/animations';
import { Zap, CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const BADGE_STYLE: Record<string, React.CSSProperties> = {
  'badge-blue': { background: 'rgba(62,123,250,0.15)', color: '#7eb3ff', border: '1px solid rgba(62,123,250,0.2)' },
  'badge-green': { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' },
  'badge-gold': { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' },
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      {...cardHover}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(62,123,250,0.3)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)')}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(19,21,26,0.6) 0%, transparent 60%)' }} />
        <span className="badge" style={{ position: 'absolute', top: 12, left: 12, ...BADGE_STYLE[product.badgeClass], fontSize: '0.7rem' }}>
          {product.tag}
        </span>
        <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(19,21,26,0.8)', backdropFilter: 'blur(8px)', borderRadius: '0.4rem', padding: '0.25rem 0.6rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)' }}>
          ₹{product.pricePerSqFt}/sq.ft
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {product.description}
          </p>
        </div>

        <ul className="spec-list">
          {product.specs.map((spec) => (
            <li key={spec} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              <CheckCircle size={12} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              {spec}
            </li>
          ))}
        </ul>

        {/* Colors */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {product.colors.map((c) => (
            <span key={c} style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', borderRadius: '0.35rem', padding: '0.2rem 0.5rem' }}>{c}</span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/visualizer?system=${product.id}`}
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, rgba(62,123,250,0.2) 0%, rgba(62,123,250,0.1) 100%)', border: '1px solid rgba(62,123,250,0.3)', borderRadius: '0.625rem', padding: '0.65rem 1rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(62,123,250,0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(62,123,250,0.2) 0%, rgba(62,123,250,0.1) 100%)'; }}
        >
          <Zap size={14} /> Customize ⚡
        </Link>
      </div>
    </motion.div>
  );
}
