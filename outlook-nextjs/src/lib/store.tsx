'use client';
// Outlook Enterprises — Lead Store with Hybrid Server + Local Storage Sync
// Supports Supabase PostgreSQL backend on Vercel with localStorage caching & cross-tab sync

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { INITIAL_LEADS } from './data';
import type { Lead, LeadStatus } from './types';

interface LeadStore {
  leads: Lead[];
  isLoaded: boolean;
  isCloudConnected: boolean;
  isSyncing: boolean;
  syncError: string | null;
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => Promise<Lead>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  resetLeads: () => void;
  refreshLeads: () => Promise<void>;
  getMetrics: () => {
    total: number;
    confirmed: number;
    conversionRate: number;
    pipelineValue: number;
  };
}

const LeadContext = createContext<LeadStore | null>(null);

export const STORAGE_KEY = 'outlook_leads';
export const LEADS_SYNC_EVENT = 'outlook_leads_sync_event';

export function parseLeadValue(v?: string): number {
  if (!v) return 0;
  return parseInt(v.replace(/[₹,\s(est.)]/g, ''), 10) || 0;
}

// Ensure every lead has a unique ID and remove any historical duplicates
function sanitizeAndDeduplicateLeads(rawLeads: Lead[]): Lead[] {
  if (!Array.isArray(rawLeads)) return INITIAL_LEADS;
  const seenIds = new Set<string>();
  const uniqueLeads: Lead[] = [];

  for (const lead of rawLeads) {
    if (!lead || typeof lead !== 'object') continue;
    let leadId = lead.id;
    if (!leadId || seenIds.has(leadId)) {
      leadId = `LD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    seenIds.add(leadId);
    uniqueLeads.push({
      ...lead,
      id: leadId,
    });
  }

  return uniqueLeads;
}

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => sanitizeAndDeduplicateLeads(INITIAL_LEADS));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadFromStorage = useCallback((): Lead[] => {
    if (typeof window === 'undefined') return INITIAL_LEADS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Lead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeAndDeduplicateLeads(parsed);
          setLeads(sanitized);
          return sanitized;
        }
      }
      const initial = sanitizeAndDeduplicateLeads(INITIAL_LEADS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      setLeads(initial);
      return initial;
    } catch (e) {
      console.warn('Failed to load leads from localStorage', e);
      setLeads(sanitizeAndDeduplicateLeads(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
  }, []);

  const saveToStorage = (updatedLeads: Lead[]) => {
    const sanitized = sanitizeAndDeduplicateLeads(updatedLeads);
    setLeads(sanitized);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        window.dispatchEvent(new CustomEvent(LEADS_SYNC_EVENT, { detail: sanitized }));
      } catch (e) {
        console.error('Failed to save leads to localStorage', e);
      }
    }
  };

  // Fetch leads from Next.js server API / Supabase
  const refreshLeads = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/leads', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.source === 'supabase' && Array.isArray(data.leads)) {
          setIsCloudConnected(true);
          setSyncError(null);
          saveToStorage(data.leads);
        } else if (data.source === 'supabase_error') {
          setIsCloudConnected(false);
          setSyncError(data.error || 'Supabase connection error');
          if (Array.isArray(data.leads) && data.leads.length > 0) {
            saveToStorage(data.leads);
          }
        } else {
          // Server persistence store fallback
          setIsCloudConnected(false);
          if (Array.isArray(data.leads) && data.leads.length > 0) {
            saveToStorage(data.leads);
          }
        }
      } else {
        const errJson = await res.json().catch(() => null);
        setSyncError(errJson?.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Server leads sync skipped (offline or network error):', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initial load and sync listeners
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFromStorage();
    setIsLoaded(true);
    refreshLeads();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || !e.key) {
        loadFromStorage();
      }
    };
    const handleCustomSync = () => {
      loadFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LEADS_SYNC_EVENT, handleCustomSync);

    // Fallback polling every 15s in case realtime drops or isn't enabled
    const intervalId = setInterval(() => {
      refreshLeads();
    }, 15000);

    // Supabase Real-time setup
    let channel: any = null;
    import('@/lib/supabase').then(({ getSupabaseClient }) => {
      const supabase = getSupabaseClient();
      if (supabase) {
        channel = supabase
          .channel('schema-db-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'leads' },
            () => {
              refreshLeads(); // Fetch new data when anything changes
            }
          )
          .subscribe();
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LEADS_SYNC_EVENT, handleCustomSync);
      clearInterval(intervalId);
      if (channel) {
        import('@/lib/supabase').then(({ getSupabaseClient }) => {
          getSupabaseClient()?.removeChannel(channel);
        });
      }
    };
  }, [loadFromStorage, refreshLeads]);

  const addLead = async (lead: Omit<Lead, 'id' | 'date'>): Promise<Lead> => {
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4) + Math.floor(100 + Math.random() * 900);
    const newLead: Lead = {
      ...lead,
      id: `LD-${uniqueSuffix}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    // 1. Optimistically update local state & localStorage immediately
    setLeads((prev) => {
      const sanitizedPrev = sanitizeAndDeduplicateLeads(prev);
      const next = [newLead, ...sanitizedPrev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent(LEADS_SYNC_EVENT, { detail: next }));
        } catch { /* ignore */ }
      }
      return next;
    });

    // 2. Persist to server / Supabase API
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.savedToSupabase) {
          setIsCloudConnected(true);
          setSyncError(null);
        } else if (json.dbError) {
          console.warn('Supabase DB error on save:', json.dbError);
          setSyncError(json.dbError);
        }
      }
    } catch (err) {
      console.warn('Background lead submission sync failed:', err);
    }

    return newLead;
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    // 1. Optimistic update
    setLeads((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, status } : l));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent(LEADS_SYNC_EVENT, { detail: next }));
        } catch { /* ignore */ }
      }
      return next;
    });

    // 2. Server update
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error('Failed to update lead status on server:', err);
    }
  };

  const deleteLead = async (id: string) => {
    // 1. Optimistic delete
    setLeads((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent(LEADS_SYNC_EVENT, { detail: next }));
        } catch { /* ignore */ }
      }
      return next;
    });

    // 2. Server delete
    try {
      await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete lead on server:', err);
    }
  };

  const resetLeads = () => {
    saveToStorage(INITIAL_LEADS);
  };

  const getMetrics = () => {
    const total = leads.length;
    const confirmed = leads.filter((l) => l.status === 'Confirmed').length;
    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    const pipelineValue = leads.reduce((sum, l) => sum + parseLeadValue(l.value), 0);
    return { total, confirmed, conversionRate, pipelineValue };
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoaded,
        isCloudConnected,
        isSyncing,
        syncError,
        addLead,
        updateLeadStatus,
        deleteLead,
        resetLeads,
        refreshLeads,
        getMetrics,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads(): LeadStore {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLeads must be used within LeadProvider');
  return ctx;
}
