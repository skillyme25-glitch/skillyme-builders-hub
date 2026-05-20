
-- Extensions
create extension if not exists pgcrypto;

-- =========================
-- Tables
-- =========================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  slug text not null unique,
  name text not null,
  one_liner text not null default '',
  icon_key text not null default 'briefcase',
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  letter text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (project_id, letter)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text,
  role_detail text,
  country text,
  country_flag text,
  initials text,
  team_id uuid references public.teams(id) on delete set null,
  active_today boolean not null default false,
  is_admin boolean not null default false,
  profile_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weeks (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  number int not null,
  date_range text not null,
  theme text not null,
  status text not null default 'upcoming',
  expectations text[] not null default '{}',
  check_in_due text,
  check_in_status text not null default 'upcoming',
  submission_due text,
  submission_status text not null default 'upcoming',
  deliverable_summary text not null default '',
  reviewed_by uuid[] not null default '{}',
  unique (team_id, number)
);

create table public.mentors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  initials text,
  bio text,
  industry text
);

create table public.mentor_sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references public.mentors(id) on delete cascade,
  date_label text,
  focus text,
  meet_url text,
  past boolean not null default false,
  sort_order int not null default 0
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  date_label text,
  time_label text,
  title text,
  type text,
  attendees_label text,
  location text,
  sort_order int not null default 0
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  question text not null,
  answer text not null
);

