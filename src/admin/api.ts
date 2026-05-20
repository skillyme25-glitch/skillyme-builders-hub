// Client wrapper for the admin-api edge function. Stores the verified password
// in sessionStorage so it survives page refreshes within the tab.

const FN = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`;
const PUBKEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const PW_KEY = "skillyme-admin-pw";

export const getStoredPassword = () => sessionStorage.getItem(PW_KEY);
export const clearStoredPassword = () => sessionStorage.removeItem(PW_KEY);

async function call(payload: Record<string, unknown>) {
  const res = await fetch(FN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: PUBKEY,
      Authorization: `Bearer ${PUBKEY}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
  return body;
}

export async function verifyPassword(password: string) {
  await call({ password, action: "verify" });
  sessionStorage.setItem(PW_KEY, password);
}

const withPw = (extra: Record<string, unknown>) => {
  const password = getStoredPassword();
  if (!password) throw new Error("Admin session expired. Please unlock again.");
  return { password, ...extra };
};

export const adminUpsert = (table: string, rows: Record<string, unknown>[]) =>
  call(withPw({ action: "upsert", table, rows }));

export const adminDelete = (table: string, ids: string[]) =>
  call(withPw({ action: "delete", table, ids }));

export const adminCreateBuilder = (profile: Record<string, unknown>) =>
  call(withPw({ action: "create_builder", profile }));

export const adminDeleteBuilder = (id: string) =>
  call(withPw({ action: "delete_builder", id }));

export const adminUpdatePassword = (newPassword: string) =>
  call(withPw({ action: "update_password", newPassword }));
