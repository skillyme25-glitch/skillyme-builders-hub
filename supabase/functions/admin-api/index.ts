// Admin write API. Verifies the password via a SECURITY DEFINER postgres
// function (uses pgcrypto's crypt), then performs the requested mutation
// with the service role key.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_TABLES = new Set([
  "projects",
  "teams",
  "weeks",
  "mentors",
  "mentor_sessions",
  "events",
  "faqs",
  "site_settings",
  "profiles",
]);

const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad json" }, 400);
  }

  const password = body.password as string | undefined;
  if (!password || typeof password !== "string") {
    return json({ error: "missing password" }, 401);
  }

  const { data: ok, error: verifyErr } = await supabase.rpc("verify_admin_password", { p: password });
  if (verifyErr) return json({ error: verifyErr.message }, 500);
  if (!ok) return json({ error: "invalid password" }, 401);

  const action = body.action as string | undefined;

  if (action === "verify") return json({ ok: true });

  if (action === "update_password") {
    const newPassword = body.newPassword as string | undefined;
    if (!newPassword || newPassword.length < 6) {
      return json({ error: "password must be 6+ chars" }, 400);
    }
    const { error } = await supabase.rpc("set_admin_password", { p: newPassword });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  if (action === "create_builder") {
    const profile = body.profile as Record<string, unknown> | undefined;
    if (!profile?.email || !profile?.full_name) {
      return json({ error: "email and full_name required" }, 400);
    }
    const randomPw = crypto.randomUUID() + "Aa1!";
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: profile.email as string,
      password: randomPw,
      email_confirm: true,
    });
    if (createErr) return json({ error: createErr.message }, 400);
    const uid = created.user!.id;
    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        role: profile.role ?? null,
        role_detail: profile.role_detail ?? null,
        country: profile.country ?? null,
        country_flag: profile.country_flag ?? null,
        initials: profile.initials ?? null,
        team_id: profile.team_id ?? null,
        active_today: profile.active_today ?? false,
        profile_complete: true,
      })
      .eq("id", uid);
    if (upErr) return json({ error: upErr.message }, 400);
    return json({ ok: true, id: uid });
  }

  if (action === "delete_builder") {
    const id = body.id as string | undefined;
    if (!id) return json({ error: "id required" }, 400);
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  const table = body.table as string | undefined;
  if (!table || !ALLOWED_TABLES.has(table)) {
    return json({ error: "bad table" }, 400);
  }

  if (action === "upsert") {
    const rows = body.rows as Record<string, unknown>[] | undefined;
    if (!Array.isArray(rows)) return json({ error: "rows must be array" }, 400);
    const { data, error } = await supabase.from(table).upsert(rows).select();
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true, data });
  }

  if (action === "delete") {
    const ids = body.ids as string[] | undefined;
    if (!Array.isArray(ids)) return json({ error: "ids must be array" }, 400);
    const { error } = await supabase.from(table).delete().in("id", ids);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: "unknown action" }, 400);
});