create table public.site_settings (
  id int primary key default 1,
  deadline_title text,
  deadline_date_label text,
  hours_remaining int,
  total_window_hours int,
  project_brief text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

create table public.admin_secrets (
  id int primary key default 1,
  password_hash text not null,
  updated_at timestamptz not null default now(),
  constraint admin_secrets_singleton check (id = 1)
);

-- =========================
-- updated_at trigger
-- =========================
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.tg_set_updated_at();

-- =========================
-- Auto-create profile on signup
-- =========================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================
-- RLS
-- =========================
alter table public.projects        enable row level security;
alter table public.teams           enable row level security;
alter table public.profiles        enable row level security;
alter table public.weeks           enable row level security;
alter table public.mentors         enable row level security;
alter table public.mentor_sessions enable row level security;
alter table public.events          enable row level security;
alter table public.faqs            enable row level security;
alter table public.site_settings   enable row level security;
alter table public.admin_secrets   enable row level security;

-- Public read on cohort data
create policy "public read projects"         on public.projects        for select using (true);
create policy "public read teams"            on public.teams           for select using (true);
create policy "public read weeks"            on public.weeks           for select using (true);
create policy "public read mentors"          on public.mentors         for select using (true);
create policy "public read mentor sessions"  on public.mentor_sessions for select using (true);
create policy "public read events"           on public.events          for select using (true);
create policy "public read faqs"             on public.faqs            for select using (true);
create policy "public read site_settings"    on public.site_settings   for select using (true);

-- Profiles: anyone can read, only owner can update; insert handled by trigger
create policy "public read profiles" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- admin_secrets: NO policies => no client access. Service role bypasses RLS.

-- =========================
-- Seed: projects
-- =========================
insert into public.projects (number, slug, name, one_liner, icon_key) values
  (1, 'real-estate',   'Real Estate Management',   'Property management for African operators — multi-tenant compounds, mobile money rent flows, phone-first portfolios.', 'building'),
  (2, 'agritech',      'Agritech & Supply Chain',  'Tools that move produce from smallholder farms to urban buyers without losing margin to middlemen.', 'sprout'),
  (3, 'fintech-sme',   'SME Fintech',              'Lending, bookkeeping, and cash-flow visibility for the corner-shop economy.', 'wallet'),
  (4, 'edtech',        'Skills & EdTech',          'Vocational training delivered over low-bandwidth devices and WhatsApp.', 'graduation-cap'),
  (5, 'healthtech',    'Healthtech',               'Patient records, clinic operations, and telehealth tuned for African primary care.', 'heart-pulse');

-- =========================
-- Seed: teams (2 per project)
-- =========================
insert into public.teams (project_id, letter, name)
select p.id, l.letter, p.name || ' — Team ' || l.letter
from public.projects p
cross join (values ('A'), ('B')) as l(letter);

-- =========================
-- Seed: weeks for Real Estate Team A
-- =========================
do $$
declare t_id uuid;
begin
  select t.id into t_id
  from public.teams t join public.projects p on p.id = t.project_id
  where p.slug = 'real-estate' and t.letter = 'A';

  insert into public.weeks (team_id, number, date_range, theme, status, expectations, check_in_due, check_in_status, submission_due, submission_status, deliverable_summary)
  values
  (t_id, 1, 'May 25 — May 31', 'Problem Definition', 'submitted',
   array['Map the core problem your team is solving','Interview at least 3 potential users','Agree on internal team roles','Submit your Problem Statement document by Sunday'],
   'Due Wednesday, May 28 · 23:59 EAT', 'submitted',
   'Due Sunday, June 1 · 23:59 EAT', 'submitted',
   'A one-page Problem Statement document identifying the specific problem, the target user, and the current workaround — maximum 500 words.'),
  (t_id, 2, 'June 1 — June 7', 'User Research & Wireframes', 'active',
   array['Complete 3 deep user interviews with property managers in your city','Synthesise insights into a user journey map','Produce wireframes for the core product flow','Lock the technology stack with the technical lead'],
   'Due Wednesday, June 4 · 23:59 EAT', 'open',
   'Due Sunday, June 8 · 23:59 EAT', 'upcoming',
   '3 user interview summaries (PDF or Doc link), core product wireframes (Figma or PDF), and a written rationale for your chosen technology stack.'),
  (t_id, 3, 'June 8 — June 14', 'First Build — Core Loop', 'upcoming',
   array['Ship a working prototype of the single most important user flow','Internal demo to mentor mid-week','Begin onboarding your first test user'],
   'Due Wednesday, June 11 · 23:59 EAT', 'upcoming',
   'Due Sunday, June 15 · 23:59 EAT', 'upcoming',
   'A working prototype link (hosted, not local) plus a 60-second video walkthrough of the core user flow.'),
  (t_id, 4, 'June 15 — June 21', 'Test, Break, Iterate', 'upcoming',
   array['Onboard at least 2 real users','Capture all blocking bugs and friction points','Iterate the product based on what you observed, not what users said'],
   'Due Wednesday, June 18 · 23:59 EAT', 'upcoming',
   'Due Sunday, June 22 · 23:59 EAT', 'upcoming',
   'Iteration log, updated prototype link, and a written user testing report.'),
  (t_id, 5, 'June 22 — June 28', 'Polish & Pricing', 'upcoming',
   array['Lock the MVP feature set','Define your pricing model and go-to-market hypothesis','Prepare your gala pitch deck — first draft'],
   'Due Wednesday, June 25 · 23:59 EAT', 'upcoming',
   'Due Sunday, June 29 · 23:59 EAT', 'upcoming',
   'Pitch deck (PDF), pricing model document, and updated hosted product link.'),
  (t_id, 6, 'June 29 — July 3', 'Ship & Present', 'upcoming',
   array['Submit final MVP by Monday June 30','Pitch rehearsal with mentor on Tuesday','Gala Day 1 — Judging on Thursday July 2','Gala Day 2 — Buyer presentations on Friday July 3'],
   'Due Wednesday, July 2 · 12:00 EAT', 'upcoming',
   'Final MVP — Due Monday, June 30 · 23:59 EAT', 'upcoming',
   'Final hosted product, full source repository, gala pitch deck, and signed go-to-market plan.');
end $$;

-- =========================
-- Seed: mentor
-- =========================
do $$
declare p_id uuid; m_id uuid;
begin
  select id into p_id from public.projects where slug = 'real-estate';
  insert into public.mentors (project_id, name, initials, bio, industry)
  values (p_id, 'James Kariuki', 'JK',
    'Twelve years building and selling property management systems across East Africa. Former CTO at a Nairobi-based proptech acquired in 2023.',
    'Real Estate — 12 years, Kenya Property Developers Association')
  returning id into m_id;

  insert into public.mentor_sessions (mentor_id, date_label, focus, meet_url, past, sort_order) values
   (m_id, 'Tuesday, May 20 · 16:00 EAT', 'Pre-sprint Orientation', '#', true, 0),
   (m_id, 'Tuesday, May 27 · 16:00 EAT', 'Week 1 Review — Problem Statement', 'https://meet.google.com/abc-defg-hij', false, 1),
   (m_id, 'Tuesday, June 3 · 16:00 EAT', 'Week 2 Review — User Research & Wireframes', 'https://meet.google.com/abc-defg-hij', false, 2),
   (m_id, 'Tuesday, June 10 · 16:00 EAT', 'Mid-Sprint Showcase Prep', 'https://meet.google.com/abc-defg-hij', false, 3);
end $$;

-- =========================
-- Seed: site_settings
-- =========================
insert into public.site_settings (id, deadline_title, deadline_date_label, hours_remaining, total_window_hours, project_brief)
values (1, 'Week 2 Check-In', 'Wednesday, June 4', 31, 168,
  array[
    'African property managers operate without the digital infrastructure their counterparts in mature markets take for granted. Rent collection happens over WhatsApp. Maintenance requests are lost in voice notes. Tenant records sit in paper ledgers behind reception desks across Nairobi, Lagos, and Accra.',
    'The opportunity is not to copy Western property management software. It is to design for the actual workflows of an African property manager — multi-tenant compounds, M-Pesa and mobile money rent flows, informal maintenance networks, and landlords who manage portfolios from a phone, not a laptop.',
    'Your team has six weeks to ship a product a real Nairobi property manager would pay for on day one. The judging panel includes two managing directors of property firms with combined portfolios exceeding 4,000 units. They will tell you, on July 3, whether they would buy.'
  ]);

-- =========================
-- Seed: faqs
-- =========================
insert into public.faqs (sort_order, question, answer) values
 (1, 'When does the program officially start?', 'Week 1 begins Monday May 25, 2026. The cohort kickoff call is Sunday May 24 at 18:00 EAT.'),
 (2, 'What happens if my team misses a submission?', 'A missed weekly submission is logged and reviewed by the Skillyme Africa team. Two missed submissions trigger a mentor escalation. Three put your team out of contention for buyer presentations.'),
 (3, 'How are the gala judges chosen?', 'Each project domain has 2–3 senior buyers from real African firms. For Real Estate, the panel includes managing directors of property groups managing 4,000+ units combined.'),
 (4, 'Can I switch teams or projects?', 'Team assignments are locked after Week 1. If there is a genuine fit issue, raise it with your mentor before the Week 1 submission.'),
 (5, 'What does "buyer-ready" mean on July 3?', 'A hosted product, a working pricing model, and a 7-minute pitch that a real buyer could greenlight on the spot.');

-- =========================
-- Seed: admin password (skillyme-admin)
-- bcrypt $2a hash generated with cost 10
-- =========================
insert into public.admin_secrets (id, password_hash)
values (1, crypt('skillyme-admin', gen_salt('bf', 10)));
