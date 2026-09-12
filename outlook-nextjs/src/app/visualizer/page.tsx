'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PROFILE_COLORS, GLASS_TYPES, GRILL_OPTIONS, SYSTEM_TYPES } from '@/lib/data';
import { fadeInUp } from '@/lib/animations';
import { Zap, ChevronRight } from 'lucide-react';

// SVG Previews
function WindowSVG({ color, glass, grill }: { color: string; glass: string; grill: string }) {
  const glassColors: Record<string, string> = {
    single: 'rgba(200,230,255,0.35)',
    double: 'rgba(140,200,255,0.45)',
    'low-e': 'rgba(180,230,200,0.4)',
    tinted: 'rgba(100,140,200,0.5)',
    frosted: 'rgba(220,230,240,0.55)',
  };
  const glassColor = glassColors[glass] || glassColors.double;

  return (
    <svg viewBox="0 0 300 280" width="100%" height="100%" style={{ maxHeight: 340 }}>
      {/* Outer frame */}
      <rect x="10" y="10" width="280" height="260" rx="6" ry="6" fill={color} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Glass pane left */}
      <rect x="25" y="25" width="120" height="230" rx="3" fill={glassColor} />
      {/* Glass pane right */}
      <rect x="155" y="25" width="120" height="230" rx="3" fill={glassColor} />
      {/* Center divider */}
      <rect x="143" y="20" width="14" height="240" fill={color} />
      {/* Top rail */}
      <rect x="10" y="10" width="280" height="22" rx="4" fill={color} />
      {/* Bottom rail */}
      <rect x="10" y="248" width="280" height="22" rx="4" fill={color} />
      {/* Handle */}
      <rect x="137" y="125" width="26" height="30" rx="4" fill="rgba(200,210,220,0.7)" />
      {/* Grills */}
      {grill === 'colonial' && <>
        <line x1="25" y1="140" x2="145" y2="140" stroke={color} strokeWidth="5" />
        <line x1="85" y1="25" x2="85" y2="255" stroke={color} strokeWidth="5" />
        <line x1="155" y1="140" x2="275" y2="140" stroke={color} strokeWidth="5" />
        <line x1="215" y1="25" x2="215" y2="255" stroke={color} strokeWidth="5" />
      </>}
      {grill === 'cross' && <>
        <line x1="25" y1="140" x2="145" y2="140" stroke={color} strokeWidth="4" />
        <line x1="155" y1="140" x2="275" y2="140" stroke={color} strokeWidth="4" />
      </>}
      {/* Light refraction effect */}
      <rect x="32" y="32" width="20" height="60" rx="2" fill="rgba(255,255,255,0.15)" />
      <rect x="162" y="32" width="20" height="60" rx="2" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

function DoorSVG({ color, glass, grill }: { color: string; glass: string; grill: string }) {
  const glassColors: Record<string, string> = {
    single: 'rgba(200,230,255,0.35)',
    double: 'rgba(140,200,255,0.45)',
    'low-e': 'rgba(180,230,200,0.4)',
    tinted: 'rgba(100,140,200,0.5)',
    frosted: 'rgba(220,230,240,0.55)',
  };
  const glassColor = glassColors[glass] || glassColors.double;

  return (
    <svg viewBox="0 0 300 340" width="100%" height="100%" style={{ maxHeight: 360 }}>
      <rect x="10" y="5" width="280" height="330" rx="6" fill={color} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <rect x="25" y="20" width="118" height="300" rx="3" fill={glassColor} />
      <rect x="157" y="20" width="118" height="300" rx="3" fill={glassColor} />
      <rect x="143" y="5" width="14" height="330" fill={color} />
      {grill === 'colonial' && <>
        <line x1="25" y1="170" x2="143" y2="170" stroke={color} strokeWidth="5" />
        <line x1="84" y1="20" x2="84" y2="320" stroke={color} strokeWidth="5" />
        <line x1="157" y1="170" x2="275" y2="170" stroke={color} strokeWidth="5" />
        <line x1="216" y1="20" x2="216" y2="320" stroke={color} strokeWidth="5" />
      </>}
      <rect x="128" y="155" width="12" height="35" rx="3" fill="rgba(200,210,220,0.8)" />
      <rect x="160" y="155" width="12" height="35" rx="3" fill="rgba(200,210,220,0.8)" />
      <rect x="30" y="25" width="18" height="70" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="162" y="25" width="18" height="70" rx="2" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

function VisualizerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const systemParam = searchParams.get('system');

  const initialSystem = SYSTEM_TYPES.find((s) => systemParam?.includes(s.id.split('-')[0])) || SYSTEM_TYPES[0];

  const [system, setSystem] = useState(initialSystem);
  const [colorId, setColorId] = useState('white');
  const [glassId, setGlassId] = useState('5mm');
  const [grill, setGrill] = useState('none');
  const [mesh, setMesh] = useState(true);

  const selectedColor = PROFILE_COLORS.find((c) => c.id === colorId) || PROFILE_COLORS[0];
  const selectedGlass = GLASS_TYPES.find((g) => g.id === glassId) || GLASS_TYPES[0];

  const basePrice = system.baseRate * 15; // sq ft estimate for 3x5 ft
  const price = Math.round(
    basePrice * selectedColor.baseCostMultiplier * selectedGlass.factor + (mesh ? 800 : 0)
  );

  const isDoor = system.id.includes('french') || system.id.includes('lift') || system.id.includes('bifold');

  const handleGetQuote = () => {
    const params = new URLSearchParams({
      source: 'visualizer',
      systemType: system.name,
      finish: selectedColor.name,
      glass: selectedGlass.name,
      grill,
      mesh: String(mesh),
      estimatedPrice: String(price),
    });
    router.push(`/enquiry?${params.toString()}`);
  };

  return (
    <div style={{ paddingTop: '68px' }}>
      <section style={{ padding: '4rem 1.5rem 2rem', background: 'linear-gradient(180deg, rgba(62,123,250,0.06) 0%, transparent 100%)', position: 'relative', overflow: 'hidden' }}>
        <div className="gradient-mesh" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="section-header" style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="badge badge-green">Real-time Visualizer</span>
          <h1 className="section-title">Custom Window & Door <span className="text-gradient">Configurator</span></h1>
          <p className="section-desc">Choose your system, finish, glass, and hardware. See it live and get your quote instantly.</p>
        </motion.div>
      </section>

      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div className="calc-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Left — Live SVG Preview */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '88px' }}>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.875rem', marginBottom: '1.5rem', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDoor
                ? <DoorSVG color={selectedColor.hex} glass={glassId} grill={grill} />
                : <WindowSVG color={selectedColor.hex} glass={glassId} grill={grill} />
              }
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Estimated Cost</p>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }} className="text-gradient">₹ {price.toLocaleString('en-IN')}</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              {system.name} • {selectedColor.name} • {selectedGlass.name} {mesh ? '• SS Mesh' : ''}
            </p>

            <motion.button
              onClick={handleGetQuote}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}
            >
              <Zap size={16} /> Get This Quote <ChevronRight size={16} />
            </motion.button>
          </motion.div>

          {/* Right — Controls */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Step 1 — System */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Step 1</p>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Select System Type</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {SYSTEM_TYPES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSystem(s)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.83rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: system.id === s.id ? '1px solid rgba(62,123,250,0.5)' : '1px solid var(--color-border)',
                      background: system.id === s.id ? 'rgba(62,123,250,0.15)' : 'rgba(255,255,255,0.03)',
                      color: system.id === s.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >{s.name}</button>
                ))}
              </div>
            </div>

            {/* Step 2 — Finish */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Step 2</p>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Profile Lamination Finish</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {PROFILE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    title={c.name}
                    style={{
                      width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
                      background: c.hex, border: colorId === c.id ? `3px solid var(--color-accent)` : `2px solid ${c.border}`,
                      boxShadow: colorId === c.id ? '0 0 0 2px rgba(62,123,250,0.3)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
                Selected: <strong style={{ color: 'var(--color-text-primary)' }}>{selectedColor.name}</strong>
                {selectedColor.baseCostMultiplier > 1 && <span style={{ color: 'var(--color-text-muted)' }}> (+{Math.round((selectedColor.baseCostMultiplier - 1) * 100)}%)</span>}
              </p>
            </div>

            {/* Step 3 — Glass */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Step 3</p>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Glass Glazing Type</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {GLASS_TYPES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGlassId(g.id)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: glassId === g.id ? '1px solid rgba(62,123,250,0.5)' : '1px solid var(--color-border)',
                      background: glassId === g.id ? 'rgba(62,123,250,0.15)' : 'rgba(255,255,255,0.03)',
                      color: glassId === g.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >{g.name}</button>
                ))}
              </div>
              {selectedGlass && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>{selectedGlass.desc}</p>
              )}
            </div>

            {/* Step 4 — Grill + Mesh */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Step 4</p>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Grill Bars & Accessories</h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Grill / Georgian Bars</label>
                  <select
                    value={grill}
                    onChange={(e) => setGrill(e.target.value)}
                    className="form-control"
                    style={{ width: 200 }}
                  >
                    {GRILL_OPTIONS.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="mesh-toggle"
                    checked={mesh}
                    onChange={(e) => setMesh(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                  />
                  <label htmlFor="mesh-toggle" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                    SS Insect Mesh Screen <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(+₹800)</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default function VisualizerPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: 200, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading visualizer...</div>}>
      <VisualizerContent />
    </Suspense>
  );
}
