import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    diagnostics: {
      hasUrl: Boolean(supabaseUrl),
      urlStartsWithHttps: Boolean(supabaseUrl && supabaseUrl.startsWith('https://')),
      hasAnonKey: Boolean(supabaseAnonKey),
      anonKeyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
      hasServiceKey: Boolean(supabaseServiceKey),
      isPlaceholderUrl: Boolean(supabaseUrl && supabaseUrl.includes('your-project')),
    },
    message: 'Temporary safe diagnostic endpoint. Keys are never printed.',
  });
}
