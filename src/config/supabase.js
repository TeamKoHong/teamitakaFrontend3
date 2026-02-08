// Supabase 클라이언트 설정
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase 환경 변수 미설정 — 이메일 인증 기능 비활성화
}

const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

export default supabase;
