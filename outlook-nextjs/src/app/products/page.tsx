'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import ProductCard from '@/components/ui/ProductCard';
import { PRODUCTS } from '@/lib/data';
import type { Product } from '@/lib/types';

type Filter = 'all' | 'windows' | 'doors' | 'partitions';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All Systems' },
  { key: 'windows', label: 'UPVC Windows' },
  { key: 'doors', label: 'Patio & Balcony Doors' },
  { key: 'partitions', label: 'Acoustic Partitions' },
];

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const filtered: Product[] = activeFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Header */}
      <section style={{ padding: '5rem 1.5rem 3rem', background: 'linear-gradient(180deg, rgba(62,123,250,0.06) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="gradient-mesh" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="section-header"
          style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}
        >
          <span className="badge badge-blue">Product Catalog</span>
          <h1 className="section-title">Explore Our <span className="text-gradient">Premium UPVC</span> Systems</h1>
          <p className="section-desc">Custom crafted sliding windows, casement doors, French balconies, and acoustic partitions — each starting from ₹450/sq.ft.</p>
        </motion.div>
      </section>

      {/* Filter Tabs */}
      <section style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div ref={ref} className="filter-bar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '0.625rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isActive ? '1px solid rgba(62,123,250,0.4)' : '1px solid var(--color-border)',
                    background: isActive ? 'rgba(62,123,250,0.15)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {filter.label}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={activeFilter}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}
            className="products-grid-custom"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              No products in this category yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
