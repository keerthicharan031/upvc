'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

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



export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.warn('Failed to refresh reviews:', err);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refreshReviews();
  }, [refreshReviews]);

  const addReview = async (reviewData: Omit<Review, 'id' | 'date' | 'avatarBg'>): Promise<Review> => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error('Supabase DB Error:', data);
        throw new Error(data.error || 'Failed to submit review');
      }

      await refreshReviews();
      
      return data.review;
    } catch (err) {
      console.error('Failed to submit review to server:', err);
      throw err;
    }
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
