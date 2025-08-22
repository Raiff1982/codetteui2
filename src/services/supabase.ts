import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngvcyxvtorwqocnqcbyz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndmN5eHZ0b3J3cW9jbnFjYnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTM4OTQsImV4cCI6MjA2MzU2OTg5NH0.jGgKmB80e0a0oEUiyO0voSDeKGwTiRwZPdcGGf2CU_M';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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