# Skillyme — Accounts, Admin Overhaul & Team-Aware Workspace

Confirmed decisions: **Lovable Cloud** for auth + data, **password gate** on `/admin`, **same brand simplified** admin look, **minimal signup** then profile completion.

Because of the size, I'll ship in 3 phases. Phase 1 lands the foundation; we won't see the new admin until Phase 2. Each phase is a single send.

---

## Phase 1 — Backend foundation (this turn)

**Enable Lovable Cloud** and create the schema everything else builds on.

Tables:
- `projects` — id, number, slug, name, one_liner, icon_key
- `teams` — id, project_id (FK), letter (A/B), name
- `profiles` — id (= auth.users.id), email, full_name, role, role_detail, country, country_flag, initials, team_id (FK, nullable), is_viewer flag dropped (use auth.uid)
- `weeks` — id, number, date_range, theme, status, expectations[], check_in_due, check_in_status, submission_due, submission_status, deliverable_summary, reviewed_by uuid[]
- `mentor_sessions` — id, project_id (FK), date_label, focus, meet_url, past
- `mentors` — id, project_id (FK), name, initials, bio, industry
- `events` — id, date, time_label, title, type, attendees_label, location
- `faqs` — id, sort_order, question, answer
- `site_settings` — singleton row: deadline_title, deadline_date_label, hours_remaining, total_window_hours, project_brief (text[]), admin_password_hash

RLS:
- `projects`, `teams`, `weeks`, `mentor_sessions`, `mentors`, `events`, `faqs`, `site_settings`, public profile fields → **public read**
- Writes on all of the above → **admin only** (via edge function, see Phase 2)
- `profiles`: user can read all, can update only their own row

Seed: run inserts to mirror the current mock data so nothing visually regresses.

**Auth**: enable email/password. No social provider (can add later).

---

## Phase 2 — Admin overhaul (next turn)

- New `/admin` layout: top bar with section nav, light-surface content cards, form-first (no raw JSON anywhere).
- Password gate: simple modal that checks against `site_settings.admin_password_hash` via edge function `verify-admin-password`. Successful unlock stores a short-lived session flag.
- Section editors — all forms, all CRUD:
  - **Deadline & brief** — inline fields + paragraph list editor
  - **Weeks** — per-week form with chip lists for expectations, status selects
  - **Mentor** — profile + sessions list (add/edit/remove)
  - **Projects** — name, one-liner, icon picker
  - **Teams** — add/rename/remove, assign to project
  - **Builders** — full CRUD: name, role, role detail, country, team assignment, "active today" toggle
  - **Calendar events** — per-event form
  - **FAQs** — per-item question/answer with drag-reorder
- All writes go through an `admin-write` edge function that re-checks the password before mutating.

---

## Phase 3 — Participant accounts & team-aware UI (final turn)

- `/signup` — email + password only.
- `/login` — email + password, with forgot-password.
- `/complete-profile` — gated step shown until profile is filled: full name, role, country, country flag (auto from country), then **project → team** cascading select (only shows teams that still have a seat open, configurable).
- On submit: upsert into `profiles`, set `team_id`, redirect to `/workspace`.
- **Workspace** rewritten to read the signed-in user's team from `profiles`, then load that team's weeks/mentor/builders. Viewer highlighting uses `auth.uid()` instead of hard-coded `VIEWER_ID`.
- **Builders** rewritten to load `projects → teams → profiles` from the DB. The signed-in user's seat is auto-highlighted. Admin-added builders appear here immediately.
- Route guard: unauthenticated users sent to `/welcome` (public) or `/login`; authenticated-but-incomplete sent to `/complete-profile`.

---

## Technical notes

- All DB reads from the frontend use the Supabase client with anon key (publishable, fine in code).
- Admin password is stored as a bcrypt hash in `site_settings`; verification only ever happens server-side in an edge function. No password in client bundle.
- The old `src/admin/overrides.ts` and `src/data/mock.ts` static exports get retired in Phase 3; `directory.ts` becomes a typed fetch layer over Supabase.
- `applyOverrides()` call in `main.tsx` removed at the end of Phase 2.

---

## What I need from you

1. **Approve the plan** so I can start Phase 1.
2. **Initial admin password** — I'll set a placeholder (`skillyme-admin`) you can change from the admin UI later. Tell me if you want a different starter.
3. **Project icons** — current ones (real-estate, etc.) stay; admin picker will offer the same set. OK?
