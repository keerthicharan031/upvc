import type { CalculatorConfig, VisualizerConfig } from '@/lib/types';
import { Receipt, Layers } from 'lucide-react';

interface PriceSummaryCardProps {
  calcConfig?: Partial<CalculatorConfig>;
  vizConfig?: Partial<VisualizerConfig>;
  compact?: boolean;
}

function formatCurrency(n: number) {
  return `₹ ${n.toLocaleString('en-IN')}`;
}

export default function PriceSummaryCard({ calcConfig, vizConfig, compact = false }: PriceSummaryCardProps) {
  if (!calcConfig && !vizConfig) return null;

  const isCalc = !!calcConfig;

  const rows = isCalc && calcConfig ? [
    { label: 'System', value: calcConfig.systemName || '—' },
    { label: 'Dimensions', value: calcConfig.width && calcConfig.height ? `${calcConfig.width} × ${calcConfig.height} ft × ${calcConfig.qty} unit(s)` : '—' },
    { label: 'Total Area', value: calcConfig.totalArea ? `${calcConfig.totalArea.toFixed(1)} sq. ft` : '—' },
    { label: 'Profile Color', value: calcConfig.color || '—' },
    { label: 'Glass Upgrade', value: calcConfig.glass || '—' },

    { label: 'Insect Mesh', value: calcConfig.mesh ? 'Yes' : 'No' },
    null, // divider
    { label: 'Material & Fabrication', value: calcConfig.material ? formatCurrency(calcConfig.material) : '—', accent: false },
    { label: 'Transport Charge (depends on distance)', value: calcConfig.transport ? formatCurrency(calcConfig.transport) : '—', accent: false },
    { label: 'GST (18%)', value: calcConfig.gst ? formatCurrency(calcConfig.gst) : '—', accent: false },
    { label: 'NET ESTIMATED TOTAL', value: calcConfig.total ? formatCurrency(calcConfig.total) : '—', accent: true, total: true },
  ] : vizConfig ? [
    { label: 'System Type', value: vizConfig.systemType || '—' },
    { label: 'Profile Finish', value: vizConfig.finish || '—' },
    { label: 'Glass Glazing', value: vizConfig.glass || '—' },
    { label: 'Grill Bars', value: vizConfig.grill || '—' },
    { label: 'Insect Mesh', value: vizConfig.mesh ? 'Yes' : 'No' },
    null,
    { label: 'Estimated Price', value: vizConfig.estimatedPrice ? formatCurrency(vizConfig.estimatedPrice) : '—', accent: true, total: true },
  ] : [];

  return (
    <div style={{
      background: 'rgba(62,123,250,0.05)',
      border: '1px solid rgba(62,123,250,0.2)',
      borderRadius: '0.875rem',
      padding: compact ? '1.25rem' : '1.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {isCalc ? <Receipt size={17} style={{ color: 'var(--color-accent)' }} /> : <Layers size={17} style={{ color: 'var(--color-accent)' }} />}
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {isCalc ? 'Quote from Price Calculator' : 'Configuration from Visualizer'}
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {rows.map((row, i) =>
          row === null ? (
            <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.25rem 0' }} />
          ) : (
            <div key={row.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: row.total ? '0.95rem' : '0.84rem',
              fontWeight: row.total ? 700 : 400,
              paddingTop: row.total ? '0.5rem' : 0,
              borderTop: row.total ? '1px solid rgba(62,123,250,0.2)' : 'none',
            }}>
              <span style={{ color: row.total ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{row.label}</span>
              <span style={{ color: row.accent ? 'var(--color-accent)' : 'var(--color-text-primary)', fontWeight: row.total ? 800 : 500 }}>{row.value}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
