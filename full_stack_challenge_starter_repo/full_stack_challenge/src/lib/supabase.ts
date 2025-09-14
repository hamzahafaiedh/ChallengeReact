import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;
export const clientIdToken = (import.meta as any).env.VITE_CLIENT_ID as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);