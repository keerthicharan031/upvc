'use client';
// Outlook Enterprises — Client-side Lead Store
// Uses localStorage for persistence between page loads

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { INITIAL_LEADS } from './data';
import type { Lead, LeadStatus } from './types';

interface LeadStore {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  getMetrics: () => {
    total: number;
    confirmed: number;
    conversionRate: number;
    pipelineValue: number;
  };
}

const LeadContext = createContext<LeadStore | null>(null);

const STORAGE_KEY = 'outlook_leads';

function parseValue(v: string): number {
  // Parse "₹ 3,37,500" → 337500
  return parseInt(v.replace(/[₹,\s]/g, ''), 10) || 0;
}

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Lead[];
        // Merge: keep initial leads + any new ones stored
        const initialIds = new Set(INITIAL_LEADS.map((l) => l.id));
        const newLeads = parsed.filter((l) => !initialIds.has(l.id));
        setLeads([...INITIAL_LEADS, ...newLeads]);
      }
    } catch {
      // ignore
    }
  }, []);

  const addLead = (lead: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...lead,
      id: `LD-${9042 + Math.floor(Math.random() * 1000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setLeads((prev) => {
      const next = [newLead, ...prev];
      try {
        const toStore = next.filter((l) => !INITIAL_LEADS.some((il) => il.id === l.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      } catch { /* ignore */ }
      return next;
    });
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const getMetrics = () => {
    const total = leads.length;
    const confirmed = leads.filter((l) => l.status === 'Confirmed').length;
    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    const pipelineValue = leads.reduce((sum, l) => sum + parseValue(l.value), 0);
    return { total, confirmed, conversionRate, pipelineValue };
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLeadStatus, getMetrics }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads(): LeadStore {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLeads must be used within LeadProvider');
  return ctx;
}
