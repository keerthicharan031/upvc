import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Review } from '@/lib/types';

const AVATAR_PALETTE = ['#3E7BFA', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

// GET /api/reviews - Fetch all approved reviews
export async function GET() {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured in environment variables.' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Failed to initialize Supabase client.' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews from Supabase:', error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const formatted = (data || []).map((r: Record<string, unknown>) => ({
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
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

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured in environment variables.' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase client initialization failed' }, { status: 500 });
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

    const { data: insertedData, error } = await supabase.from('reviews').insert([
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
    ]).select().single();

    if (error) {
      console.error('Error inserting review to Supabase:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      review: {
        id: String(insertedData.id),
        name: String(insertedData.name),
        location: String(insertedData.location),
        rating: Number(insertedData.rating),
        product: String(insertedData.product),
        comment: String(insertedData.comment),
        date: String(insertedData.date),
        verified: Boolean(insertedData.verified),
        avatarBg: String(insertedData.avatar_bg || insertedData.avatarBg),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
