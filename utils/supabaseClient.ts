import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvfkrsqxbxzbwiojvghz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? (() => { throw new Error('SUPABASE_KEY is required') })()
const supabaseClient = createClient(supabaseUrl, supabaseKey)
export { supabaseClient }
