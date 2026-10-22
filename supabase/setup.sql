-- Execute no SQL Editor do seu próprio projeto Supabase.
create table if not exists public.startzy_records (
  owner_id uuid not null references auth.users(id) on delete cascade,
  collection text not null check (collection in ('leads','marketing','events','imports')),
  id text not null,
  external_key text,
  payload jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id,collection,id)
);
create unique index if not exists startzy_records_external on public.startzy_records(owner_id,collection,external_key) where external_key is not null;
alter table public.startzy_records enable row level security;
revoke all on public.startzy_records from anon;
grant select, insert, update, delete on public.startzy_records to authenticated;
drop policy if exists "Startzy owner read" on public.startzy_records;
drop policy if exists "Startzy owner insert" on public.startzy_records;
drop policy if exists "Startzy owner update" on public.startzy_records;
drop policy if exists "Startzy owner delete" on public.startzy_records;
create policy "Startzy owner read" on public.startzy_records for select to authenticated using (owner_id=auth.uid());
create policy "Startzy owner insert" on public.startzy_records for insert to authenticated with check (owner_id=auth.uid());
create policy "Startzy owner update" on public.startzy_records for update to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy "Startzy owner delete" on public.startzy_records for delete to authenticated using (owner_id=auth.uid());
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('startzy-assets','startzy-assets',false,4194304,array['image/png','image/jpeg','image/webp']) on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Startzy image read" on storage.objects;
drop policy if exists "Startzy image insert" on storage.objects;
create policy "Startzy image read" on storage.objects for select to authenticated using (bucket_id='startzy-assets' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Startzy image insert" on storage.objects for insert to authenticated with check (bucket_id='startzy-assets' and (storage.foldername(name))[1]=auth.uid()::text);
