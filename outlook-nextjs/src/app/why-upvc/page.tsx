'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Volume2, Leaf, Lock, Wind, CheckCircle, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: <Volume2 size={28} />,
    title: '42 dB Acoustic Proofing',
    stat: '42 dB',
    badge: 'badge-blue',
    desc: 'Multi-chambered UPVC profiles create separate air pockets that act as natural sound buffers. Paired with our 24mm Double Glazed Acoustic Unit (DGU), the system achieves up to 42 dB sound reduction.',
    points: ['Multi-chamber profiles with internal steel core reinforcement', 'EPDM co-extruded gaskets for airtight acoustic seal', '24mm DGU with acoustic interlayer glass option', 'Fusion-welded corners for zero sound leakage at joints', 'Certified to ISO 140 airborne sound test standards'],
    metric: { label: 'Street noise blocked', value: '70%+' },
  },
  {
    icon: <Leaf size={28} />,
    title: '40% AC Energy Savings',
    stat: '40%',
    badge: 'badge-green',
    desc: 'UPVC has an inherently low thermal conductivity of 0.17 W/m·K — 1000× less conductive than aluminium. This means your AC works dramatically less to maintain comfort.',
    points: ['Low-E (low-emissivity) glass option with 0.04 emissivity', 'Keeps interior up to 8°C cooler in Hyderabad summers', 'Reduces solar heat gain coefficient (SHGC) by up to 60%', 'Thermal break profile design prevents cold/hot bridging', 'ROI on energy savings within 4–5 years'],
    metric: { label: 'Annual electricity savings', value: '₹15,000+' },
  },
  {
    icon: <Lock size={28} />,
    title: 'German Multi-Point Security',
    stat: '5-Point',
    badge: 'badge-gold',
    desc: 'Every Outlook system ships with high-security German hardware. Multi-point shootbolt locks engage simultaneously at 5 or more frame points when the handle is turned.',
    points: ['5-point simultaneous locking mechanism', 'European EN 1627 RC2 burglar resistance rating', 'Anti-drill, anti-pick, anti-snap cylinder protection', 'Optional Biometric / Digital handle upgrade', 'Anti-slam child-safety restrictor on windows'],
    metric: { label: 'Higher than single-point locks', value: '400% stronger' },
  },
  {
    icon: <Wind size={28} />,
    title: '100% Water & Wind Tight',
    stat: 'Class 9A',
    badge: 'badge-green',
    desc: 'Outlook UPVC systems are rated Water Tightness Class 9A — the highest residential rating. Triple EPDM perimeter seals and precision-welded PVC corners prevent any water ingress.',
    points: ['Tested to 600 Pa dynamic wind pressure', 'Water tightness rated to 600 Pa per EN 12208', 'Triple-layer EPDM rubber perimeter gaskets', 'Stainless steel drainage channels with anti-insect flaps', 'Corrosion-proof — ideal for coastal & monsoon climates'],
    metric: { label: 'Weather tightness rating', value: 'Class 9A' },
  },
];

const COMPARISON = [
  { feature: 'Sound Insulation', upvc: '42 dB', aluminium: '28 dB', wood: '30 dB' },
  { feature: 'Thermal Insulation', upvc: 'Excellent', aluminium: 'Poor', wood: 'Good' },
  { feature: 'Maintenance Required', upvc: 'Zero', aluminium: 'Low', wood: 'High (annual)' },
  { feature: 'Termite / Pest Risk', upvc: 'None', aluminium: 'None', wood: 'High' },
  { feature: 'Rust / Corrosion', upvc: 'Zero', aluminium: 'Moderate', wood: 'None' },
  { feature: 'Lifespan', upvc: '25–30 yrs', aluminium: '15–20 yrs', wood: '10–15 yrs' },
  { feature: 'Energy Cost Impact', upvc: '-40%', aluminium: '+20%', wood: '-10%' },
  { feature: 'Security Rating', upvc: 'RC2 Class', aluminium: 'Standard', wood: 'Basic' },
];

type Feature = typeof FEATURES[number];

// Extracted into its own component so hooks are called at the top level — Rules of Hooks compliance
function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="feature-deep-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
      }}
    >
      {/* Content */}
      <div style={{ order: isEven ? 0 : 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="feature-icon-wrap" style={{ color: 'var(--color-accent)' }}>{feature.icon}</div>
          <span className={`badge ${feature.badge}`}>{feature.stat}</span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, marginBottom: '1rem' }}>{feature.title}</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{feature.desc}</p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {feature.points.map((p) => (
            <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              <CheckCircle size={14} style={{ color: 'var(--color-accent)', marginTop: 2, flexShrink: 0 }} />
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Metric card */}
      <div style={{ order: isEven ? 1 : 0 }}>
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1 }} className="text-gradient">{feature.stat}</div>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem', fontSize: '0.95rem' }}>{feature.metric.label}</p>
          <div style={{ marginTop: '1.5rem', background: 'rgba(62,123,250,0.08)', border: '1px solid rgba(62,123,250,0.15)', borderRadius: '0.625rem', padding: '0.75rem 1.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{feature.metric.value}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyUPVCPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Header */}
      <section style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(180deg, rgba(62,123,250,0.06) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="gradient-mesh" />
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="section-header"
          style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}
        >
          <span className="badge badge-gold">Superior Engineering</span>
          <h1 className="section-title">Why UPVC Is the <span className="text-gradient">Smart Choice</span></h1>
          <p className="section-desc">The science and engineering behind why 15,000+ windows in Hyderabad are now Outlook UPVC.</p>
        </motion.div>
      </section>

      {/* Feature Deep Dives */}
      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {FEATURES.map((feature, i) => (
            <FeatureItem key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--section-alt-bg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="section-header">
            <span className="badge badge-blue">Material Comparison</span>
            <h2 className="section-title">UPVC vs Aluminium vs Wood</h2>
            <p className="section-desc">An objective look at how UPVC compares across every performance dimension.</p>
          </div>

          <div className="comparison-table-wrap glass-card" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
              <thead>
                <tr style={{ background: 'rgba(62,123,250,0.08)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 700 }}>UPVC ✓</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Aluminium</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Wood</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--table-alt-row)' }}>
                    <td style={{ padding: '0.9rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ padding: '0.9rem 1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-accent)', fontWeight: 700 }}>{row.upvc}</td>
                    <td style={{ padding: '0.9rem 1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{row.aluminium}</td>
                    <td style={{ padding: '0.9rem 1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{row.wood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              Explore Our Products <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
