import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fucmhstmvlkxqihucmkx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Cf2QoHl8kNBFZ7RA2L2elA_7-Kt3jp-';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const SUPABASE_URL = supabaseUrl;
