'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ChevronRight,
  Lock,
  Search,
  Download,
  Trash2,
  Phone,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Eye,
  X,
  CheckCircle2,
  Database,
  Cloud,
  Globe,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { useLeads, parseLeadValue } from '@/lib/store';
import { MONTHLY_DATA } from '@/lib/data';
import type { Lead, LeadStatus } from '@/lib/types';

type FilterStatus = LeadStatus | 'all';

const STATUS_ORDER: LeadStatus[] = ['New', 'Contacted', 'Quoted', 'Confirmed'];
const ADMIN_PASSWORD = 'outlook2026';

const STATUS_STYLES: Record<LeadStatus, { bg: string; color: string; border: string }> = {
  New: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.4)' },
  Contacted: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
  Quoted: { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.4)' },
  Confirmed: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.4)' },
};

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      onLogin();
    } else {
      setError('Invalid password. Hint: outlook2026');
      setPassword('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 30%, #0f2744 0%, #06111f 100%)',
        padding: '2rem 1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card"
        style={{
          padding: '3rem 2.5rem',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              background: 'rgba(62, 123, 250, 0.15)',
              border: '1px solid rgba(62, 123, 250, 0.4)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Lock size={30} color="#60a5fa" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem' }}>
            CRM Admin Login
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Outlook Enterprises UPVC Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password (outlook2026)"
              autoFocus
              className="form-control"
              style={{
                width: '100%',
                padding: '0.9rem 1.1rem',
                fontSize: '1rem',
                borderColor: error ? '#ef4444' : undefined,
              }}
            />
            {error && (
              <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '0.5rem', fontWeight: 500 }}>
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              justifyContent: 'center',
              padding: '0.9rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            Access Dashboard →
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.78rem' }}>
            Managing Partners: Saravanavel & Durai
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const {
    leads,
    isLoaded,
    isCloudConnected,
    isSyncing,
    syncError,
    refreshLeads,
    addLead,
    updateLeadStatus,
    deleteLead,
    resetLeads,
  } = useLeads();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    setAuthenticated(isAuth);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Dynamic metrics calculated reactively from live leads
  const metrics = useMemo(() => {
    const total = leads.length;
    const confirmed = leads.filter((l) => l.status === 'Confirmed').length;
    const quoted = leads.filter((l) => l.status === 'Quoted').length;
    const contacted = leads.filter((l) => l.status === 'Contacted').length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    const pipelineValue = leads.reduce((sum, l) => sum + parseLeadValue(l.value), 0);

    return { total, confirmed, quoted, contacted, newCount, conversionRate, pipelineValue };
  }, [leads]);

  // Dynamic Lead Sources pie chart derived from real leads
  const leadSourcesData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const src = l.source || 'Direct Enquiry';
      counts[src] = (counts[src] || 0) + 1;
    });

    const palette = ['#3E7BFA', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: palette[idx % palette.length],
    }));
  }, [leads]);

  // Filter and search
  const filteredLeads = useMemo(() => {
    const seen = new Set<string>();
    return leads.filter((lead) => {
      if (!lead || !lead.id || seen.has(lead.id)) return false;
      seen.add(lead.id);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.product.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q) ||
        (lead.source && lead.source.toLowerCase().includes(q))
      );
    });
  }, [leads, statusFilter, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No leads to export.');
      return;
    }

    const headers = ['Lead ID', 'Customer Name', 'Phone', 'Product', 'Estimated Value', 'Status', 'Source', 'Date'];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.product.replace(/"/g, '""')}"`,
      `"${l.value.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.source || 'Direct Enquiry'}"`,
      `"${l.date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `outlook_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✅ Leads exported to CSV successfully!');
  };

  // Add demo test lead to verify instant live updates
  const handleAddTestLead = () => {
    const products = ['Ultra-Quiet Sliding Window', 'Lift & Slide Patio Door', 'European Tilt & Turn Window', 'French Balcony Door'];
    const names = ['Karthik Venkat', 'Lakshmi Priya', 'Sundarajan M.', 'Meera Krishnan', 'Arunachalam & Co.'];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomVal = Math.floor(80000 + Math.random() * 250000);

    addLead({
      name: randomName,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      product: randomProduct,
      area: `${Math.floor(150 + Math.random() * 400)} sq ft`,
      value: `₹ ${randomVal.toLocaleString('en-IN')}`,
      status: 'New',
      source: 'Direct Enquiry',
    });
    showToast(`🚀 New lead for "${randomName}" logged in real-time!`);
  };

  if (!mounted) return null;

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 10%, #0c2340 0%, #050d18 100%)',
        paddingTop: '6rem',
        paddingBottom: '4rem',
      }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '80px',
              right: '24px',
              zIndex: 9999,
              background: 'rgba(16, 185, 129, 0.95)',
              color: 'white',
              padding: '0.85rem 1.4rem',
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontWeight: 600,
              fontSize: '0.9rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header Bar */}
        <div
          style={{
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                Admin CRM & Sales Dashboard
              </h1>
              {isCloudConnected ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(16, 185, 129, 0.18)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                    }}
                  />
                  🟢 Supabase Cloud Active
                </span>
              ) : (
                <button
                  onClick={() => setShowSetupModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(245, 158, 11, 0.18)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Click to view instructions for connecting Supabase DB on Vercel"
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#f59e0b',
                      boxShadow: '0 0 8px #f59e0b',
                    }}
                  />
                  🟡 Local Mode (Click to connect Cloud DB)
                </button>
              )}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              Real-time lead capture, customer inquiries & pipeline conversion tracking
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={async () => {
                await refreshLeads();
                showToast('🔄 Lead list refreshed from server');
              }}
              disabled={isSyncing}
              className="btn-secondary"
              style={{
                fontSize: '0.85rem',
                padding: '0.65rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              title="Sync leads from the server database"
            >
              <RefreshCw size={15} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} /> {isSyncing ? 'Syncing...' : 'Sync Leads'}
            </button>

            <button
              onClick={handleAddTestLead}
              className="btn-secondary"
              style={{
                fontSize: '0.85rem',
                padding: '0.65rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              title="Add a sample lead to simulate user enquiry submission"
            >
              <Sparkles size={15} color="#fbbf24" /> + Simulate Enquiry
            </button>

            <button
              onClick={() => setShowSetupModal(true)}
              className="btn-secondary"
              style={{
                fontSize: '0.85rem',
                padding: '0.65rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              title="View Vercel & Supabase Cloud Storage Setup"
            >
              <Database size={15} color="#60a5fa" /> Database Setup
            </button>

            <button
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{
                fontSize: '0.85rem',
                padding: '0.65rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Download size={15} /> Export CSV
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('admin_authenticated');
                setAuthenticated(false);
              }}
              style={{
                padding: '0.65rem 1.25rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Sync Error Alert Banner if Supabase connection fails */}
        {syncError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              padding: '1rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              color: '#fca5a5',
              fontSize: '0.88rem',
            }}
          >
            <div>
              <strong>⚠️ Cloud Database Sync Warning:</strong> {syncError}.
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>
                Please ensure your Supabase <code>anon</code> key is set in <code>.env.local</code> and in Vercel Project Settings.
              </div>
            </div>
            <button
              onClick={() => setShowSetupModal(true)}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Fix Key Setup →
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="glass-card"
            style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Inquiries
                </p>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', margin: 0 }}>
                  {metrics.total}
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#60a5fa', marginTop: '0.3rem', fontWeight: 500 }}>
                  {metrics.newCount} New awaiting contact
                </p>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={28} color="#60a5fa" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
            style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Confirmed Orders
                </p>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399', margin: 0 }}>
                  {metrics.confirmed}
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem' }}>
                  {metrics.quoted} In Quotation stage
                </p>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={28} color="#34d399" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Conversion Rate
                </p>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fbbf24', margin: 0 }}>
                  {metrics.conversionRate}%
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem' }}>
                  Lead to site-visit closed
                </p>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={28} color="#fbbf24" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
            style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Pipeline Value
                </p>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', margin: 0 }}>
                  ₹ {(metrics.pipelineValue / 100000).toFixed(2)} Lakhs
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem' }}>
                  Cumulative estimate volume
                </p>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={28} color="#a78bfa" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visual Charts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card"
            style={{ padding: '1.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', margin: 0 }}>
                Monthly Order Volume Trend (₹)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>2026 Financial Year</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '0.78rem' }} />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '0.78rem' }} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                <Tooltip
                  formatter={(val: any) => [`₹ ${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{
                    background: 'rgba(6, 17, 31, 0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3E7BFA"
                  strokeWidth={3}
                  dot={{ fill: '#3E7BFA', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Real-time Lead Source Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
            style={{ padding: '1.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', margin: 0 }}>
                Live Inquiry Source Attribution
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#34d399' }}>● Auto Computed</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={leadSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {leadSourcesData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Inquiries`, name]}
                  contentStyle={{
                    background: 'rgba(6, 17, 31, 0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Lead Management Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card"
          style={{ overflow: 'hidden', padding: 0 }}
        >
          {/* Table Controls / Filters Bar */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(12, 35, 64, 0.4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by customer name, phone, product, ID..."
                  className="form-control"
                  style={{
                    paddingLeft: '2.3rem',
                    fontSize: '0.875rem',
                    background: 'rgba(255,255,255,0.06)',
                    borderColor: 'rgba(255,255,255,0.15)',
                    height: '40px',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(['all', 'New', 'Contacted', 'Quoted', 'Confirmed'] as FilterStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: statusFilter === st ? '1px solid #3E7BFA' : '1px solid rgba(255,255,255,0.12)',
                      background: statusFilter === st ? '#3E7BFA' : 'rgba(255,255,255,0.05)',
                      color: 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    {st === 'all' ? `All (${leads.length})` : `${st} (${leads.filter((l) => l.status === st).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  if (confirm('Reset lead pipeline to default seed leads?')) {
                    resetLeads();
                    showToast('↺ Leads reset to initial demo dataset');
                  }
                }}
                className="btn-secondary"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.45rem 0.8rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
                title="Reset to default seed data"
              >
                <RefreshCw size={13} style={{ marginRight: 4 }} /> Reset Demo
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(6, 17, 31, 0.7)' }}>
                  {['Lead ID', 'Customer Details', 'Contact Actions', 'Requirement', 'Est. Value', 'Status / Pipeline Stage', 'Source', 'Date', 'Manage'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: '0.95rem 1.1rem',
                          textAlign: 'left',
                          color: 'rgba(255,255,255,0.75)',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLeads.map((lead, i) => {
                    const style = STATUS_STYLES[lead.status] || STATUS_STYLES.New;
                    const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(lead.status) + 1];
                    const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');

                    return (
                      <motion.tr
                        key={`${lead.id}-${i}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          background: lead.status === 'New' ? 'rgba(59, 130, 246, 0.03)' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = lead.status === 'New' ? 'rgba(59, 130, 246, 0.03)' : 'transparent')
                        }
                      >
                        {/* Lead ID */}
                        <td style={{ padding: '0.95rem 1.1rem', color: '#60a5fa', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {lead.id}
                        </td>

                        {/* Customer Details */}
                        <td style={{ padding: '0.95rem 1.1rem', minWidth: '160px' }}>
                          <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.15rem' }}>
                            {lead.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                            {lead.phone}
                          </div>
                        </td>

                        {/* Direct Contact Actions */}
                        <td style={{ padding: '0.95rem 1.1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <a
                              href={`tel:${cleanPhone}`}
                              title={`Call ${lead.name}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                height: 30,
                                borderRadius: '6px',
                                background: 'rgba(59, 130, 246, 0.15)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                color: '#60a5fa',
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                              }}
                            >
                              <Phone size={14} />
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                                `Hello ${lead.name}, regarding your UPVC inquiry for ${lead.product} from Outlook Enterprises:`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`WhatsApp ${lead.name}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                height: 30,
                                borderRadius: '6px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                color: '#34d399',
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                              }}
                            >
                              <MessageSquare size={14} />
                            </a>
                          </div>
                        </td>

                        {/* Product System */}
                        <td style={{ padding: '0.95rem 1.1rem', maxWidth: '200px' }}>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.84rem' }}>
                            {lead.product}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                            Area: {lead.area || 'TBD'}
                          </div>
                        </td>

                        {/* Value */}
                        <td style={{ padding: '0.95rem 1.1rem', fontWeight: 700, color: '#34d399', whiteSpace: 'nowrap' }}>
                          {lead.value}
                        </td>

                        {/* Status Pipeline with Fast Advance */}
                        <td style={{ padding: '0.95rem 1.1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                updateLeadStatus(lead.id, e.target.value as LeadStatus);
                                showToast(`Lead status updated to ${e.target.value}`);
                              }}
                              style={{
                                background: style.bg,
                                color: style.color,
                                border: `1px solid ${style.border}`,
                                borderRadius: '6px',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                outline: 'none',
                              }}
                            >
                              {STATUS_ORDER.map((st) => (
                                <option key={st} value={st} style={{ background: '#0c2340', color: 'white' }}>
                                  {st}
                                </option>
                              ))}
                            </select>

                            {nextStatus && (
                              <button
                                onClick={() => {
                                  updateLeadStatus(lead.id, nextStatus);
                                  showToast(`Advanced ${lead.name} to ${nextStatus}`);
                                }}
                                title={`Advance to ${nextStatus}`}
                                style={{
                                  background: 'rgba(255,255,255,0.08)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '4px',
                                  padding: '0.3rem 0.5rem',
                                  cursor: 'pointer',
                                  color: 'white',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  fontSize: '0.72rem',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'white';
                                  e.currentTarget.style.color = '#0c2340';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                  e.currentTarget.style.color = 'white';
                                }}
                              >
                                <span>{nextStatus}</span>
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Source */}
                        <td style={{ padding: '0.95rem 1.1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              padding: '0.2rem 0.5rem',
                            }}
                          >
                            {lead.source || 'Direct Enquiry'}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '0.95rem 1.1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                          {lead.date}
                        </td>

                        {/* Row Actions */}
                        <td style={{ padding: '0.95rem 1.1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {lead.config && (
                              <button
                                onClick={() => setSelectedLead(lead)}
                                title="View Specification Config"
                                style={{
                                  background: 'rgba(62, 123, 250, 0.15)',
                                  border: '1px solid rgba(62, 123, 250, 0.3)',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.5rem',
                                  color: '#60a5fa',
                                  cursor: 'pointer',
                                }}
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete lead "${lead.name}" (${lead.id})?`)) {
                                  deleteLead(lead.id);
                                  showToast(`Lead ${lead.id} removed`);
                                }
                              }}
                              title="Delete Lead"
                              style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                borderRadius: '6px',
                                padding: '0.35rem 0.5rem',
                                color: '#f87171',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  No inquiries found matching your filters
                </p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
                  Try adjusting your search query or status filter.
                </p>
                <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Config Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                maxWidth: '540px',
                width: '100%',
                padding: '2rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: '#0c2340',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#60a5fa', fontWeight: 700 }}>
                    {selectedLead.id}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', margin: '0.2rem 0' }}>
                    {selectedLead.name}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                    {selectedLead.phone} • {selectedLead.product}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                }}
              >
                {selectedLead.notes && (
                  <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem' }}>
                      Customer Notes / Request Details
                    </h4>
                    <p style={{ color: '#fbbf24', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {selectedLead.notes}
                    </p>
                  </div>
                )}

                {selectedLead.config ? (
                  <>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
                      Configuration Payload
                    </h4>
                    <pre style={{ color: '#34d399', fontSize: '0.78rem', overflowX: 'auto', margin: 0 }}>
                      {JSON.stringify(selectedLead.config, null, 2)}
                    </pre>
                  </>
                ) : (
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                    <p><strong>Estimated Area:</strong> {selectedLead.area}</p>
                    <p><strong>Quote Value:</strong> {selectedLead.value}</p>
                    <p><strong>Submitted Date:</strong> {selectedLead.date}</p>
                    <p><strong>Source:</strong> {selectedLead.source || 'Direct Website Enquiry'}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setSelectedLead(null)} className="btn-secondary">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cloud Database Setup Guidance Modal */}
      <AnimatePresence>
        {showSetupModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(6px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setShowSetupModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: '#0c2340',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0 }}>
                    ⚡ Connect Supabase Cloud Database to Vercel
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Follow these 2 quick steps so all enquiries submitted on Vercel are saved permanently in the cloud.
                  </p>
                </div>
                <button
                  onClick={() => setShowSetupModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1.25rem' }}>
                  <h4 style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Step 1: Run SQL in Supabase SQL Editor
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    Open your free project on <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'underline' }}>supabase.com</a> &gt; <strong>SQL Editor</strong> &gt; Click <strong>New Query</strong>, paste the content of <code>supabase_setup.sql</code>, and click <strong>Run</strong>.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1.25rem' }}>
                  <h4 style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Step 2: Add Environment Variables in Vercel
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    In your <strong>Vercel Dashboard</strong> &gt; Your Project &gt; <strong>Settings</strong> &gt; <strong>Environment Variables</strong>, add:
                  </p>
                  <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '6px', color: '#34d399', fontSize: '0.78rem', overflowX: 'auto' }}>
                    {`NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key\nSUPABASE_SERVICE_ROLE_KEY = your-supabase-service-role-key`}
                  </pre>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    💡 Then click <strong>Redeploy</strong> on Vercel. All public enquiries will now stream live into Supabase and appear on this dashboard!
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setShowSetupModal(false)} className="btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
                  Got It, Thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
