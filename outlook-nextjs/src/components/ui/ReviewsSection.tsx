'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  MessageSquarePlus,
  Filter,
  ShieldCheck,
  Award,
  Sparkles,
  X,
  Send,
  Loader2,
  MapPin,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import { useReviews } from '@/lib/reviewsStore';
import type { Review } from '@/lib/types';

const PRODUCT_LIST = [
  '3-Track Sliding Windows with SS Mesh',
  'German Lift & Slide Patio Doors',
  'European Tilt & Turn Windows',
  'French Balcony Doors with Toughened Glass',
  'Bi-Fold Multi-Slide Patio Doors',
  'Dark Walnut Arch Top Windows',
  'Entire House / Villa UPVC Package',
  'Commercial Acoustic Partitions',
  'Soundproof Bedroom Windows',
];

const RATING_LABELS: Record<number, string> = {
  5: 'Exceptional (5/5) — Exceeded Expectations!',
  4: 'Very Good (4/5) — Great Quality & Service',
  3: 'Good (3/5) — Met Expectations',
  2: 'Fair (2/5) — Needs Improvement',
  1: 'Poor (1/5) — Unsatisfied',
};

export default function ReviewsSection() {
  const { reviews, addReview, getMetrics } = useReviews();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 5 | 4>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [product, setProduct] = useState(PRODUCT_LIST[0]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const metrics = useMemo(() => getMetrics(), [getMetrics]);

  const filteredReviews = useMemo(() => {
    if (selectedFilter === 'all') return reviews;
    return reviews.filter((r) => r.rating === selectedFilter);
  }, [reviews, selectedFilter]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setFormError('Please enter your full name and review comments.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await addReview({
        name: name.trim(),
        location: location.trim() || 'Chennai',
        rating,
        product,
        comment: comment.trim(),
        verified: true,
      });

      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setIsModalOpen(false);
        setName('');
        setLocation('');
        setComment('');
        setRating(5);
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      setFormError('Failed to post review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHelpful = (id: string) => {
    setHelpfulLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="reviews"
      style={{
        padding: '5rem 1.5rem',
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(62,123,250,0.08) 0%, transparent 70%)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            className="badge badge-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              padding: '0.35rem 0.9rem',
            }}
          >
            <Sparkles size={14} color="#f59e0b" /> Verified Customer Testimonials
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Trusted by 500+ <span className="text-gradient">Chennai Homeowners</span> &amp; Architects
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Real reviews from real clients across Adambakkam, Velachery, ECR, Anna Nagar, and OMR. Experience the Outlook standard in acoustic soundproofing and precision installation.
          </p>
        </div>

        {/* Rating Overview & Breakdown Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card"
          style={{
            padding: '2.5rem',
            marginBottom: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(15, 39, 68, 0.65) 0%, rgba(6, 17, 31, 0.75) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {/* Main Score Box */}
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: '1.5rem' }}>
            <div style={{ fontSize: '4.2rem', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '0.5rem' }}>
              {metrics.average}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  fill={star <= Math.round(metrics.average) ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
                  color={star <= Math.round(metrics.average) ? '#f59e0b' : 'transparent'}
                />
              ))}
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
              Based on <strong style={{ color: 'white' }}>{metrics.total} verified reviews</strong>
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#34d399', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>
              <ShieldCheck size={15} /> 100% Genuine Project Reviews
            </span>
          </div>

          {/* Star Distribution Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[5, 4, 3, 2, 1].map((starCount) => {
              const count = metrics.breakdown[starCount] || 0;
              const percentage = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;

              return (
                <div key={starCount} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)', width: '55px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    {starCount} <Star size={12} fill="#fbbf24" color="#fbbf24" />
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 * (5 - starCount) }}
                      style={{
                        height: '100%',
                        background: starCount === 5 ? 'linear-gradient(90deg, #3E7BFA, #34d399)' : '#fbbf24',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                  <span style={{ color: 'var(--color-text-muted)', width: '38px', textAlign: 'right', fontSize: '0.78rem' }}>
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action CTA & Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.95rem 1.5rem',
                fontSize: '1rem',
                boxShadow: '0 8px 25px rgba(62,123,250,0.35)',
              }}
            >
              <MessageSquarePlus size={18} /> Write a Customer Review ✍️
            </button>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={14} color="#60a5fa" /> 10-Year Warranty
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={14} color="#34d399" /> German DIN Standard
              </span>
            </div>
          </div>
        </motion.div>

        {/* Filter Navigation Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.5rem' }}>
              <Filter size={15} /> Filter by:
            </span>
            <button
              onClick={() => setSelectedFilter('all')}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedFilter === 'all' ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                borderColor: selectedFilter === 'all' ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                color: 'white',
              }}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setSelectedFilter(5)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedFilter === 5 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                borderColor: selectedFilter === 5 ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                color: selectedFilter === 5 ? '#fbbf24' : 'white',
              }}
            >
              ⭐ 5 Stars Only ({metrics.breakdown[5] || 0})
            </button>
            <button
              onClick={() => setSelectedFilter(4)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedFilter === 4 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                borderColor: selectedFilter === 4 ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                color: selectedFilter === 4 ? '#60a5fa' : 'white',
              }}
            >
              ⭐ 4 Stars ({metrics.breakdown[4] || 0})
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
          >
            + Post Your Feedback
          </button>
        </div>

        {/* Reviews Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredReviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div>
                {/* Reviewer Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    {/* Avatar Initials */}
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: rev.avatarBg || '#3E7BFA',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        boxShadow: `0 4px 15px ${(rev.avatarBg || '#3E7BFA')}40`,
                        flexShrink: 0,
                      }}
                    >
                      {rev.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', margin: 0 }}>
                          {rev.name}
                        </h4>
                        {rev.verified && (
                          <span title="Verified Installation Client" style={{ color: '#34d399', display: 'flex' }}>
                            <CheckCircle2 size={16} />
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                        <MapPin size={12} color="#60a5fa" /> {rev.location}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        fill={s <= rev.rating ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                        color={s <= rev.rating ? '#f59e0b' : 'transparent'}
                      />
                    ))}
                  </div>
                </div>

                {/* Product Tag */}
                <div
                  style={{
                    background: 'rgba(62,123,250,0.12)',
                    border: '1px solid rgba(62,123,250,0.25)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.75rem',
                    color: '#93c5fd',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    display: 'inline-block',
                  }}
                >
                  🪟 {rev.product}
                </div>

                {/* Review Text */}
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  “{rev.comment}”
                </p>
              </div>

              {/* Review Footer with Date and Helpful Like */}
              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} /> {rev.date}
                </span>

                <button
                  onClick={() => toggleHelpful(rev.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: helpfulLiked[rev.id] ? '#34d399' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.4rem',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  <ThumbsUp size={13} fill={helpfulLiked[rev.id] ? '#34d399' : 'none'} />
                  {helpfulLiked[rev.id] ? 'Helpful (1)' : 'Helpful'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(4, 11, 20, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '560px',
                padding: '2.5rem',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.18)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>

              {formSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '2px solid #34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      color: '#34d399',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
                    Thank You for Your Review!
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                    Your feedback has been published and helps Chennai homeowners choose superior UPVC quality.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1.75rem' }}>
                    <span className="badge badge-blue" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                      Share Your Experience
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '0.3rem 0 0.4rem' }}>
                      Write a Customer Review
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                      Rate your Outlook UPVC doors, windows, soundproofing &amp; installation service.
                    </p>
                  </div>

                  {formError && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#fca5a5', fontSize: '0.85rem' }}>
                      ⚠️ {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Interactive Star Rating */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Your Rating *
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map((s) => {
                          const isFilled = s <= (hoverRating || rating);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setRating(s)}
                              onMouseEnter={() => setHoverRating(s)}
                              onMouseLeave={() => setHoverRating(0)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                transition: 'transform 0.15s',
                                transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                              }}
                            >
                              <Star
                                size={32}
                                fill={isFilled ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                                color={isFilled ? '#f59e0b' : 'rgba(255,255,255,0.3)'}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600, display: 'block', marginTop: '0.35rem' }}>
                        {RATING_LABELS[hoverRating || rating]}
                      </span>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Sundaram"
                        className="form-control"
                      />
                    </div>

                    {/* Location & Product Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                          Location / Area *
                        </label>
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Adambakkam, Chennai"
                          className="form-control"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                          Product Installed
                        </label>
                        <select
                          value={product}
                          onChange={(e) => setProduct(e.target.value)}
                          className="form-control"
                        >
                          {PRODUCT_LIST.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Review Comments */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Your Detailed Review *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="How was the product soundproofing, glass clarity, installation finish, and responsiveness of Saravanavel & Durai?"
                        className="form-control"
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                      style={{
                        justifyContent: 'center',
                        fontSize: '1rem',
                        padding: '0.9rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Submitting Review...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Post Public Review 🌟
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          #reviews > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
