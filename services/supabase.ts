import { createClient } from '@supabase/supabase-js';

// These should be replaced with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);