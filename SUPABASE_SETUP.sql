-- Run this in your Supabase SQL Editor

-- Drop existing table if you want a clean slate
drop table if exists songs;

-- Create the songs table
create table songs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  artist text not null,
  description text,
  posted_by text not null,
  image_url text not null,
  audio_url text not null,
  user_id uuid default auth.uid()
);

-- Enable RLS
alter table songs enable row level security;

-- Create policies (modify as needed for security)
drop policy if exists "Public songs are viewable by everyone" on songs;
create policy "Public songs are viewable by everyone" on songs
  for select using (true);

drop policy if exists "Users can upload songs" on songs;
create policy "Users can upload songs" on songs
  for insert with check (true);

-- Create Storage Buckets (will skip if they already exist)
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('songs', 'songs', true)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Images are publicly accessible" on storage.objects;
create policy "Images are publicly accessible" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "Songs are publicly accessible" on storage.objects;
create policy "Songs are publicly accessible" on storage.objects
  for select using (bucket_id = 'songs');

drop policy if exists "Anyone can upload images" on storage.objects;
create policy "Anyone can upload images" on storage.objects
  for insert with check (bucket_id = 'images');

drop policy if exists "Anyone can upload songs" on storage.objects;
create policy "Anyone can upload songs" on storage.objects
  for insert with check (bucket_id = 'songs');
