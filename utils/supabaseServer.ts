import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvfkrsqxbxzbwiojvghz.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
// Server-side client with service role key (bypasses RLS)
const supabaseServer = createClient(supabaseUrl,supabaseKey);

export { supabaseServer };
