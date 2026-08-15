'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import ProjectCard from '@/components/ui/ProjectCard';
import { PROJECTS } from '@/lib/data';
import type { Project } from '@/lib/types';

type Filter = 'All' | 'Residential' | 'Commercial';

const FILTERS: Filter[] = ['All', 'Residential', 'Commercial'];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const filtered: Project[] = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ padding: '5rem 1.5rem 3rem', background: 'linear-gradient(180deg, rgba(62,123,250,0.06) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="gradient-mesh" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="section-header"
          style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}
        >
          <span className="badge badge-blue">Portfolio Gallery</span>
          <h1 className="section-title">Recent <span className="text-gradient">Completed</span> Installations</h1>
          <p className="section-desc">Landmark residential villas, luxury penthouses, and commercial headquarters across Hyderabad.</p>
        </motion.div>
      </section>

      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem' }}>
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '0.65rem 1.6rem',
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
                  {filter}
                </motion.button>
              );
            })}
          </div>

          <div ref={ref}>
            <motion.div
              key={activeFilter}
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}
            >
              {filtered.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'linear-gradient(135deg, rgba(62,123,250,0.08) 0%, rgba(62,123,250,0.03) 100%)', border: '1px solid rgba(62,123,250,0.15)', borderRadius: '1.25rem' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Project Could Be Next</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.75rem', maxWidth: 460, margin: '0 auto 1.75rem' }}>
              Let our engineers visit your site, take measurements, and design the perfect UPVC solution.
            </p>
            <a href="/enquiry" className="btn-primary" style={{ display: 'inline-flex', fontSize: '1rem', padding: '0.875rem 2.25rem' }}>
              Schedule Free Consultation
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
