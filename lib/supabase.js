import { createClient } from "@supabase/supabase-js";

// Only the public anon key is used. Row Level Security protects the data.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
