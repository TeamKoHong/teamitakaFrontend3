// Supabase 클라이언트 설정
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 설정되지 않았습니다. 이메일 인증 기능이 동작하지 않을 수 있습니다.');
}

const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

export default supabase;
