'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ShieldCheck, Volume2, SunMedium } from 'lucide-react';

import { useTheme } from 'next-themes';

const TOTAL_FRAMES = 50;

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function AnimatedHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const mounted = useIsMounted();
  const { theme, resolvedTheme } = useTheme();

  const isDark = mounted ? (resolvedTheme || theme) === 'dark' : true;

  // Animation & Lerp references
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastMouseTimeRef = useRef<number>(0);
  const autoPlayDirRef = useRef<number>(1); // 1 = forward, -1 = reverse

  useEffect(() => {
    lastMouseTimeRef.current = Date.now();
    // 1. Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Preload 49 JPG Frames
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${numStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        // Fallback progress on missing frame
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setIsLoaded(true);
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;

    // 3. Setup Canvas & Resize Handler
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 4. Render Loop with LERP
    let animFrameId: number;

    const render = () => {
      if (!prefersReducedMotion) {
        targetFrameRef.current += 0.1; // Slower, more cinematic forward speed
        if (targetFrameRef.current >= TOTAL_FRAMES) {
          targetFrameRef.current = 0;
          currentFrameRef.current = 0; // Prevent lerp snapping back
        }
      }

      // Responsive lerp for natural video motion
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.1;

      // Draw active frame to canvas using object-fit: cover aspect math
      const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
      const activeImg = imagesRef.current[frameIdx];

      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imgRatio = activeImg.naturalWidth / activeImg.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let drawW: number, drawH: number, offsetX: number, offsetY: number;

        if (canvasRatio > imgRatio) {
          drawW = canvas.width;
          drawH = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawH) / 2;
        } else {
          drawW = canvas.height * imgRatio;
          drawH = canvas.height;
          offsetX = (canvas.width - drawW) / 2;
          offsetY = 0;
        }

        ctx.drawImage(activeImg, offsetX, offsetY, drawW, drawH);
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--color-bg)',
        cursor: 'default',
      }}
    >
      {/* 1. Canvas Interactive Background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* 2. Poster Fallback for Initial Paint / Static Fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* 3. High-Contrast Gradient Dark/Light Overlay for Legibility (WCAG AA) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: isDark
            ? `
              linear-gradient(to right, rgba(10, 10, 26, 0.88) 0%, rgba(10, 10, 26, 0.65) 45%, rgba(10, 10, 26, 0.35) 100%),
              linear-gradient(to top, rgba(10, 10, 26, 0.95) 0%, transparent 60%)
            `
            : `
              linear-gradient(to right, rgba(248, 250, 252, 0.72) 0%, rgba(248, 250, 252, 0.45) 35%, rgba(248, 250, 252, 0.08) 60%, transparent 100%),
              linear-gradient(to top, rgba(248, 250, 252, 0.65) 0%, rgba(248, 250, 252, 0.15) 30%, transparent 55%)
            `,
          transition: 'background 0.3s ease',
        }}
      />


      {/* 5. Clean, Professional Hero Content Block */}
      <div
        className="hero-content-block"
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '8rem 1.5rem 4rem',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '2rem',
              background: 'rgba(62, 123, 250, 0.12)',
              border: '1px solid rgba(62, 123, 250, 0.3)',
              color: 'var(--color-accent)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <ShieldCheck size={15} />
            <span>German Profile Engineering & Anti-UV Protection</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Premium uPVC Windows & Doors, <span className="text-gradient">Built to Last</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
              lineHeight: 1.65,
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
              maxWidth: '580px',
            }}
          >
            Experience 42 dB soundproofing, 40% AC energy reduction, zero termite risk, and European architectural luxury engineered for a lifetime.
          </motion.p>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            <Link href="/calculator" className="btn-primary" style={{ fontSize: '0.98rem', padding: '0.85rem 1.8rem' }}>
              <Zap size={16} /> Get a Free Quote
            </Link>
            <Link href="/visualizer" className="btn-secondary" style={{ fontSize: '0.98rem', padding: '0.85rem 1.6rem' }}>
              Design & Customize 🎨
            </Link>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-trust-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <Volume2 size={16} style={{ color: 'var(--color-accent)' }} />
              <span><strong>42 dB</strong> Noise Cut</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <SunMedium size={16} style={{ color: '#f59e0b' }} />
              <span><strong>40%</strong> Energy Savings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} style={{ color: '#10b981' }} />
              <span><strong>10-Year</strong> Solid Warranty</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
