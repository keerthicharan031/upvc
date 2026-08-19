'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useLeads } from '@/lib/store';
import PriceSummaryCard from '@/components/ui/PriceSummaryCard';
import type { VisualizerConfig, CalculatorConfig, Lead } from '@/lib/types';
import { CheckCircle, Send, Loader2, AlertCircle, MessageCircle, Phone, ArrowLeft, Copy, Check } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  phone: z.string().min(10, 'Enter a valid 10-digit mobile number'),
  product: z.string().min(1, 'Please select a product'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PRODUCT_OPTIONS = [
  'Sliding Windows',
  'Lift & Slide Doors',
  'Tilt & Turn Windows',
  'French Balcony Doors',
  'Bi-Fold Multi-Slide Doors',
  'Acoustic Partitions',
  'Entire Villa / House Package',
  'Other (mention in notes)',
];

function EnquiryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addLead } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [copied, setCopied] = useState(false);

  const source = searchParams.get('source');

  // Reconstruct config from query params
  const vizConfig: Partial<VisualizerConfig> | undefined = source === 'visualizer' ? {
    systemType: searchParams.get('systemType') || '',
    finish: searchParams.get('finish') || '',
    glass: searchParams.get('glass') || '',
    grill: searchParams.get('grill') || '',
    mesh: searchParams.get('mesh') === 'true',
    estimatedPrice: parseInt(searchParams.get('estimatedPrice') || '0', 10),
  } : undefined;

  const calcConfig: Partial<CalculatorConfig> | undefined = source === 'calculator' ? {
    width: parseFloat(searchParams.get('width') || '0'),
    height: parseFloat(searchParams.get('height') || '0'),
    qty: parseInt(searchParams.get('qty') || '0', 10),
    systemName: searchParams.get('systemName') || '',
    color: searchParams.get('color') || '',
    glass: searchParams.get('glass') || '',
    lock: searchParams.get('lock') || '',
    mesh: searchParams.get('mesh') === 'true',
    totalArea: parseFloat(searchParams.get('totalArea') || '0'),
    material: parseInt(searchParams.get('material') || '0', 10),
    installation: parseInt(searchParams.get('installation') || '0', 10),
    gst: parseInt(searchParams.get('gst') || '0', 10),
    total: parseInt(searchParams.get('total') || '0', 10),
  } : undefined;

  const defaultProduct = vizConfig?.systemType || calcConfig?.systemName || PRODUCT_OPTIONS[0];

  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      product: defaultProduct,
      notes: source === 'visualizer'
        ? `Configured via Visualizer: ${vizConfig?.systemType}, Finish: ${vizConfig?.finish}, Glass: ${vizConfig?.glass}${vizConfig?.mesh ? ', SS Mesh' : ''}`
        : source === 'calculator'
        ? `Calculator Quote: ${calcConfig?.systemName}, ${calcConfig?.width}×${calcConfig?.height}ft × ${calcConfig?.qty} units, Total: ₹${calcConfig?.total?.toLocaleString('en-IN')}`
        : '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const value = calcConfig?.total
      ? `₹ ${calcConfig.total.toLocaleString('en-IN')}`
      : vizConfig?.estimatedPrice
      ? `₹ ${vizConfig.estimatedPrice.toLocaleString('en-IN')} (est.)`
      : '₹ TBD';

    const leadSource = source === 'visualizer' ? 'Visualizer' : source === 'calculator' ? 'Web Calculator' : 'Direct Enquiry';

    try {
      const createdLead = await addLead({
        name: data.name.trim(),
        phone: data.phone.trim(),
        product: data.product,
        notes: data.notes?.trim(),
        area: calcConfig?.totalArea ? `${calcConfig.totalArea.toFixed(0)} sq ft` : 'TBD',
        value,
        status: 'New',
        source: leadSource,
        config: (calcConfig as CalculatorConfig) || (vizConfig as VisualizerConfig),
      });

      setSubmittedLead(createdLead);
    } catch (err: unknown) {
      console.error('Enquiry submission failed:', err);
      setSubmitError(err instanceof Error ? err.message : 'An error occurred while submitting your enquiry. Please try again or reach us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const vals = getValues();
    const name = vals.name || 'Customer';
    const phone = vals.phone || 'Not provided';
    const prod = vals.product || defaultProduct;
    const notes = vals.notes || 'General enquiry';

    const msg = encodeURIComponent(
      `Hello Outlook Enterprises (Partners: Saravanavel & Durai),\n\nI would like to enquire about UPVC Doors & Windows.\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n🪟 *Requirement:* ${prod}\n📝 *Notes/Site Address:* ${notes}\n\nPlease share the quote and schedule a free site consultation.`
    );
    window.open(`https://wa.me/918072707041?text=${msg}`, '_blank');
  };

  const handleCopySummary = (lead: Lead) => {
    const text = `Outlook Enterprises UPVC Enquiry:\nLead ID: ${lead.id}\nName: ${lead.name}\nPhone: ${lead.phone}\nProduct: ${lead.product}\nEstimated Value: ${lead.value}\nDate: ${lead.date}\nNotes: ${lead.notes || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (submittedLead) {
    const waMsg = encodeURIComponent(
      `Hello Outlook Enterprises (Partners: Saravanavel & Durai),\n\nI have submitted an enquiry on your website.\n\n📋 *Lead ID:* ${submittedLead.id}\n👤 *Name:* ${submittedLead.name}\n📞 *Phone:* ${submittedLead.phone}\n🪟 *Product:* ${submittedLead.product}\n💰 *Estimated Value:* ${submittedLead.value}\n📍 *Site Notes:* ${submittedLead.notes || 'Free Site Visit Requested'}\n\nPlease confirm my site visit estimate.`
    );

    return (
      <div style={{ paddingTop: '68px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass-card enquiry-success-card"
          style={{ maxWidth: 680, width: '100%', padding: '3rem 2.5rem', textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
            style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#34d399' }}
          >
            <CheckCircle size={38} />
          </motion.div>
          
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>
            Enquiry Registered Successfully!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem', fontSize: '0.95rem' }}>
            Thank you, <strong style={{ color: 'var(--color-text-primary)' }}>{submittedLead.name}</strong>! Your requirement is securely registered in our system under Reference ID <strong style={{ color: 'var(--color-accent)' }}>{submittedLead.id}</strong>. Managing partners <strong style={{ color: 'var(--color-text-primary)' }}>Saravanavel &amp; Durai</strong> will connect with you within <strong style={{ color: '#34d399' }}>24 hours</strong>.
          </p>

          {/* Submitted Lead Summary Card */}
          <div style={{ background: 'var(--input-bg)', border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enquiry Details
              </span>
              <button
                onClick={() => handleCopySummary(submittedLead)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied ? '#34d399' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Customer Name</span>
                <strong style={{ color: 'var(--color-text-primary)' }}>{submittedLead.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Mobile Number</span>
                <strong style={{ color: 'var(--color-text-primary)' }}>{submittedLead.phone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Product</span>
                <strong style={{ color: '#60a5fa' }}>{submittedLead.product}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Estimated Value / Area</span>
                <strong style={{ color: '#34d399' }}>{submittedLead.value} ({submittedLead.area || 'TBD'})</strong>
              </div>
              {submittedLead.notes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Notes / Address</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{submittedLead.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Instant WhatsApp Dispatch */}
          <div style={{ background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.3)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: '#86efac', fontWeight: 600, marginBottom: '0.85rem' }}>
              ⚡ Want an instant reply? Send your quote directly to the partners on WhatsApp:
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/918072707041?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ background: '#25D366', borderColor: '#25D366', color: '#042f14', fontWeight: 700 }}
              >
                <MessageCircle size={18} /> Chat with Saravanavel (+91 80727 07041)
              </a>
              <a
                href={`https://wa.me/917010198326?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ borderColor: 'rgba(37, 211, 102, 0.4)', color: '#86efac' }}
              >
                <MessageCircle size={18} /> Chat with Durai (+91 70101 98326)
              </a>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setSubmittedLead(null);
                reset();
              }}
              className="btn-secondary"
            >
              Submit Another Enquiry
            </button>
            <button onClick={() => router.push('/')} className="btn-secondary">
              <ArrowLeft size={16} /> Home
            </button>
            <button onClick={() => router.push('/products')} className="btn-secondary">
              Browse Products
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ padding: '4rem 1.5rem 2rem', background: 'linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="gradient-mesh" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="section-header" style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="badge badge-green">Free Consultation & Site Visit</span>
          <h1 className="section-title">Schedule Your <span className="text-gradient">Free Site Visit</span></h1>
          <p className="section-desc">Our expert engineer will visit with profile sample kits. No obligations — just honest advice and a detailed estimate.</p>
        </motion.div>
      </section>

      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div className="enquiry-grid" style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: vizConfig || calcConfig ? '1fr 1fr' : '1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                Enquiry Details
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                Direct Partner Dispatch
              </span>
            </div>

            {submitError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Submission Alert:</strong>
                  {submitError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  {...register('name')}
                />
                {errors.name && <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem' }}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>
                  Phone Number (10 digits) *
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                />
                {errors.phone && <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem' }}>{errors.phone.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>
                  Product Requirement *
                </label>
                <select className="form-control" {...register('product')}>
                  {PRODUCT_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {errors.product && <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem' }}>{errors.product.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>
                  Project Details / Site Address (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Window count, site location (e.g. Adambakkam, Velachery, OMR), or any custom requirements..."
                  {...register('notes')}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="btn-primary"
                style={{
                  justifyContent: 'center',
                  fontSize: '1.05rem',
                  padding: '0.95rem',
                  opacity: isSubmitting ? 0.75 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting Enquiry...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Submit Enquiry & Request Visit 🚀
                  </>
                )}
              </motion.button>

              {/* Direct WhatsApp Action Alternative */}
              <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>
                  — OR CONNECT IMMEDIATELY VIA WHATSAPP —
                </span>
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    background: 'rgba(37, 211, 102, 0.12)',
                    borderColor: 'rgba(37, 211, 102, 0.35)',
                    color: '#86efac',
                    fontSize: '0.9rem',
                    padding: '0.75rem',
                  }}
                >
                  <MessageCircle size={16} /> Instant WhatsApp Quote (+91 80727 07041)
                </button>
              </div>
            </form>
          </motion.div>

          {/* Config Summary & Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(vizConfig || calcConfig) && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                <PriceSummaryCard vizConfig={vizConfig} calcConfig={calcConfig} />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="glass-card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                What happens after you submit?
              </h4>
              {[
                { title: '1. Instant Notification', desc: 'Our partners Saravanavel & Durai receive your enquiry.' },
                { title: '2. Call within 24 Hours', desc: 'We verify your window dimensions and answer initial questions.' },
                { title: '3. Engineer Site Visit', desc: 'Our technician visits your site with physical profile and glass samples.' },
                { title: '4. Precision Quote & Order', desc: 'Receive transparent, itemized pricing and 14–21 days delivery.' },
              ].map((step, i) => (
                <div key={step.title} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(62,123,250,0.15)', border: '1px solid rgba(62,123,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)', display: 'block', fontSize: '0.85rem' }}>{step.title}</strong>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{step.desc}</span>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <p style={{ marginBottom: '0.3rem' }}>
                  📞 <strong>Direct Contact:</strong> <a href="tel:+918072707041" style={{ color: 'var(--color-accent)' }}>+91 80727 07041</a> / <a href="tel:+917010198326" style={{ color: 'var(--color-accent)' }}>+91 70101 98326</a>
                </p>
                <p style={{ marginBottom: '0.3rem' }}>
                  📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/outlookenterpriseschennai?igsh=bmN1eG1rcjc3M2wy&igsi=bmN1eG1rcjc3M2wy" target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c', fontWeight: 600 }}>@outlookenterpriseschennai</a>
                </p>
                <p style={{ margin: 0 }}>
                  📍 <strong>Factory & Office (Map):</strong> <a href="https://www.google.com/maps/search/?api=1&query=No.7,+3rd+Street,+Sasthri+Nagar,+Adambakkam,+Chennai+600088" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>No.7, 3rd St, Sasthri Nagar, Adambakkam, Chennai – 600 088</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 200, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>}>
      <EnquiryContent />
    </Suspense>
  );
}

