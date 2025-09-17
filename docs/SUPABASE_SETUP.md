# Supabase Integration Guide

## Overview

This guide explains how to set up and configure Supabase for use with Codette. Supabase provides our backend with:
- User authentication
- Real-time database
- Row Level Security (RLS)
- File storage
- Edge functions

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- Access to Supabase dashboard
- Node.js 18+ and Python 3.11+
- Codette repository cloned locally

## Initial Setup

1. Create a new Supabase project:
   - Go to https://app.supabase.com/projects
   - Click "New Project"
   - Enter project details
   - Choose region closest to your users
   - Wait for database to be provisioned

2. Get project credentials:
   ```bash
   # Project URL (API URL)
   https://your-project-id.supabase.co

   # Project API keys
   anon public key: your-anon-key
   service_role key: your-service-key
   ```

3. Set up environment variables:
   ```bash
   # Frontend (.env)
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key

   # Backend (backend/.env)
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_KEY=your_service_key
   DATABASE_URL=postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

## Database Schema

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- User profiles
create table public.profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- AI memories
create table public.memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  context jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for memories
alter table public.memories enable row level security;

create policy "Users can view their own memories"
  on memories for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own memories"
  on memories for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own memories"
  on memories for update
  using ( auth.uid() = user_id );

-- AI signals
create table public.signals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  pattern text not null,
  strength float8 not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- RLS for signals
alter table public.signals enable row level security;

create policy "Users can view their own signals"
  on signals for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own signals"
  on signals for insert
  with check ( auth.uid() = user_id );

-- Optimization results
create table public.optimizations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  objectives jsonb not null,
  results jsonb not null,
  created_at timestamptz default now()
);

-- RLS for optimizations
alter table public.optimizations enable row level security;

create policy "Users can view their own optimizations"
  on optimizations for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own optimizations"
  on optimizations for insert
  with check ( auth.uid() = user_id );
```

## Authentication Setup

1. Configure auth providers in Supabase dashboard:
   - Go to Authentication > Providers
   - Enable Email/Password sign-in
   - (Optional) Configure OAuth providers:
     - GitHub
     - Google
     - Discord

2. Configure auth settings:
   - Go to Authentication > Settings
   - Enable "Confirm email"
   - Set "Site URL" to your frontend URL
   - Configure redirect URLs

3. Update security settings:
   - Go to Authentication > Policies
   - Review and adjust RLS policies
   - Set up JWT claims if needed

## Storage Setup

1. Create storage buckets:
   ```sql
   -- Create public bucket for avatars
   insert into storage.buckets (id, name)
   values ('avatars', 'avatars');

   -- Create private bucket for user data
   insert into storage.buckets (id, name)
   values ('user-data', 'user-data');
   ```

2. Configure storage policies:
   ```sql
   -- Public access for avatars
   create policy "Avatar images are publicly accessible"
     on storage.objects for select
     using ( bucket_id = 'avatars' );

   -- Authenticated uploads for avatars
   create policy "Users can upload avatars"
     on storage.objects for insert
     with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

   -- Private user data access
   create policy "Users can access their own data"
     on storage.objects for select
     using ( bucket_id = 'user-data' AND auth.uid() = owner );

   create policy "Users can upload their own data"
     on storage.objects for insert
     with check ( bucket_id = 'user-data' AND auth.uid() = owner );
   ```

## Real-time Subscriptions

Enable real-time for required tables:

```sql
-- Enable real-time for memories
alter publication supabase_realtime add table memories;

-- Enable real-time for signals
alter publication supabase_realtime add table signals;

-- Enable real-time for optimizations
alter publication supabase_realtime add table optimizations;
```

## Edge Functions

1. Create function for AI processing:
   ```bash
   # Install Supabase CLI
   npm install -g supabase-cli

   # Create new function
   supabase functions new process-ai-signal

   # Deploy function
   supabase functions deploy process-ai-signal
   ```

2. Configure function:
   ```typescript
   // supabase/functions/process-ai-signal/index.ts
   import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

   serve(async (req) => {
     const supabaseClient = createClient(
       Deno.env.get('SUPABASE_URL') ?? '',
       Deno.env.get('SUPABASE_ANON_KEY') ?? ''
     )

     const { signal } = await req.json()
     // Process signal with AI
     // Store results

     return new Response(JSON.stringify({ processed: true }), {
       headers: { 'Content-Type': 'application/json' },
     })
   })
   ```

## Monitoring & Maintenance

1. Set up database monitoring:
   - Go to Database > Monitoring
   - Configure metric alerts
   - Set up error notifications

2. Regular maintenance:
   ```sql
   -- Vacuum analyze tables
   vacuum analyze memories;
   vacuum analyze signals;
   vacuum analyze optimizations;

   -- Update statistics
   analyze memories;
   analyze signals;
   analyze optimizations;
   ```

3. Backup configuration:
   - Enable point-in-time recovery
   - Configure backup schedule
   - Test backup restoration

## Security Best Practices

1. API Security:
   - Use service_role key only in backend
   - Never expose service_role key in frontend
   - Use anon key for public operations

2. RLS Policies:
   - Always enable RLS on new tables
   - Test policies thoroughly
   - Use least privilege principle

3. Data Validation:
   - Validate inputs in application code
   - Use database constraints
   - Implement rate limiting

## Troubleshooting

1. Authentication Issues:
   ```sql
   -- Check auth config
   select * from auth.config;

   -- View auth attempts
   select * from auth.audit_log_entries
   order by created_at desc;
   ```

2. Database Issues:
   ```sql
   -- Check active connections
   select * from pg_stat_activity;

   -- View slow queries
   select * from pg_stat_statements
   order by total_time desc;
   ```

3. Real-time Issues:
   ```sql
   -- Check real-time config
   select * from pg_publication;

   -- View real-time stats
   select * from pg_stat_replication;
   ```

## Performance Optimization

1. Database Indexes:
   ```sql
   -- Add indexes for common queries
   create index idx_memories_user_id on memories(user_id);
   create index idx_signals_user_id on signals(user_id);
   create index idx_optimizations_user_id on optimizations(user_id);
   ```

2. Connection Pooling:
   - Configure pgBouncer in Supabase dashboard
   - Set appropriate pool sizes
   - Monitor connection usage

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.io/docs/guides/auth/row-level-security)
- [Real-time Guide](https://supabase.io/docs/guides/realtime)
- [Edge Functions Guide](https://supabase.io/docs/guides/functions)