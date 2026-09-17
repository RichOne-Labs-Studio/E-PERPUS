import { createClient } from '@supabase/supabase-js';

// URL proyek Supabase Anda (berdasarkan URL yang Anda berikan)
const supabaseUrl = 'https://knddeesnbbeuwasyowsz.supabase.co';

// Kunci Anon (Public) Supabase Anda. 
// Ini akan diambil dari pengaturan rahasia (Secrets) di AI Studio.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
