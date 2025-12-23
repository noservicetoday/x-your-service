import { createClient } from '@supabase/supabase-js'

// 這裡會自動讀取你在 Vercel 設定的環境變數
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)