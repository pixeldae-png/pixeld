create extension if not exists pgcrypto;
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  client_name text, description text, category text, cover_image_url text, website_url text,
  case_study_url text, technologies text[] not null default '{}', featured boolean not null default false,
  sort_order integer not null default 0, project_year integer, is_visible boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.project_images (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null, alt_text text, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create index projects_public_order_idx on public.projects(is_visible, sort_order);
create index project_images_project_idx on public.project_images(project_id, sort_order);
create function public.set_updated_at() returns trigger language plpgsql security invoker set search_path='' as $$ begin new.updated_at=now(); return new; end $$;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.admin_users enable row level security;
create policy "Admins can view own membership" on public.admin_users for select to authenticated using(user_id=auth.uid());
create policy "Public can view visible projects" on public.projects for select using (is_visible=true or exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Public can view images for visible projects" on public.project_images for select using (exists(select 1 from public.projects p where p.id=project_id and (p.is_visible=true or exists(select 1 from public.admin_users a where a.user_id=auth.uid()))));
create policy "Admins manage projects" on public.projects for all to authenticated using(exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check(exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins manage images" on public.project_images for all to authenticated using(exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check(exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('project-images','project-images',true,10485760,array['image/jpeg','image/png','image/webp','image/avif']) on conflict(id) do update set public=true,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
create policy "Public project images" on storage.objects for select using(bucket_id='project-images');
create policy "Admins upload project images" on storage.objects for insert to authenticated with check(bucket_id='project-images' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins update project images" on storage.objects for update to authenticated using(bucket_id='project-images' and exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check(bucket_id='project-images' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Admins delete project images" on storage.objects for delete to authenticated using(bucket_id='project-images' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
