'use client';

import React, { useEffect, useRef } from 'react';

interface CinematicBackgroundProps {
  opacity?: number;
  className?: string;
}

export default function CinematicBackground({ opacity = 0.95, className = '' }: CinematicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    window.addEventListener('resize', handleResize);

    // --- Particle System Configuration ---
    const PARTICLE_COUNT = Math.floor(Math.min(width, height) * 0.08) + 40;
    const BOKEH_COUNT = 14;
    const STREAK_COUNT = 7;
    const SHAPE_COUNT = 8;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;
      layer: number; // 0: bg (dim), 1: mid, 2: fg (bright)
    }

    interface Bokeh {
      x: number;
      y: number;
      radius: number;
      color: string;
      alpha: number;
      speedX: number;
      speedY: number;
      pulseSpeed: number;
      pulseAngle: number;
    }

    interface Streak {
      x: number;
      y: number;
      length: number;
      speed: number;
      width: number;
      color: string;
      alpha: number;
      angle: number;
    }

    interface GeoShape {
      x: number;
      y: number;
      size: number;
      type: 'triangle' | 'hexagon' | 'ring';
      rotation: number;
      rotSpeed: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
    }

    let particles: Particle[] = [];
    let bokehs: Bokeh[] = [];
    let streaks: Streak[] = [];
    let shapes: GeoShape[] = [];

    const neonColors = ['#3E7BFA', '#60A5FA', '#2563EB'];

    const initElements = () => {
      // Particles (rising underwater bubbles)
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const layer = Math.random() < 0.5 ? 0 : Math.random() < 0.8 ? 1 : 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: layer === 0 ? Math.random() * 1.5 + 0.5 : layer === 1 ? Math.random() * 2.5 + 1.2 : Math.random() * 3.5 + 2,
          speedY: -(Math.random() * 0.4 + 0.15 + layer * 0.1),
          speedX: Math.sin(Math.random() * Math.PI * 2) * 0.15,
          opacity: layer === 0 ? Math.random() * 0.3 + 0.1 : layer === 1 ? Math.random() * 0.5 + 0.2 : Math.random() * 0.4 + 0.5,
          color: neonColors[Math.floor(Math.random() * neonColors.length)],
          layer,
        };
      });

      // Bokeh Orbs (Background layer)
      bokehs = Array.from({ length: BOKEH_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 80 + 40,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        alpha: Math.random() * 0.15 + 0.05,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        pulseAngle: Math.random() * Math.PI * 2,
      }));

      // Light Streaks (Lower-left to upper-right)
      streaks = Array.from({ length: STREAK_COUNT }, () => ({
        x: Math.random() * width - width * 0.2,
        y: Math.random() * height + height * 0.2,
        length: Math.random() * 250 + 150,
        speed: Math.random() * 1.2 + 0.6,
        width: Math.random() * 2 + 1,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        alpha: Math.random() * 0.4 + 0.2,
        angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.1, // ~45 deg diagonal
      }));

      // Geometric Shapes
      const types: ('triangle' | 'hexagon' | 'ring')[] = ['triangle', 'hexagon', 'ring'];
      shapes = Array.from({ length: SHAPE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 35 + 20,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006, // 0.5 - 1 RPM
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.2 + 0.05),
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        alpha: Math.random() * 0.25 + 0.1,
      }));
    };

    initElements();

    let gridTime = 0;
    let auroraTime = 0;

    const render = () => {
      gridTime += 0.015;
      auroraTime += 0.008;

      // 1. Deep Dark Background
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, width, height);

      // 2. Faint Pulsing Digital Grid / Mesh
      ctx.save();
      const gridOpacity = Math.sin(gridTime) * 0.03 + 0.04;
      ctx.strokeStyle = `rgba(62, 123, 250, ${gridOpacity})`;
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Ambient Mid-Section Aurora Glow Sweep
      ctx.save();
      const auroraY = height * 0.5 + Math.sin(auroraTime) * 100;
      const auroraGrad = ctx.createLinearGradient(0, auroraY - 250, width, auroraY + 250);
      auroraGrad.addColorStop(0, 'rgba(37, 99, 235, 0)');
      auroraGrad.addColorStop(0.5, 'rgba(62, 123, 250, 0.07)');
      auroraGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');
      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 4. Soft Bokeh Orbs (Background)
      bokehs.forEach((b) => {
        b.x += b.speedX;
        b.y += b.speedY;
        b.pulseAngle += b.pulseSpeed;
        const currentAlpha = b.alpha + Math.sin(b.pulseAngle) * 0.03;

        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = height + b.radius;
        if (b.y > height + b.radius) b.y = -b.radius;

        ctx.save();
        const radGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        radGrad.addColorStop(0, hexToRgba(b.color, currentAlpha));
        radGrad.addColorStop(1, hexToRgba(b.color, 0));
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Diagonal Light Streaks (Lower-left -> Upper-right)
      streaks.forEach((s) => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        if (s.x > width + s.length || s.y < -s.length) {
          s.x = Math.random() * width - width * 0.4;
          s.y = height + Math.random() * 200;
        }

        ctx.save();
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;
        const lineGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        lineGrad.addColorStop(0, hexToRgba(s.color, 0));
        lineGrad.addColorStop(0.7, hexToRgba(s.color, s.alpha * 0.5));
        lineGrad.addColorStop(1, hexToRgba('#ffffff', s.alpha));

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = s.width;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.restore();
      });

      // 6. Geometric Floating Shapes
      shapes.forEach((sh) => {
        sh.x += sh.speedX;
        sh.y += sh.speedY;
        sh.rotation += sh.rotSpeed;

        if (sh.y < -sh.size * 2) {
          sh.y = height + sh.size * 2;
          sh.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(sh.x, sh.y);
        ctx.rotate(sh.rotation);
        ctx.strokeStyle = hexToRgba(sh.color, sh.alpha);
        ctx.lineWidth = 1.5;
        ctx.shadowColor = sh.color;
        ctx.shadowBlur = 10;

        if (sh.type === 'ring') {
          ctx.beginPath();
          ctx.arc(0, 0, sh.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (sh.type === 'triangle') {
          ctx.beginPath();
          const r = sh.size / 2;
          ctx.moveTo(0, -r);
          ctx.lineTo(r * 0.866, r * 0.5);
          ctx.lineTo(-r * 0.866, r * 0.5);
          ctx.closePath();
          ctx.stroke();
        } else if (sh.type === 'hexagon') {
          ctx.beginPath();
          const r = sh.size / 2;
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            const px = r * Math.cos(a);
            const py = r * Math.sin(a);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      });

      // 7. Rising Particle Flow (Bottom -> Top)
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.2 + p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = hexToRgba(p.color, p.opacity);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.layer === 2 ? 10 : 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 8. Subtle Corner Vignette
      ctx.save();
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.max(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`cinematic-bg-canvas ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: opacity,
      }}
    />
  );
}

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
