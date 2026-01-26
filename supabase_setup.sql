
-- 1. Создаем таблицу users, если она еще не существует
create table if not exists public.users (
  uid uuid references auth.users on delete cascade not null primary key,
  email text,
  first_name text,
  last_name text,
  phone text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_date date,
  event_type text,
  guest_count integer,
  preferences jsonb
);

-- 2. Включаем Row Level Security (RLS)
alter table public.users enable row level security;

-- 3. Политики безопасности (Policies)

-- Разрешить всем читать профили (нужно для входа и проверки ролей)
create policy "Public profiles are viewable by everyone" 
on public.users for select 
using (true);

-- Разрешить пользователям создавать СВОЙ профиль при регистрации
-- Важно: auth.uid() должно совпадать с uid вставляемой записи
create policy "Users can insert their own profile" 
on public.users for insert 
with check (auth.uid() = uid);

-- Разрешить пользователям обновлять СВОЙ профиль
create policy "Users can update own profile" 
on public.users for update 
using (auth.uid() = uid);

-- 4. (Опционально) Триггер для автоматического создания профиля
-- Это самый надежный способ. Если фронтенд не сможет создать запись, это сделает база данных.
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (uid, email, first_name, last_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (uid) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Назначаем триггер на создание пользователя в auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
