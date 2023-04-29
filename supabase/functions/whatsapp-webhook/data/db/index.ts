import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
 

// Create a single supabase client for interacting with your database
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;