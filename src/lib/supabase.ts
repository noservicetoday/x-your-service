import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 如果 URL 為空，這行會拋出錯誤引發 Next.js 的 Runtime Error 畫面
export const supabase = createClient(supabaseUrl, supabaseKey);