'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, DollarSign, ChevronRight, Lock } from 'lucide-react';
import { INITIAL_LEADS, MONTHLY_DATA, LEAD_SOURCES } from '@/lib/data';
import type { Lead, LeadStatus } from '@/lib/types';

type FilterStatus = LeadStatus | 'all';

const STATUS_ORDER: LeadStatus[] = ['New', 'Contacted', 'Quoted', 'Confirmed'];
const ADMIN_PASSWORD = 'outlook2026';

const STATUS_STYLES: Record<LeadStatus, { bg: string; color: string }> = {
  New: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  Contacted: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  Quoted: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
  Confirmed: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
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
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', paddingTop: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'white',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '3rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              background: '#eff6ff',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Lock size={32} color="#3b82f6" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Admin Login</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Enter your password to access the CRM</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              autoFocus
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                background: '#f1f5f9',
                border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                borderRadius: '8px',
                color: '#1e293b',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = error ? '#ef4444' : '#e2e8f0';
              }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>❌ {error}</p>}
          </div>

          <button
            type="submit"
            style={{
              padding: '0.875rem 1rem',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Login to Dashboard
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
          Outlook Enterprises Admin Portal
        </p>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    setAuthenticated(isAuth);
    
    try {
      const stored = localStorage.getItem('outlook_leads');
      if (stored) {
        const parsed = JSON.parse(stored) as Lead[];
        setLeads([...INITIAL_LEADS, ...parsed.filter((l) => !INITIAL_LEADS.some((il) => il.id === l.id))]);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!mounted) return null;

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  const updateLeadStatus = (id: string, newStatus: LeadStatus) => {
    const updated = leads.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead));
    setLeads(updated);
    localStorage.setItem('outlook_leads', JSON.stringify(updated));
  };

  const filteredLeads = statusFilter === 'all' ? leads : leads.filter((l) => l.status === statusFilter);

  const metrics = {
    total: leads.length,
    confirmed: leads.filter((l) => l.status === 'Confirmed').length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter((l) => l.status === 'Confirmed').length / leads.length) * 100) : 0,
    pipelineValue: leads.reduce((sum, l) => sum + parseInt(l.value.replace(/[₹,\s]/g, ''), 10) || 0, 0),
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c2340 0%, #1e3a8a 100%)', paddingTop: '6rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
              Sales Pipeline & Lead Management System
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_authenticated');
              setAuthenticated(false);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              border: 'none',
              borderRadius: '6px',
              color: '#0c2340',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Logout
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Total Leads</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>{metrics.total}</h2>
              </div>
              <Users size={40} color="white" style={{ opacity: 0.35 }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Confirmed Sales</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>{metrics.confirmed}</h2>
              </div>
              <Target size={40} color="white" style={{ opacity: 0.35 }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Conversion Rate</p>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>{metrics.conversionRate}%</h2>
              </div>
              <TrendingUp size={40} color="white" style={{ opacity: 0.35 }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500 }}>Pipeline Value</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                  ₹ {(metrics.pipelineValue / 100000).toFixed(1)}L
                </h2>
              </div>
              <DollarSign size={40} color="white" style={{ opacity: 0.35 }} />
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                <XAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '0.8rem' }} />
                <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '0.8rem' }} />
                <Tooltip contentStyle={{ background: 'rgba(12,35,64,0.95)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: 'white' }} />
                <Line type="monotone" dataKey="value" stroke="white" strokeWidth={3} dot={{ fill: 'white', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Lead Sources Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={LEAD_SOURCES} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {LEAD_SOURCES.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.25)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '2px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'rgba(12,35,64,0.5)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Lead Management Pipeline</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                padding: '0.6rem 0.875rem',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              <option value="all">All Pipeline Leads</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.865rem' }}>
              <thead>
                <tr style={{ background: 'rgba(12,35,64,0.6)' }}>
                  {['Lead ID', 'Customer Name', 'Phone', 'Product System', 'Est. Value', 'Pipeline Status', 'Source', 'Date'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.875rem 1.25rem',
                        textAlign: 'left',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        borderBottom: '2px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLeads.map((lead, i) => {
                    const style = STATUS_STYLES[lead.status];
                    const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(lead.status) + 1];
                    return (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          transition: 'background 0.15s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '0.9rem 1.25rem', color: 'white', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          {lead.id}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: 'white' }}>{lead.name}</td>
                        <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.85)' }}>{lead.phone}</td>
                        <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.85)', maxWidth: 180 }}>{lead.product}</td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'white' }}>{lead.value}</td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                background: style.bg,
                                color: style.color,
                                borderRadius: '6px',
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {lead.status}
                            </span>
                            {nextStatus && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, nextStatus)}
                                title={`Advance to ${nextStatus}`}
                                style={{
                                  background: 'rgba(255,255,255,0.15)',
                                  border: '2px solid rgba(255,255,255,0.35)',
                                  borderRadius: '4px',
                                  padding: '0.25rem 0.5rem',
                                  cursor: 'pointer',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'white';
                                  e.currentTarget.style.color = '#0c2340';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                  e.currentTarget.style.color = 'white';
                                }}
                              >
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>{lead.source || '—'}</td>
                        <td style={{ padding: '0.9rem 1.25rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {lead.date}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.65)' }}>No leads matching this filter.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
