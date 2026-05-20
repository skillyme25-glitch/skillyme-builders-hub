
-- Lock search_path on tg_set_updated_at
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin new.updated_at = now(); return new; end $$;

-- Revoke public/anon/auth EXECUTE on both helper functions; triggers still work as owner
revoke execute on function public.tg_set_updated_at()    from public, anon, authenticated;
revoke execute on function public.handle_new_user()      from public, anon, authenticated;
