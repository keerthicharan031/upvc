'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { INITIAL_REVIEWS } from './data';
import type { Review } from './types';

interface ReviewsStore {
  reviews: Review[];
  isLoaded: boolean;
  isLoading: boolean;
  addReview: (review: Omit<Review, 'id' | 'date' | 'avatarBg'>) => Promise<Review>;
  refreshReviews: () => Promise<void>;
  getMetrics: () => {
    average: number;
    total: number;
    breakdown: Record<number, number>; // 5: count, 4: count, etc.
  };
}

const ReviewsContext = createContext<ReviewsStore | null>(null);

export const REVIEWS_STORAGE_KEY = 'outlook_customer_reviews';
export const REVIEWS_SYNC_EVENT = 'outlook_reviews_sync_event';

const AVATAR_PALETTE = ['#3E7BFA', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => INITIAL_REVIEWS);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadFromStorage = useCallback((): Review[] => {
    if (typeof window === 'undefined') return INITIAL_REVIEWS;
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Review[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
          return parsed;
        }
      }
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      setReviews(INITIAL_REVIEWS);
      return INITIAL_REVIEWS;
    } catch (e) {
      console.warn('Failed to load reviews from localStorage', e);
      return INITIAL_REVIEWS;
    }
  }, []);

  const saveToStorage = (updated: Review[]) => {
    setReviews(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(REVIEWS_SYNC_EVENT, { detail: updated }));
      } catch (e) {
        console.error('Failed to save reviews to localStorage', e);
      }
    }
  };

  const refreshReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          saveToStorage(data.reviews);
        }
      }
    } catch (err) {
      console.warn('Failed to refresh reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    setIsLoaded(true);
    refreshReviews();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === REVIEWS_STORAGE_KEY || !e.key) {
        loadFromStorage();
      }
    };

    const handleCustomSync = () => {
      loadFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(REVIEWS_SYNC_EVENT, handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(REVIEWS_SYNC_EVENT, handleCustomSync);
    };
  }, [loadFromStorage, refreshReviews]);

  const addReview = async (reviewData: Omit<Review, 'id' | 'date' | 'avatarBg'>): Promise<Review> => {
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4) + Math.floor(100 + Math.random() * 900);
    const randomBg = AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)];
    const newReview: Review = {
      ...reviewData,
      id: `REV-${uniqueSuffix}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      verified: true,
      avatarBg: randomBg,
    };

    // 1. Optimistically update local state & localStorage
    setReviews((prev) => {
      const next = [newReview, ...prev.filter((r) => r.id !== newReview.id)];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent(REVIEWS_SYNC_EVENT, { detail: next }));
        } catch { /* ignore */ }
      }
      return next;
    });

    // 2. Persist to server / Supabase
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
    } catch (err) {
      console.warn('Failed to submit review to server:', err);
    }

    return newReview;
  };

  const getMetrics = () => {
    const total = reviews.length;
    if (total === 0) return { average: 5.0, total: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      breakdown[rating] = (breakdown[rating] || 0) + 1;
      sum += r.rating;
    });

    const average = Number((sum / total).toFixed(1));
    return { average, total, breakdown };
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        isLoaded,
        isLoading,
        addReview,
        refreshReviews,
        getMetrics,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews(): ReviewsStore {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
}
