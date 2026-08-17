-- Supabase 建表 SQL：报名表
-- 在 Supabase 控制台 → SQL Editor → New query 里粘贴执行

create table public.signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  major text not null,
  phone text not null,
  "group" text not null default '无',
  created_at timestamptz default now()
);

-- 开启行级安全
alter table public.signups enable row level security;

-- 允许任何人（未登录）提交报名
create policy "允许匿名提交报名" on public.signups
  for insert
  to anon
  with check (true);
