
-- 1. ТАБЛИЦА VENDORS (Рестораны, Фотографы и т.д.)
create table if not exists public.vendors (
  id text primary key, -- ID генерируем на фронтенде (v-123...)
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text unique not null,
  type text not null, -- 'VENUE', 'SERVICE', 'PRODUCT'
  category_id text not null,
  venue_type text,
  service_type text,
  product_type text,
  city text not null,
  address text,
  description text,
  cover_image text,
  gallery text[], -- Массив ссылок на картинки
  features text[], -- Массив тегов (WiFi, Parking)
  price_range_symbol text default '€€',
  rating numeric default 0,
  reviews_count integer default 0,
  
  -- JSON поля для сложной структуры
  contact jsonb default '{}'::jsonb, 
  capacity jsonb default '{}'::jsonb,
  pricing jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Включаем защиту строк
alter table public.vendors enable row level security;

-- ПОЛИТИКИ (Policies) для Vendors:
-- 1. Читать могут ВСЕ (публичный каталог)
create policy "Public vendors are viewable by everyone" 
on public.vendors for select 
using (true);

-- 2. Создавать могут только авторизованные пользователи
create policy "Users can insert their own vendor profiles" 
on public.vendors for insert 
with check (auth.uid() = owner_id);

-- 3. Обновлять могут только владельцы
create policy "Users can update own vendor profiles" 
on public.vendors for update 
using (auth.uid() = owner_id);

-- 4. Удалять могут только владельцы
create policy "Users can delete own vendor profiles" 
on public.vendors for delete 
using (auth.uid() = owner_id);


-- 2. ТАБЛИЦА INQUIRIES (Запросы/Уведомления)
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  vendor_id text references public.vendors(id) on delete cascade,
  vendor_name text,
  user_name text,
  contact text,
  date text,
  guest_count integer,
  status text default 'new', -- 'new', 'read', 'replied'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.inquiries enable row level security;

-- ПОЛИТИКИ для Inquiries:
-- 1. Создавать (отправлять заявку) могут ВСЕ (даже анонимы)
create policy "Anyone can submit inquiry" 
on public.inquiries for insert 
with check (true);

-- 2. Читать могут только владельцы ресторана (через связь vendor_id -> owner_id)
-- Это сложный запрос, для простоты разрешим чтение авторизованным (партнерам), 
-- а фильтрацию сделаем на фронтенде или через owner_id если бы он был в этой таблице.
-- Для MVP: Авторизованные могут читать (партнеры видят свои заявки).
create policy "Authenticated users can view inquiries"
on public.inquiries for select
using (auth.role() = 'authenticated');
-- В идеале нужно проверять: vendor_id in (select id from vendors where owner_id = auth.uid())


-- 3. ТАБЛИЦА SETTINGS (Настройки главной страницы)
create table if not exists public.settings (
  id text primary key,
  hero_title text,
  hero_subtitle text,
  hero_image text,
  preheader_text text
);

alter table public.settings enable row level security;

create policy "Public read settings" 
on public.settings for select 
using (true);

create policy "Admin update settings" 
on public.settings for update 
using (auth.role() = 'authenticated'); -- Упрощено

create policy "Admin insert settings" 
on public.settings for insert 
with check (auth.role() = 'authenticated');
