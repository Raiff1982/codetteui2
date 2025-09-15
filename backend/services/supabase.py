import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'codette-ai-platform'
    }
  }
});

// Database types for ethical AI
export interface Database {
  public: {
    Tables: {
      ethical_code_generations: {
        Row: {
          id: string;
          prompt: string;
          generated_code: string;
          language: string;
          verification_status: 'verified' | 'testing' | 'failed';
          ethical_score: number;
          transparency_report: any;
          execution_test: any;
          created_at: string;
        };
        Insert: {
          prompt: string;
          generated_code: string;
          language: string;
          verification_status: 'verified' | 'testing' | 'failed';
          ethical_score: number;
          transparency_report: any;
          execution_test: any;
        };
        Update: {
          verification_status?: 'verified' | 'testing' | 'failed';
          ethical_score?: number;
          transparency_report?: any;
          execution_test?: any;
        };
      };
    };
  };
}