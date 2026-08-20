'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
function useIsTouchDevice() {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    () => false
  );
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Real mouse position
  const mouse = useRef({ x: -100, y: -100 });
  // Trailing position for ring (smoothed with lerp)
  const ring = useRef({ x: -100, y: -100 });

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isTouchDevice = useIsTouchDevice();
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Check if mouse is hovering over clickable/interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest('a, button, input, select, textarea, [role="button"], [data-hover], .btn-primary, .btn-secondary, .clickable, .glass-card')
        );
        setIsHovered(interactive);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    let rafId: number;

    const render = () => {
      // Linear interpolation (lerp) for smooth 60fps trailing effect
      const lerpFactor = 0.16;
      ring.current.x += (mouse.current.x - ring.current.x) * lerpFactor;
      ring.current.y += (mouse.current.y - ring.current.y) * lerpFactor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ring.current.x += (mouse.current.x - ring.current.x) * lerpFactor;
        ring.current.y += (mouse.current.y - ring.current.y) * lerpFactor;
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 300ms ease',
      }}
    >
      {/* Small Inner Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '10px' : '6px',
          height: isHovered ? '10px' : '6px',
          borderRadius: '50%',
          backgroundColor: isHovered ? '#60a5fa' : '#3E7BFA',
          boxShadow: isHovered ? '0 0 12px #3E7BFA' : '0 0 6px rgba(62,123,250,0.8)',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'width 200ms ease, height 200ms ease, background-color 200ms ease',
        }}
      />

      {/* Smooth Trailing Outer Ring / Glow */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '54px' : '36px',
          height: isHovered ? '54px' : '36px',
          borderRadius: '50%',
          border: isHovered
            ? '1.5px solid rgba(96, 165, 250, 0.8)'
            : '1.5px solid rgba(62, 123, 250, 0.4)',
          backgroundColor: isHovered
            ? 'rgba(62, 123, 250, 0.12)'
            : 'rgba(62, 123, 250, 0.03)',
          backdropFilter: isHovered ? 'blur(1px)' : 'none',
          boxShadow: isHovered
            ? '0 0 20px rgba(62, 123, 250, 0.35), inset 0 0 10px rgba(96, 165, 250, 0.2)'
            : 'none',
          transformOrigin: 'center center',
          transform: isMouseDown ? 'scale(0.85)' : 'scale(1)',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'width 250ms ease, height 250ms ease, border-color 250ms ease, background-color 250ms ease, box-shadow 250ms ease, scale 150ms ease',
        }}
      />
    </div>
  );
}
