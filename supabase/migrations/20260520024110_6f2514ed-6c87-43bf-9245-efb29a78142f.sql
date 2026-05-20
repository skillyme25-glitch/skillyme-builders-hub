
create or replace function public.verify_admin_password(p text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from public.admin_secrets
    where id = 1 and password_hash = crypt(p, password_hash)
  );
$$;

create or replace function public.set_admin_password(p text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update public.admin_secrets
  set password_hash = crypt(p, gen_salt('bf', 10)),
      updated_at = now()
  where id = 1;
$$;

revoke execute on function public.verify_admin_password(text) from public, anon, authenticated;
revoke execute on function public.set_admin_password(text)     from public, anon, authenticated;
