-- PIXELD — initial schema: projects, project_images, testimonials
-- Auth model: Supabase Auth is used ONLY for the admin login (no public sign-up
-- flow is exposed in this app). Any authenticated user is treated as an admin,
-- so only create trusted accounts in the Supabase dashboard.

create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client text,
  description text,
  category text,
  cover_image text,
  website_url text,
  technologies text[] not null default '{}',
  year int,
  featured boolean not null default false,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  quote text not null,
  avatar_url text,
  visible boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- keep updated_at fresh on projects
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- Row Level Security
alter table projects enable row level security;
alter table project_images enable row level security;
alter table testimonials enable row level security;

-- Public (anon) can only read visible rows
create policy "public read visible projects" on projects
  for select using (visible = true);

create policy "public read images of visible projects" on project_images
  for select using (
    exists (select 1 from projects p where p.id = project_images.project_id and p.visible = true)
  );

create policy "public read visible testimonials" on testimonials
  for select using (visible = true);

-- Authenticated (admin) full CRUD
create policy "admin full access projects" on projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access project_images" on project_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access testimonials" on testimonials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket for project media (public read, admin write)
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

create policy "public read project-media" on storage.objects
  for select using (bucket_id = 'project-media');

create policy "admin write project-media" on storage.objects
  for insert with check (bucket_id = 'project-media' and auth.role() = 'authenticated');

create policy "admin update project-media" on storage.objects
  for update using (bucket_id = 'project-media' and auth.role() = 'authenticated');

create policy "admin delete project-media" on storage.objects
  for delete using (bucket_id = 'project-media' and auth.role() = 'authenticated');
