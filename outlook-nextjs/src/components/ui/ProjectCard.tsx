'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Project } from '@/lib/types';
import { cardHover, staggerItem } from '@/lib/animations';
import { MapPin, Package, Maximize2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const catColor = project.category === 'Commercial' ? '#fbbf24' : '#34d399';
  const catBg = project.category === 'Commercial' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';

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
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(62,123,250,0.3)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)')}
    >
      <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(19,21,26,0.85) 0%, transparent 55%)' }} />
        <span style={{ position: 'absolute', top: 14, left: 14, background: catBg, color: catColor, border: `1px solid ${catColor}40`, borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {project.category}
        </span>
        {project.area && (
          <span style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(19,21,26,0.7)', backdropFilter: 'blur(8px)', borderRadius: '0.4rem', padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Maximize2 size={11} />{project.area}
          </span>
        )}
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{project.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
          <MapPin size={13} style={{ color: 'var(--color-accent)' }} />
          {project.location}
        </div>
        {project.productUsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
            <Package size={13} style={{ color: 'var(--color-accent)' }} />
            {project.productUsed}
          </div>
        )}
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
          {project.details}
        </p>
      </div>
    </motion.div>
  );
}
