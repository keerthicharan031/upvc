'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { staggerContainer, staggerItem } from '@/lib/animations';
import ProductCard from '@/components/ui/ProductCard';
import ProjectCard from '@/components/ui/ProjectCard';
import { PRODUCTS, PROJECTS } from '@/lib/data';
import { Zap, ArrowRight, Volume2, Wind, Leaf, Lock, ChevronRight } from 'lucide-react';

const WHY_FEATURES = [
  {
    icon: <Volume2 size={22} />,
    title: '42 dB Acoustic Proofing',
    stat: '42 dB',
    desc: 'Multi-chambered profiles paired with double-glazed acoustic glass block city traffic and street noise completely.',
    detail: 'Rated Class 9A for wind & water tightness. Fusion-welded corners ensure zero noise leakage.',
  },
  {
    icon: <Leaf size={22} />,
    title: '40% AC Energy Savings',
    stat: '40%',
    desc: 'UPVC is a natural non-conductor of heat. Keep your indoors up to 8°C cooler and reduce power bills dramatically.',
    detail: 'Low-E glass option further reduces solar gain by up to 70%, cutting cooling loads year-round.',
  },
  {
    icon: <Lock size={22} />,
    title: 'German Multi-Point Locks',
    stat: '5-Point',
    desc: 'High-security shootbolts engage along multiple frame points, providing maximum anti-burglary protection.',
    detail: 'Certified to European EN 1627 RC2 burglar resistance class. Available with biometric upgrade.',
  },
  {
    icon: <Wind size={22} />,
    title: '100% Water & Wind Tight',
    stat: 'Class 9A',
    desc: 'Special fusion-welded corners and EPDM rubber seals guarantee zero water leakage even during heavy monsoon storms.',
    detail: 'Tested to 600 Pa wind load resistance. ISO-certified weatherproofing for coastal environments.',
  },
];

function WhyUPVCSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} style={{ padding: '7rem 1.5rem', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="badge badge-gold">Superior Engineering</span>
          <h2 className="section-title">Engineered For Extreme Comfort & Longevity</h2>
          <p className="section-desc">Why top architects and homeowners across Hyderabad specify Outlook UPVC profile systems.</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}
        >
          {WHY_FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '1rem',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              whileHover={{ y: -4 }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(62,123,250,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
            >
              <div className="feature-icon-wrap" style={{ color: 'var(--color-accent)' }}>{f.icon}</div>
              <div style={{ display: 'inline-block', background: 'rgba(62,123,250,0.1)', border: '1px solid rgba(62,123,250,0.2)', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.75rem' }}>{f.stat}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <Link href="/why-upvc" className="btn-secondary" style={{ display: 'inline-flex' }}>
            Deep Dive into Why UPVC <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProductsPreviewSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '5rem 1.5rem', background: 'var(--section-alt-bg)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="badge badge-blue">Product Catalog</span>
          <h2 className="section-title">Explore Our Premium UPVC Systems</h2>
          <p className="section-desc">Custom crafted sliding windows, casement doors, French balconies, and acoustic partitions.</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
        >
          {PRODUCTS.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', fontSize: '1rem', padding: '0.875rem 2.5rem' }}>
            View All 7 Systems <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectsTeaserSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="badge badge-blue">Portfolio Gallery</span>
          <h2 className="section-title">Recent Completed Installations</h2>
          <p className="section-desc">Landmark residential villas, penthouses, and commercial HQs across Hyderabad.</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <Link href="/projects" className="btn-secondary" style={{ display: 'inline-flex' }}>
            View Full Portfolio <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ConsultationBand() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section style={{ padding: '6rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="consult-inner"
          style={{
            background: 'linear-gradient(135deg, rgba(62,123,250,0.12) 0%, rgba(62,123,250,0.05) 100%)',
            border: '1px solid rgba(62,123,250,0.25)',
            borderRadius: '1.5rem',
            padding: '4rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-30%', left: '-10%', width: '50%', height: '200%', background: 'radial-gradient(ellipse, rgba(62,123,250,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <span className="badge badge-green" style={{ marginBottom: '1.5rem' }}>Free Consultation</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Transform Your Space?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Our expert engineer will visit your location with premium sample profile kits. No obligations — just honest advice and a detailed site estimate.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/enquiry" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem' }}>
                <Zap size={16} /> Schedule Free Site Measurement
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/calculator" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem' }}>
                🧮 Get Instant Quote
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import AnimatedHero from '@/components/ui/AnimatedHero';
import ReviewsSection from '@/components/ui/ReviewsSection';

export default function HomePage() {
  return (
    <>
      <AnimatedHero />
      <WhyUPVCSection />
      <ProductsPreviewSection />
      <ProjectsTeaserSection />
      <ReviewsSection />
      <ConsultationBand />
    </>
  );
}

