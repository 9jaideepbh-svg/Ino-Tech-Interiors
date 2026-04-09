import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bfotzjkiymcplnatgxzv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmb3R6amtpeW1jcGxuYXRneHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDIyODksImV4cCI6MjA5MTIxODI4OX0.hKMDHaFqbtOnF9rOt1mHoPLJTO2oUzeOoNILvPl-6Gk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
