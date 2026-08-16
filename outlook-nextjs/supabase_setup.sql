-- ============================================================
-- Outlook Enterprises UPVC CRM - Supabase Table Schema Setup
-- Copy and run this script in the Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ============================================================

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    product TEXT NOT NULL,
    area TEXT DEFAULT 'TBD',
    value TEXT DEFAULT '₹ TBD',
    status TEXT DEFAULT 'New',
    date TEXT NOT NULL,
    notes TEXT,
    source TEXT DEFAULT 'Direct Enquiry',
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index for fast status and search queries
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Allow public submissions (anyone can insert an enquiry)
CREATE POLICY "Allow public insert to leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- 5. Allow full read and update access
CREATE POLICY "Allow read and manage leads" 
ON public.leads 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Optional: Seed initial demo data
INSERT INTO public.leads (id, name, phone, product, area, value, status, date, source)
VALUES
('LD-INIT-01', 'Kavitha Ramachandran', '+91 98401 23456', 'Sliding Windows (3-Track)', '380 sq ft', '₹ 3,25,000', 'New', '12 Aug 2026', 'Direct Enquiry'),
('LD-INIT-02', 'Siddharth Menon', '+91 97910 87654', 'Lift & Slide Patio Doors', '520 sq ft', '₹ 5,80,000', 'Quoted', '10 Aug 2026', 'Web Calculator'),
('LD-INIT-03', 'Dr. Arunachalam V.', '+91 94440 11223', 'European Tilt & Turn Windows', '240 sq ft', '₹ 2,10,000', 'Confirmed', '08 Aug 2026', 'Visualizer')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. Create reviews table for Public Ratings & Testimonials
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    product TEXT NOT NULL,
    comment TEXT NOT NULL,
    date TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    avatar_bg TEXT DEFAULT '#3E7BFA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for reviews ordering
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON public.reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews (rating DESC);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all reviews
CREATE POLICY "Allow public read reviews"
ON public.reviews
FOR SELECT
USING (true);

-- Allow public to submit reviews
CREATE POLICY "Allow public insert reviews"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Allow admin full manage access to reviews
CREATE POLICY "Allow manage reviews"
ON public.reviews
FOR ALL
USING (true)
WITH CHECK (true);

-- Seed initial client reviews
INSERT INTO public.reviews (id, name, location, rating, product, comment, date, verified, avatar_bg)
VALUES
('REV-101', 'K. Balasubramanian', 'Adambakkam, Chennai', 5, '3-Track Sliding Windows with SS Mesh', 'Installed Outlook UPVC sliding windows for our entire 3BHK flat in Adambakkam. The traffic sound reduction is unbelievable! Managing partner Durai personally supervised the measurement and installation. Extremely neat work and 100% on-time delivery.', '10 Aug 2026', true, '#3E7BFA'),
('REV-102', 'Dr. Radhika Sundaram', 'ECR Beach Villa, Chennai', 5, 'German Lift & Slide Patio Doors', 'We needed massive 12-foot glass patio doors facing the coast with high wind resistance and corrosion protection. Saravanavel and his engineering team delivered top-tier German profiles. The sliding is feather-light and completely water-tight during heavy rains.', '04 Aug 2026', true, '#10b981'),
('REV-103', 'M. Senthil Kumar (Architect)', 'Anna Nagar, Chennai', 5, 'Dark Walnut Arch Top Windows', 'As an architect, precision in custom arch templates is paramount. Outlook Enterprises executed our dark walnut woodgrain arched casement windows with flawless fusion welding and premium multi-point hardware. Outstanding craftsmanship.', '28 Jul 2026', true, '#8b5cf6'),
('REV-104', 'Preethi & Karthik', 'Velachery, Chennai', 5, 'European Tilt & Turn Windows', 'Replaced our old wooden windows with Outlook UPVC Tilt & Turn windows. The ventilation in tilt mode is great for monsoon, and when locked the room is completely soundproof from the main road. Pricing was very transparent.', '19 Jul 2026', true, '#f59e0b'),
('REV-105', 'G. Ramakrishnan', 'Thoraipakkam (OMR), Chennai', 5, 'Entire House UPVC Package', 'Honest estimation, zero hidden charges, and flawless installation within 16 days. The team cleaned up the site thoroughly after work. Highly recommend Saravanavel & Durai for any residential project in Chennai.', '11 Jul 2026', true, '#06b6d4'),
('REV-106', 'Anand Varma (Facility Head)', 'Guindy Industrial Estate, Chennai', 4, 'Commercial Acoustic Partitions', 'Fitted 6,500 sq ft of modular acoustic glass partitions in our corporate office. High structural strength, excellent finish, and completed over a single weekend with minimal disruption.', '02 Jul 2026', true, '#ec4899')
ON CONFLICT (id) DO NOTHING;

