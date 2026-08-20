import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Lead } from '@/lib/types';
import { INITIAL_LEADS } from '@/lib/data';
import fs from 'fs';
import path from 'path';

// Server-side persistent in-memory store in globalThis
declare global {
  var __OUTLOOK_LEADS_STORE: Lead[] | undefined;
}

const CACHE_FILE_PATH = path.join(process.cwd(), '.leads_cache.json');

function loadServerLeads(): Lead[] {
  if (globalThis.__OUTLOOK_LEADS_STORE && Array.isArray(globalThis.__OUTLOOK_LEADS_STORE)) {
    return globalThis.__OUTLOOK_LEADS_STORE;
  }

  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const data = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__OUTLOOK_LEADS_STORE = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read .leads_cache.json:', err);
  }

  globalThis.__OUTLOOK_LEADS_STORE = [...INITIAL_LEADS];
  return globalThis.__OUTLOOK_LEADS_STORE;
}

function saveServerLeads(leads: Lead[]) {
  globalThis.__OUTLOOK_LEADS_STORE = leads;
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    // In read-only serverless environment, in-memory store will still work
    console.warn('Could not persist to .leads_cache.json (serverless read-only filesystem):', err);
  }
}

// Helper to trigger webhook notifications (Telegram / Zapier / Google Sheets / Discord / Formspree etc.)
async function triggerNotificationWebhook(lead: Lead) {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL || process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const summary = `🚨 *New UPVC Enquiry Received!*\n` +
      `👤 *Name:* ${lead.name}\n` +
      `📞 *Phone:* ${lead.phone}\n` +
      `🪟 *Product:* ${lead.product}\n` +
      `📐 *Area:* ${lead.area || 'TBD'}\n` +
      `💰 *Estimated Value:* ${lead.value || '₹ TBD'}\n` +
      `📌 *Source:* ${lead.source || 'Website'}\n` +
      `📝 *Notes:* ${lead.notes || 'None'}\n` +
      `📅 *Date:* ${lead.date}`;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: summary,
        text: summary,
        lead,
      }),
    });
  } catch (err) {
    console.error('Failed to trigger webhook notification:', err);
  }
}

// GET /api/leads - Fetch all leads
export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return NextResponse.json({
            success: true,
            source: 'supabase',
            leads: data as Lead[],
            isConfigured: true,
          });
        }
        if (error) {
          console.error('Supabase query error:', error.message);
          const fallbackLeads = loadServerLeads();
          return NextResponse.json({
            success: false,
            source: 'supabase_error',
            error: error.message,
            leads: fallbackLeads,
            isConfigured: true,
          });
        }
      }
    }

    const currentLeads = loadServerLeads();
    return NextResponse.json({
      success: true,
      source: 'server_store',
      leads: currentLeads,
      isConfigured: false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const fallbackLeads = loadServerLeads();
    return NextResponse.json(
      { success: false, error: message, leads: fallbackLeads },
      { status: 500 }
    );
  }
}

// POST /api/leads - Submit a new enquiry lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, product, area, value, status, source, notes, config } = body;

    if (!name || !phone || !product) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, phone, and product are required.' },
        { status: 400 }
      );
    }

    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4) + Math.floor(100 + Math.random() * 900);
    const newLead: Lead = {
      id: body.id || `LD-${uniqueSuffix}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      product: String(product).trim(),
      area: area ? String(area) : 'TBD',
      value: value ? String(value) : '₹ TBD',
      status: (status as Lead['status']) || 'New',
      date: body.date || new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      notes: notes ? String(notes).trim() : undefined,
      source: source || 'Direct Enquiry',
      config: config || undefined,
    };

    // 1. Always save to server persistence store so all admins / sessions see it
    const currentLeads = loadServerLeads();
    const updatedLeads = [newLead, ...currentLeads.filter((l) => l.id !== newLead.id)];
    saveServerLeads(updatedLeads);

    let savedToSupabase = false;
    let dbError: string | null = null;

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { error } = await supabase.from('leads').insert([
          {
            id: newLead.id,
            name: newLead.name,
            phone: newLead.phone,
            email: newLead.email,
            product: newLead.product,
            area: newLead.area,
            value: newLead.value,
            status: newLead.status,
            date: newLead.date,
            notes: newLead.notes,
            source: newLead.source,
            config: newLead.config,
          },
        ]);

        if (error) {
          console.error('Error inserting into Supabase:', error.message);
          dbError = error.message;
        } else {
          savedToSupabase = true;
        }
      }
    }

    // 3. Trigger webhook notification if configured
    await triggerNotificationWebhook(newLead);

    return NextResponse.json({
      success: true,
      lead: newLead,
      savedToSupabase,
      dbError,
      isConfigured: isSupabaseConfigured,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PATCH /api/leads - Update lead status or details
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Update in server store
    const currentLeads = loadServerLeads();
    const updatedLeads = currentLeads.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          ...(status ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
        };
      }
      return l;
    });
    saveServerLeads(updatedLeads);

    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const { error } = await supabase
          .from('leads')
          .update(updateData)
          .eq('id', id);

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true, id, status, notes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/leads - Delete a lead
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Remove from server store
    const currentLeads = loadServerLeads();
    const updatedLeads = currentLeads.filter((l) => l.id !== id);
    saveServerLeads(updatedLeads);

    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id);

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

