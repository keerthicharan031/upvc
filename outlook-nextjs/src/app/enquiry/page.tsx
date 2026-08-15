'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useLeads } from '@/lib/store';
import PriceSummaryCard from '@/components/ui/PriceSummaryCard';
import type { VisualizerConfig, CalculatorConfig } from '@/lib/types';
import { CheckCircle, Send } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
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
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; phone: string; product: string } | null>(null);

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

  const defaultProduct = vizConfig?.systemType || calcConfig?.systemName || '';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      product: defaultProduct,
      notes: source === 'visualizer'
        ? `Configured via Visualizer: ${vizConfig?.systemType}, ${vizConfig?.finish}, ${vizConfig?.glass}${vizConfig?.mesh ? ', SS Mesh' : ''}`
        : source === 'calculator'
        ? `Calculator Quote: ${calcConfig?.systemName}, ${calcConfig?.width}×${calcConfig?.height}ft × ${calcConfig?.qty} units, Total: ₹${calcConfig?.total?.toLocaleString('en-IN')}`
        : '',
    },
  });

  const onSubmit = (data: FormData) => {
    const value = calcConfig?.total
      ? `₹ ${calcConfig.total.toLocaleString('en-IN')}`
      : vizConfig?.estimatedPrice
      ? `₹ ${vizConfig.estimatedPrice.toLocaleString('en-IN')} (est.)`
      : '₹ TBD';

    addLead({
      name: data.name,
      phone: data.phone,
      product: data.product,
      area: calcConfig?.totalArea ? `${calcConfig.totalArea.toFixed(0)} sq ft` : 'TBD',
      value,
      status: 'New',
      source: source === 'visualizer' ? 'Visualizer' : source === 'calculator' ? 'Web Calculator' : 'Web Calculator',
      config: calcConfig as CalculatorConfig || vizConfig as VisualizerConfig,
    });
    setSubmittedData({ name: data.name, phone: data.phone, product: data.product });
    setSubmitted(true);
  };

  if (submitted) {
    const waMsg = encodeURIComponent(
      `Hello Outlook Enterprises (Partners: Saravanavel & Durai),\nI have submitted an enquiry on your website.\n\n*Name:* ${submittedData?.name || ''}\n*Phone:* ${submittedData?.phone || ''}\n*Product:* ${submittedData?.product || ''}\n\nPlease confirm my site visit estimate.`
    );

    return (
      <div style={{ paddingTop: '68px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass-card"
          style={{ maxWidth: 620, width: '100%', padding: '3.5rem', textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem', color: '#34d399' }}
          >
            <CheckCircle size={36} />
          </motion.div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Enquiry Submitted Successfully!</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Your enquiry has been registered in our Admin Portal. Our managing partners <strong style={{ color: 'var(--color-text-primary)' }}>Saravanavel &amp; Durai</strong> will review your requirement and call you within <strong style={{ color: 'var(--color-text-primary)' }}>24 hours</strong>.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: '0.8rem', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left', fontSize: '0.875rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Direct Contact Information:</p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>👤 <strong>Partners:</strong> Saravanavel &amp; Durai</p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>📞 <strong>Mobile:</strong> <a href="tel:+918072707041" style={{ color: 'var(--color-accent)' }}>+91 80727 07041</a> / <a href="tel:+917010198326" style={{ color: 'var(--color-accent)' }}>+91 70101 98326</a></p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 0 }}>📍 <strong>Address:</strong> No.7, 3rd Street, Sasthri Nagar, Adambakkam, Chennai – 600 088</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`https://wa.me/918072707041?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: '#25D366', borderColor: '#25D366' }}>
              💬 Chat on WhatsApp (+91 80727 07041)
            </a>
            <button onClick={() => router.push('/')} className="btn-secondary">← Back to Home</button>
            <button onClick={() => router.push('/products')} className="btn-secondary">Browse Products</button>
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
          <span className="badge badge-green">Free Consultation</span>
          <h1 className="section-title">Schedule Your <span className="text-gradient">Free Site Visit</span></h1>
          <p className="section-desc">Our expert engineer will visit with premium sample kits. No obligations — just honest advice and a detailed estimate.</p>
        </motion.div>
      </section>

      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: vizConfig || calcConfig ? '1fr 1fr' : '1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2rem' }}>Your Details</h3>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>Full Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Ramesh Kumar" {...register('name')} />
                {errors.name && <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem' }}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>Phone Number *</label>
                <input type="tel" className="form-control" placeholder="+91 98765 43210" {...register('phone')} />
                {errors.phone && <p style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem' }}>{errors.phone.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>Product Requirement</label>
                <select className="form-control" {...register('product')}>
                  {PRODUCT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>Project Details / Site Address</label>
                <textarea className="form-control" rows={4} placeholder="Window count, site location, or any specific requirements..." {...register('notes')} style={{ resize: 'vertical' }} />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ justifyContent: 'center', fontSize: '1.05rem', padding: '0.95rem' }}
              >
                <Send size={16} /> Submit Request & Log Lead 🚀
              </motion.button>
            </form>
          </motion.div>

          {/* Config Summary */}
          {(vizConfig || calcConfig) && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <PriceSummaryCard vizConfig={vizConfig} calcConfig={calcConfig} />
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>What happens next?</h4>
                {['Team calls you within 24 hours', 'Engineer visits with sample profile kits', 'Free detailed quotation provided on-site', 'Order placed, installation in 14–21 days'].map((step, i) => (
                  <div key={step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem', fontSize: '0.83rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(62,123,250,0.15)', border: '1px solid rgba(62,123,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0 }}>{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
