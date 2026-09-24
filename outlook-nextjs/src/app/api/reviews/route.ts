import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Review } from '@/lib/types';
import { INITIAL_REVIEWS } from '@/lib/data';
import fs from 'fs';
import path from 'path';

// Server-side persistent in-memory store in globalThis
declare global {
  var __OUTLOOK_REVIEWS_STORE: Review[] | undefined;
}

const CACHE_FILE_PATH = path.join(process.cwd(), '.reviews_cache.json');

function loadServerReviews(): Review[] {
  if (globalThis.__OUTLOOK_REVIEWS_STORE && Array.isArray(globalThis.__OUTLOOK_REVIEWS_STORE)) {
    return globalThis.__OUTLOOK_REVIEWS_STORE;
  }

  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const data = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__OUTLOOK_REVIEWS_STORE = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read .reviews_cache.json:', err);
  }

  globalThis.__OUTLOOK_REVIEWS_STORE = [...INITIAL_REVIEWS];
  return globalThis.__OUTLOOK_REVIEWS_STORE;
}

function saveServerReviews(reviews: Review[]) {
  globalThis.__OUTLOOK_REVIEWS_STORE = reviews;
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (err) {
    // In read-only serverless environment, in-memory store will still work
    console.warn('Could not persist to .reviews_cache.json (serverless read-only filesystem):', err);
  }
}

const AVATAR_PALETTE = ['#3E7BFA', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

// GET /api/reviews - Fetch all approved reviews
export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted = data.map((r: Record<string, unknown>) => ({
            id: String(r.id),
            name: String(r.name || ''),
            location: String(r.location || ''),
            rating: Number(r.rating) || 5,
            product: String(r.product || ''),
            comment: String(r.comment || ''),
            date: String(r.date || ''),
            verified: Boolean(r.verified ?? true),
            avatarBg: String(r.avatar_bg || r.avatarBg || '#3E7BFA'),
            created_at: r.created_at,
          }));

          return NextResponse.json({
            success: true,
            source: 'supabase',
            reviews: formatted,
          });
        }
        if (error) {
          console.error('Supabase query error:', error.message);
        }
      }
    }

    // Fallback to server store if Supabase fails or is not configured
    const currentReviews = loadServerReviews();
    return NextResponse.json({
      success: true,
      source: 'server_store',
      reviews: currentReviews,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const fallbackReviews = loadServerReviews();
    return NextResponse.json(
      { success: false, error: message, reviews: fallbackReviews },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit a new review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, rating, product, comment } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Name, star rating, and review comment are required.' },
        { status: 400 }
      );
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(String(rating), 10) || 5));
    const randomBg = AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)];
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4) + Math.floor(100 + Math.random() * 900);

    const newReview: Review = {
      id: `REV-${uniqueSuffix}`,
      name: String(name).trim(),
      location: location ? String(location).trim() : 'Chennai',
      rating: numericRating,
      product: product ? String(product).trim() : 'UPVC Windows & Doors',
      comment: String(comment).trim(),
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      verified: true,
      avatarBg: randomBg,
    };

    // 1. Always save to server persistence store so all admins / sessions see it
    const currentReviews = loadServerReviews();
    const updatedReviews = [newReview, ...currentReviews];
    saveServerReviews(updatedReviews);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { error } = await supabase.from('reviews').insert([
          {
            id: newReview.id,
            name: newReview.name,
            location: newReview.location,
            rating: newReview.rating,
            product: newReview.product,
            comment: newReview.comment,
            date: newReview.date,
            verified: newReview.verified,
            avatar_bg: newReview.avatarBg,
          },
        ]);

        if (error) {
          console.error('Error inserting review to Supabase:', error.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      review: newReview,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
