// Outlook Enterprises — Centralized Framer Motion Variants
import type { Variants } from 'framer-motion';

// Check for reduced motion preference
export const shouldReduceMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

// ─── Page Transitions ────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

// ─── Fade In Up ──────────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Fade In Left ────────────────────────────────────────────────
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Fade In Right ───────────────────────────────────────────────
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Stagger Container ───────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// ─── Stagger Item ────────────────────────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Scale In ────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Card Hover ──────────────────────────────────────────────────
export const cardHover: any = {
  whileHover: { y: -6, transition: { duration: 0.2, ease: 'easeOut' } },
  whileTap: { scale: 0.98 },
};

// ─── Button interactions ─────────────────────────────────────────
export const buttonTap: any = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// ─── Slide in from bottom (for modals/drawers) ───────────────────
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: 60,
    transition: { duration: 0.2 },
  },
};

// ─── Hero text stagger ───────────────────────────────────────────
export const heroTextVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const heroTextItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Reduced motion safe wrapper ────────────────────────────────
export function motionSafe<T extends Variants>(variants: T): T {
  if (shouldReduceMotion) {
    const safeVariants: Variants = {};
    for (const key in variants) {
      const v = variants[key];
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        safeVariants[key] = { opacity: (v as Record<string, unknown>).opacity ?? 1 } as any;
      }
    }
    return safeVariants as T;
  }
  return variants;
}
