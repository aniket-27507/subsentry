-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text unique,
  full_name text,
  currency_preference text default '₹',
  theme text default 'light',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for subscriptions
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  category text not null,
  amount numeric not null,
  currency text not null,
  billing_cycle text not null,
  first_payment_date date,
  next_renewal_date date,
  payment_method text,
  notes text,
  status text default 'active',
  reminder_enabled boolean default true,
  reminder_days_before integer default 7,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for subscriptions
alter table subscriptions enable row level security;

-- Create policies for subscriptions
create policy "Users can view own subscriptions." on subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can insert own subscriptions." on subscriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own subscriptions." on subscriptions
  for update using (auth.uid() = user_id);

create policy "Users can delete own subscriptions." on subscriptions
  for delete using (auth.uid() = user_id);

-- Trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

