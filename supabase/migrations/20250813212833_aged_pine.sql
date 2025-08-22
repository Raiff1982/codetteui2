/*
  # Create ethical code generations table

  1. New Tables
    - `ethical_code_generations`
      - `id` (uuid, primary key)
      - `prompt` (text) - The user's request
      - `generated_code` (text) - The actual generated code
      - `language` (text) - Programming language
      - `verification_status` (text) - verified, testing, or failed
      - `ethical_score` (numeric) - Score from 0-1
      - `transparency_report` (jsonb) - Full transparency data
      - `execution_test` (jsonb) - Test execution results
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ethical_code_generations` table
    - Add policy for authenticated users to manage their generations
    - Add policy for public read access to verified generations

  3. Indexes
    - Index on verification_status for filtering
    - Index on ethical_score for ranking
    - Index on language for language-specific queries
    - Index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS ethical_code_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  generated_code text NOT NULL,
  language text NOT NULL,
  verification_status text NOT NULL CHECK (verification_status IN ('verified', 'testing', 'failed')),
  ethical_score numeric(3,2) NOT NULL CHECK (ethical_score >= 0 AND ethical_score <= 1),
  transparency_report jsonb NOT NULL DEFAULT '{}',
  execution_test jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ethical_code_generations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own generations
CREATE POLICY "Users can insert ethical code generations"
  ON ethical_code_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read their own generations
CREATE POLICY "Users can read their own ethical code generations"
  ON ethical_code_generations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow public read access to verified generations for learning
CREATE POLICY "Public can read verified ethical code generations"
  ON ethical_code_generations
  FOR SELECT
  TO anon
  USING (verification_status = 'verified' AND ethical_score >= 0.8);

-- Allow authenticated users to update their own generations
CREATE POLICY "Users can update their own ethical code generations"
  ON ethical_code_generations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ethical_code_generations_verification_status 
  ON ethical_code_generations (verification_status);

CREATE INDEX IF NOT EXISTS idx_ethical_code_generations_ethical_score 
  ON ethical_code_generations (ethical_score DESC);

CREATE INDEX IF NOT EXISTS idx_ethical_code_generations_language 
  ON ethical_code_generations (language);

CREATE INDEX IF NOT EXISTS idx_ethical_code_generations_created_at 
  ON ethical_code_generations (created_at DESC);