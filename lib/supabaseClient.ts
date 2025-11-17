
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://qlhebhrpuftazcwxjpdp.supabase.co'; // This is your URL.
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // PASTE YOUR KEY HERE. Find this in your Supabase project's API settings.

if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    console.error("Supabase URL is not configured. Please add it to lib/supabaseClient.ts");
}
if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
    console.error("Supabase Anon Key is not configured. Please add it to lib/supabaseClient.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);