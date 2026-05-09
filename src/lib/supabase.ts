import { createClient } from '@supabase/supabase-js';

let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder').trim();

// Validate the URL. If it's completely missing, malformed, or lacks http/https (e.g. they typed "your-url" in .env),
// new URL() will fail or we'll catch it, and we force a safe fallback so Next.js doesn't crash.
try {
  const parsed = new URL(supabaseUrl);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Invalid protocol');
  }
} catch (e) {
  supabaseUrl = 'https://placeholder.supabase.co';
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
