'use client';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SYSTEM_TYPES, PROFILE_COLORS, GLASS_TYPES, GST_RATE, MESH_COST_PER_UNIT } from '@/lib/data';
import { fadeInUp } from '@/lib/animations';
import PriceSummaryCard from '@/components/ui/PriceSummaryCard';
import type { CalculatorConfig } from '@/lib/types';
import { Download, ArrowRight } from 'lucide-react';

const schema = z.object({
  width: z.number().min(1).max(25),
  height: z.number().min(1).max(15),
  qty: z.number().min(1).max(50),
  systemId: z.string(),
  colorId: z.string(),
  glassId: z.string(),
  distance: z.number().min(0).max(1000),
  mesh: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function CalculatorContent() {
  const router = useRouter();

  const { register, watch, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      width: 6,
      height: 4,
      qty: 2,
      systemId: SYSTEM_TYPES[0].id,
      colorId: 'white',
      glassId: '5mm',
      distance: 10,
      mesh: true,
    },
  });

  const values = watch();

  function calcConfig(data: FormData): CalculatorConfig {
    const sys = SYSTEM_TYPES.find((s) => s.id === data.systemId) || SYSTEM_TYPES[0];
    const col = PROFILE_COLORS.find((c) => c.id === data.colorId) || PROFILE_COLORS[0];
    const gls = GLASS_TYPES.find((g) => g.id === data.glassId) || GLASS_TYPES[0];

    const totalArea = data.width * data.height * data.qty;
    const material = Math.round(totalArea * sys.baseRate * col.baseCostMultiplier * gls.factor + (data.mesh ? MESH_COST_PER_UNIT * data.qty : 0));
    const transport = Math.round(data.distance * 50);
    const subtotal = material + transport;
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;

    return {
      width: data.width,
      height: data.height,
      qty: data.qty,
      systemType: sys.id,
      systemName: sys.name,
      color: col.name,
      glass: gls.name,
      lock: '',
      mesh: data.mesh,
      totalArea,
      distance: data.distance,
      material,
      installation: 0,
      transport,
      gst,
      total,
    };
  }

  // Live calculation as user types
  const liveConfig = (() => {
    try { return calcConfig(values as FormData); } catch { return null; }
  })();

  const onSubmit = (data: FormData) => {
    const cfg = calcConfig(data);
    const params = new URLSearchParams({
      source: 'calculator',
      width: String(cfg.width),
      height: String(cfg.height),
      qty: String(cfg.qty),
      systemName: cfg.systemName,
      color: cfg.color,
      glass: cfg.glass,
      mesh: String(cfg.mesh),
      totalArea: String(cfg.totalArea),
      distance: String(cfg.distance),
      material: String(cfg.material),
      transport: String(cfg.transport),
      gst: String(cfg.gst),
      total: String(cfg.total),
    });
    router.push(`/enquiry?${params.toString()}`);
  };

  const handleDownloadPDF = async () => {
    if (!liveConfig) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 50);
    doc.text('OUTLOOK ENTERPRISES', 20, 25);
    doc.setFontSize(12);
    doc.text('Official Price Quote', 20, 35);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, 45);
    doc.line(20, 50, 190, 50);
    const rows = [
      ['System Type', liveConfig.systemName],
      ['Dimensions', `${liveConfig.width} × ${liveConfig.height} ft × ${liveConfig.qty} unit(s)`],
      ['Total Area', `${liveConfig.totalArea.toFixed(1)} sq. ft`],
      ['Profile Color', liveConfig.color],
      ['Glass Upgrade', liveConfig.glass],
      ['Insect Mesh', liveConfig.mesh ? 'Yes' : 'No'],
      ['', ''],
      ['Material & Fabrication', `Rs. ${liveConfig.material.toLocaleString('en-IN')}`],
      ['Transport Charge (depends on distance)', `Rs. ${liveConfig.transport.toLocaleString('en-IN')}`],
      ['GST (18%)', `Rs. ${liveConfig.gst.toLocaleString('en-IN')}`],
      ['NET ESTIMATED TOTAL', `Rs. ${liveConfig.total.toLocaleString('en-IN')}`],
    ];
    let y = 60;
    rows.forEach(([label, val]) => {
      if (!label && !val) { y += 4; return; }
      doc.setFontSize(10);
      doc.setFont('helvetica', label === 'NET ESTIMATED TOTAL' ? 'bold' : 'normal');
      doc.text(label, 20, y);
      doc.text(val, 130, y);
      y += 10;
    });
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('This quote is an estimate. Final price subject to site survey. Valid for 30 days.', 20, 270);
    doc.text('Outlook Enterprises | No.7, 3rd St, Sasthri Nagar, Adambakkam, Chennai | +91 80727 07041 / +91 70101 98326 | www.outlookenterprises.in', 20, 278);
    doc.save('Outlook-UPVC-Quote.pdf');
  };

  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ padding: '4rem 1.5rem 2rem', background: 'linear-gradient(180deg, rgba(245,158,11,0.06) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="gradient-mesh" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="section-header" style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="badge badge-gold">Transparent Pricing</span>
          <h1 className="section-title">Instant Quotation & <span className="text-gradient">Cost Estimator</span></h1>
          <p className="section-desc">Enter your dimensions for a live itemized estimate including installation, GST, and hardware.</p>
        </motion.div>
      </section>

      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div className="calc-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Left — Form */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2rem' }}>Configure Your Quote</h3>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Dimensions */}
              <div className="calc-dim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Width (ft)', name: 'width', min: 1, max: 25, step: 0.5 },
                  { label: 'Height (ft)', name: 'height', min: 1, max: 15, step: 0.5 },
                  { label: 'Quantity', name: 'qty', min: 1, max: 50, step: 1 },
                  { label: 'Distance (km)', name: 'distance', min: 0, max: 1000, step: 1 },
                ].map(({ label, name, min, max, step }) => (
                  <div key={name}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>{label}</label>
                    <input type="number" className="form-control" min={min} max={max} step={step} {...register(name as keyof FormData, { valueAsNumber: true })} />
                  </div>
                ))}
              </div>

              {/* System Type */}
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>System Type</label>
                <select className="form-control" {...register('systemId')}>
                  {SYSTEM_TYPES.map((s) => <option key={s.id} value={s.id}>{s.name} — ₹{s.baseRate}/sq.ft</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>Profile Color</label>
                  <select className="form-control" {...register('colorId')}>
                    {PROFILE_COLORS.map((c) => <option key={c.id} value={c.id}>{c.name}{c.baseCostMultiplier > 1 ? ` (+${Math.round((c.baseCostMultiplier - 1) * 100)}%)` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }}>Glass Upgrade</label>
                  <select className="form-control" {...register('glassId')}>
                    {GLASS_TYPES.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>



              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" id="calc-mesh" className="form-control" style={{ width: 20, height: 20, flex: 'none' }} {...register('mesh')} />
                <label htmlFor="calc-mesh" style={{ fontWeight: 600, cursor: 'pointer' }}>Include SS Insect Mesh Screen (+₹800/unit)</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <motion.button
                  type="button"
                  onClick={handleDownloadPDF}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Download size={15} /> Download PDF
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Submit for Enquiry <ArrowRight size={15} />
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Right — Live Summary */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Live Quote Summary</h3>
              {liveConfig && (
                <PriceSummaryCard calcConfig={liveConfig} />
              )}
            </div>

            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                ✅ <strong style={{ color: 'var(--color-text-primary)' }}>No-obligation estimate.</strong> Prices include material, fabrication & free standard installation. Transport calculated per km. Final price confirmed after free site survey.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 200, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading calculator...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}
