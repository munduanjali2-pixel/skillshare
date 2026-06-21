import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a function to get supabase client safely
export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url_here')) {
    console.warn('Supabase not configured properly. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = getSupabaseClient()