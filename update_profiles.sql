-- 1. Adicionar novos campos na tabela profiles
alter table public.profiles 
add column if not exists birth_date date,
add column if not exists cpf text unique;

-- 2. Atualizar a função de criação automática de perfil
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, birth_date, cpf, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'birth_date')::date,
    new.raw_user_meta_data->>'cpf',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;
